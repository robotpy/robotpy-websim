
var sim = new function() {
	
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
	
	/*
	 * Creates an IOModule and then returns it.
	 * Will return null if the simulator is currently running or if
	 * the id is already associated with another IOModule.
	 */
	
	this.add_iomodule = function(id, iomodule) {
		
		
		if(this.is_running || this.iomodules.hasOwnProperty(id)) {
			return false;
		}
		
		iomodule = $.extend({
			
			// The title displayed for the module
			title : 'Just Another IOModule',
			
			// Modifies the data sent to the server. The most recent
			// data from the server will be passed by reference. 
			// The data passed to this function will reflect modifications 
			// made by IOModules' modify_data_to_server functions
			modify_data_to_server : function(data_to_server) {},
			
			// Modifies the content displayed using a copy of the most 
			// recent data from the server.
			update_interface : function(data_from_server) {}
			
		}, iomodule);
		
		iomodule.element = $('#' + id)
		iomodule.element.addClass('iomodule');
		iomodule.element.prepend('<h4 class="title">' + iomodule.title + '</h4>');
		
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
		
		is_running = true;
		
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
	
	function setup_socket() {
		var l = window.location;
		var url = "ws://" + l.hostname + ":" + l.port + "/api";
		
		socket = new WebSocket(url);
		socket.onopen = function() {
			
			// reset vars
			data_from_sever = null;
			data_to_server = null;
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
			
			sim_msg = {}
			sim_msg.msgtype = 'input';
			sim_msg.data = data_to_server;
			//console.log(data_to_server.analog_in[1]);
			socket.send(JSON.stringify(sim_msg));
		}
		
		socket.onclose = function(a) {
			console.log(a);
			// TODO
		}
	}
	
	function close_socket() {

		if (socket != null) {
			socket.close();
			socket = null;
		}
	}
	
	
	function on_data() {
		
		// TODO: should this information be calculated by the sim?
		var elapsed_time = 0;
		var current_time =  Date.now();
		if(time_of_last_update !== null) {
			elapsed_time = current_time - time_of_last_update;
		}
		
		time_of_last_update = current_time;
		
		//physics
		for(var id in this.physics_modules) {
			this.physics_modules[id].update(data_from_server, elapsed_time / 1000);
		}
		
		//update interface
		for(var id in sim.iomodules) {
			sim.iomodules[id].update_interface(data_from_server);
		}
		
		for(var id in sim.iomodules) {
			sim.iomodules[id].modify_data_to_server(data_to_server);
		}
	}

}
