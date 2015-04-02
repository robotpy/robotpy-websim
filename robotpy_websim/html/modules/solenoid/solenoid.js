"use strict";

function Solenoid_IOModule() {
	
	this.title = 'Solenoid';
	
	this.init = function() {
		this.element.find('.solenoid-input').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
	};
	
	this.update_interface = function(data_from_server) {
		var solenoid = data_from_server.solenoid;
		for(var i = 0; i < solenoid.length; i++) {
			var id = '#solenoid-' + (i + 1);
			if(!solenoid[i].initialized) {
				$(id).closest('.col-xs-6').addClass('hide');
			} else {
				$(id).closest('.col-xs-6').removeClass('hide');
			}
		}
	};
}

Solenoid_IOModule.prototype = new IOModule();
sim.add_iomodule('solenoid', new Solenoid_IOModule());
	

