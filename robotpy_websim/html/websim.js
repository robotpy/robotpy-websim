"use strict";

function IOModule() {
	
	// The DOM element of the IOModule
	this.element = null;
	
	// The title displayed for the module
	this.title = 'Just Another IOModule';
	
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

function Physics_Module() {
	
	// The fields needed to represent the robot
	this.robot = {};
	
	// Function that's called to initialize the physics module
	this.init = function() {};
	
	// Called periodically to update the physics module
	this.update = function(data_from_server, time_elapsed) {};
}


var sim = new function() {
	
	var sim = this;
	
	this.config = {};
	
	// constant that controls the time between updates
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
	
	this.load_config = function(callback) {
		
		$.ajax({
		   type: 'GET',
		   url: '/user/config.json',
		   dataType: 'json',
		   success: function(config) {
			   sim.config = config;
		   },
		   complete: function() {
			   if(_.isFunction(callback)) {
				   callback();
			   }
		   }
		});
	};
	
	this.save_config = function(callback) {
		$.ajax({
			type: 'POST',
			url: '/api/config/save',
			data: {
				'config' : JSON.stringify(sim.config)
			},
			complete: function() {
				if(_.isFunction(callback)) {
					callback();
			    }
			}
		});
	};

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
			}
			
			loadNext();
		});
	}
	
	/*
	 * Creates an IOModule and then returns it.
	 * Will return null if the simulator is currently running or if
	 * the id is already associated with another IOModule.
	 */
	
	this.add_iomodule = function(id, iomodule) {

		
		if(this.iomodules.hasOwnProperty(id)) {
			return false;
		}
		
		
		if( !(iomodule instanceof IOModule) ) {
			return false;
		}
		
		// Add to config
		if(this.config[id] === undefined) {
			this.config[id] = {};
		}
		
		if(this.config[id].position === undefined) {
			this.config[id].position = {};
		}
		
		this.config[id].position = $.extend({
			'x' : 0,
			'y' : 0,
			'moved' : false
		}, this.config[id].position);
		
		iomodule.element = $('#' + id)
		iomodule.element.addClass('iomodule');
		iomodule.element.prepend('<h4 class="title noselect cursor-grab">' + iomodule.title + '</h4>');
		
		if(this.config[id].position.moved) {
			iomodule.element.addClass('absolute-layout');
			iomodule.element.css({
				'left' : sim.config[id].position.x,
				'top' : sim.config[id].position.y
			});
		} else {
			iomodule.element.addClass('flow-layout');
		}
		
		this.iomodules[id] = iomodule;
		
		
		return iomodule;
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
			
		//update interface
		for(var id in sim.iomodules) {
			sim.iomodules[id].update_interface(data_from_server);
		}
		
		for(var id in sim.iomodules) {
			sim.iomodules[id].modify_data_to_server(data_to_server);
		}
	}
	
	
	
	
	
	function update_physics() {
		
		var mode = $('#control input[name=mode]:checked').val();
		
		if(socket && mode !== 'disabled') {

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
		
		setTimeout(update_physics, sim.UPDATE_RATE);
		
	}
	
	update_physics();
	
	
	// Move the modules
	// Events to drag toolbox
	$(function() {
		
		var iomodule = null;
		var iomodule_id = null;
		var click_position = null;
		var iomodule_start_position = null;
		
		$('body').on('mousedown', '.cursor-grab', function(e) {
			
			var $iomodule = $(this).closest('.iomodule');
			
			if( $iomodule.length === 0) {
				return;
			}
			
			iomodule_id = $iomodule.attr('id');
			
			iomodule = sim.iomodules[iomodule_id];
			
			if(!iomodule) {
				return;
			}
			
			
			// Set its position if it hasn't been moved
			if(!sim.config[iomodule_id].position.moved) {
				iomodule.set_position(iomodule.element.offset().left, iomodule.element.offset().top);
				iomodule.element.removeClass('flow-layout');
				iomodule.element.addClass('absolute-layout');
				sim.config[iomodule_id].position.moved = true;
			}
			
			
	    	click_position = { 'x' : e.clientX, 'y' : e.clientY };
	    	iomodule_start_position = { 'x' : iomodule.get_x(), 'y' : iomodule.get_y() };
	    	$('body').addClass('noselect');
	    	
	    });
		
		$(window).mouseup(function(e) {
		   
		   if(iomodule) {
			   sim.config[iomodule_id].position = { 'x' : e.clientX, 'y' : e.clientY, 'moved' : true };
			   sim.save_config();
			   iomodule = null;
			   iomodule_id = null;
			   $('body').removeClass('noselect');
		   }
	       
	    }).mousemove(function(e) {
	    	
	    	if(!iomodule) {
	    		return;
	    	}
	    	
	    	var dx = e.clientX - click_position.x;
	    	var dy = e.clientY - click_position.y;
	    	
	    	iomodule.set_position(iomodule_start_position.x + dx, iomodule_start_position.y + dy);
	    	
	    });
		
	});

}
