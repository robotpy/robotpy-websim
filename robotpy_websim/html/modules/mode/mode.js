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
}


Mode_IOModule.prototype = new IOModule();
sim.add_iomodule('mode', new Mode_IOModule());

