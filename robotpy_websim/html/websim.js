"use strict";

function IOModule() {
	
	// The DOM element of the IOModule
	this.element = null;
	
	// The title displayed for the module
	this.title = 'Just Another IOModule';
	
	// The higher the order the later it will appear in the DOM
	this.order = 100;
	
	// Modifies the data sent to the server. The most recent
	// data from the server will be passed by reference. 
	// The data passed to this function will reflect modifications 
	// made by IOModules' modify_data_to_server functions
	this.modify_data_to_server = function(data_to_server) {};
	
	// Modifies the content displayed using a copy of the most 
	// recent data from the server.
	this.update_interface = function(data_from_server) {};
	
	this.set_position = function(x, y, dont_save) {
		
		this.element.css({
			'left' : x,
			'top' : y,
		});
		
	};
	
	this.get_x = function() {
		return this.element.position().left;
	};
	
	this.get_y = function() {
		return this.element.position().top;
	};
}

var sim = new function() {
	
	var sim = this;
	
	this.config = {};
	
	// constant that controls the time between interface updates
	this.UPDATE_RATE = 100;
		
	// Object that holds all the ioModules. Property names are the id 
	// names of the IOModules passed to the ioModule jquery functions
	this.iomodules = {};
	
	// True if the simulator is running
	this.is_running = false;
		
	//model of the robot
	this.robot = {};
	
	//physics modules
	this.physics_modules = {};
	
	//time of last update
	var time_of_last_update = null;
	
	//date object
	var date = new Date();
	
	//websocket object
	var socket = null;
	
	// Listens to the socket when it connects/disconnects
	var connection_listeners = [];
	var connected = false;
	
	// dictionary received from server
	var data_from_server = null;
	
	// dictionary that can be transmitted to sim
	var data_to_server = null;
	

	this.load_modules_and_start = function() {

		var that = this;
		
		// grab the list of modules from the server, and load them
		// TODO: Provide a way for the module list to be ordered
		$.getJSON('/api/module_list', function(data) {
			
			var modules = data.builtin.concat(data.user);
			var i = 0;
			
			function loadNext() {
				if (i == modules.length) {
					that.start();
				}
				
				$.getScript(modules[i++], loadNext);
				
				layout_manager.set_dom_order();
			}
			
			loadNext();
		});
	}
	
	/*
	 * Creates an IOModule and then returns it.
	 * Will return null if the simulator is currently running or if
	 * the id is already associated with another IOModule.
	 */
	
	this.add_iomodule = function(id, iomodule_func, callback) {

		// Do nothing if module has already been added, or module passed is invalid
		if(this.iomodules.hasOwnProperty(id) || _.isFunction(iomodule_func) == false) {
			return false;
		}
		
		// Create the module
		iomodule_func.prototype = new IOModule();
		var iomodule = new iomodule_func();
		
		iomodule.element = $('<div id="' + id + '"></div>').appendTo('#iomodules');
		iomodule.element.addClass('iomodule');
		iomodule.element.prepend('<h4 class="title noselect cursor-grab">' + iomodule.title + '</h4>');
		
		// Add css
		$.ajax({
			type: 'GET',
			url: 'modules/' + id + '/' + id + '.css',
			success: function() {
				sim.add_css('modules/' + id + '/' + id + '.css');
			},
			
			// Look in user folder if css is not found
			error: function() {
				
				$.ajax({
					type: 'GET',
					url: '/user/modules/' + id + '/' + id + '.html',
					success: function() {
						sim.add_css('/user/modules/' + id + '/' + id + '.css');
					},
				});
				
			}
		});
		
		// Add html
		$.ajax({
			type: 'GET',
			url: 'modules/' + id + '/' + id + '.html',
			dataType: 'html',
			success: function(content) {
				iomodule.element.append(content);
				
				if(_.isFunction(callback)) {
					callback(iomodule);
				}
			},
			
			// Look in user folder if html is not found
			error: function() {
				
				$.ajax({
					type: 'GET',
					url: '/user/modules/' + id + '/' + id + '.html',
					dataType: 'html',
					success: function(content) {
						iomodule.element.append(content);
					},
					
					complete: function() {
						
						if(_.isFunction(callback)) {
							callback(iomodule);
						}
						
					}
				});
				
			}
		});
		
		
		// Add to config	

		var position = $.extend({
			'x' : 0,
			'y' : 0,
			'set' : false,
			'order' : iomodule.order
		}, config.saved_user_config[id] !== undefined ? config.saved_user_config[id].position : {});
		
		if(config.user_config_data[id] === undefined) 
			config.user_config_data[id] = {};
		
		config.user_config_data[id].position = position;
		
		if(config.config_data['websim-layout'].layout_type == 'absolute') {
			var css_position = layout_manager.offset_to_position(position.x, position.y);
			iomodule.element.css({
				left : css_position.x,
				top : css_position.y
			});
		}
		
		// Store iomodule
		this.iomodules[id] = iomodule;
	};
	
	/*
	 * Adds a physics module. Physics module must contain
	 * init(robot) and update(data, elapsed_time) methods. A
	 * dictionary with all the necessary robot information
	 * must also be passed (motors, sensors, robot weight and
	 * dimensions, etc)
	 */
	
	this.add_physics_module = function(id, module) {
		
		if(this.is_running || this.physics_modules.hasOwnProperty(id)) {
			return false;
		}
		
		if(!(module instanceof Physics_Module)) {
			return false;
		}
		
		this.physics_modules[id] = module;
		
		this.robot = $.extend(module.robot, this.robot);
		module.init();
		
		return true;
	};
	
	// Adds a stylesheet
	this.add_css = function(href) {
		
		if( $('link[href="' + href + '"]').length > 0 ) 
			return;
		
		$('head').append('<link rel="stylesheet" href="' + href + '" />');
	};
	
	// Adds javascript
	this.add_js = function(src) {
		
		if( $('script[src="' + src + '"]').length > 0 ) 
			return;
		
		$('head').append('<script src="' + src + '"></script>');
	};
	
	
	/*
	 * Starts the simulator
	 */
	
	this.start = function() {
		if(this.is_running) {
			return;
		}
		
		this.is_running = true;
		
		setup_socket();
	};
	
	this.stop = function() {
		this.is_running  = false;
		close_socket();
	};
	
	// only intended for use by the mode module
	// - use this instead of the dictionary
	this.set_robot_mode = function(mode, enabled) {
		if (socket == null)
			return;
		
		var msg = {};
		msg.msgtype = 'mode';
		msg.mode = mode;
		msg.enabled = enabled;
		
		socket.send(JSON.stringify(msg));
	}
	
	this.add_connection_listener = function(listener, notify_immedately) {
		
		if(_.isFunction(listener) === false) {
			return
		}
			
		connection_listeners.push(listener);
		
		if(notify_immedately) {
			listener(connected);
		}
	}
	
	function notify_connection_listeners() {
		
		for(var i = 0; i < connection_listeners.length; i++) {
			connection_listeners[i](connected);
		}
	}
	
	
	function setup_socket() {
		var l = window.location;
		var url = "ws://" + l.hostname + ":" + l.port + "/api";
		
		socket = new WebSocket(url);
		socket.onopen = function() {
			
			// reset vars
			data_from_server = null;
			data_to_server = null;
			connected = true;
			notify_connection_listeners();
		}
		
		// called when sim data comes from the server
		// -> rate is controlled by the server
		socket.onmessage = function(msg) {
			
			var data = JSON.parse(msg.data);
			
			// first message is in/out data, all other messages are just out data
			// -> TODO: support message types
			if (data_from_server == null) {
				data_from_server = data.out;
				data_to_server = data.in;
			} else {
				data_from_server = data;
			}
			
			
			on_data();
			
			var sim_msg = {};
			sim_msg.msgtype = 'input';
			sim_msg.data = data_to_server;
			//console.log(data_to_server.analog_in[1]);
			socket.send(JSON.stringify(sim_msg));
		}
		
		socket.onclose = function(a) {
			connected = false;
			notify_connection_listeners();
		}
	}
	
	function close_socket() {

		if (socket != null) {
			socket.close();
			socket = null;
		}
	}
	
	
	function on_data() {
			
		// Update server if modules have changed
		for(var id in sim.iomodules) {
			sim.iomodules[id].modify_data_to_server(data_to_server, enabled);
		}
		
		// Update Physics if enabled	
		var enabled = data_from_server.control.enabled;
		
		if(enabled) {

			// TODO: should this information be calculated by the sim?
			var elapsed_time = 0;
			var current_time =  Date.now();
			if(time_of_last_update !== null) {
				elapsed_time = current_time - time_of_last_update;
			}
			
			time_of_last_update = current_time;
			
			//physics
			for(var id in sim.physics_modules) {
				sim.physics_modules[id].update(data_from_server, elapsed_time / 1000);
			}
		}
	}
	
	
	
	
	// Updates the interface periodically based on the update rate
	(function update_interface() {

		var enabled = data_from_server && data_from_server.control.enabled;
		
		if(socket && data_from_server) {
			//update interface
			for(var id in sim.iomodules) {
				sim.iomodules[id].update_interface(data_from_server);
			}

		}
		
		setTimeout(update_interface, sim.UPDATE_RATE);
		
	})();
	

}
