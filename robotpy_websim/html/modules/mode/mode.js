"use strict";

function Mode_IOModule() {
	
	this.title = 'Mode';
	
	this.init = function() {
		//update state when form input changes
		this.element.find("input[name='mode']").change(function() {
			var mode = $(this).val();
			var enabled = mode != 'disabled';
			if (mode == 'disabled')
				mode = 'teleop';
			sim.set_robot_mode(mode, enabled);
		});
	};
	
	this.update_interface = function(data_from_server) {
		// do something with the data here...
		var control = data_from_server.control;

		if (control.has_source) {
			this.element.find('#control_source').text("Mode externally controlled!")
			this.element.find("input[name='mode']").prop("checked", false)
		}

		if (control.enabled) {
			if (control.autonomous)
				this.element.find('#robot_state').text('Autonomous')
			else if (control.test)
				this.element.find('#robot_state').text('Test')
			else
				this.element.find('#robot_state').text('Teleoperated')
		} else {
			this.element.find('#robot_state').text('Disabled')
		}
	};
}


Mode_IOModule.prototype = new IOModule();
sim.add_iomodule('mode', new Mode_IOModule());

