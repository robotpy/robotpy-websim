"use strict";

function Solenoid_IOModule() {
	
	this.title = 'Solenoid';
	
	this.init = function() {
		
	};
	
	this.update_interface = function(data_from_server) {
		var solenoid = data_from_server.solenoid;
		for(var i = 0; i < solenoid.length; i++) {
			
			var selector = this.get_solenoid(i);
			if(!solenoid[i].initialized) {
				selector.addClass('hide');
				continue;
			} 
			
			selector.removeClass('hide');
			this.set_solenoid_value(i, solenoid[i].value);
		}
	};
	
	this.get_solenoid = function(index) {
		return this.element.find('.solenoid-holder:nth-of-type(' + (index + 1) + ')');
	};
	
	// TODO: Set the color of the solenoid indicator based on the real value given
	this.set_solenoid_value = function(index, value) {
		var solenoid = this.get_solenoid(index).find('.solenoid');
		
		if(value) {
			solenoid.addClass('btn-success');
			solenoid.removeClass('btn-danger');
			solenoid.removeClass('btn-default');
		} else if(!value) {
			solenoid.removeClass('btn-success');
			solenoid.addClass('btn-danger');
			solenoid.removeClass('btn-default');
		} else {
			solenoid.removeClass('btn-success');
			solenoid.removeClass('btn-danger');
			solenoid.addClass('btn-default');
		}
	};
}

Solenoid_IOModule.prototype = new IOModule();
sim.add_iomodule('solenoid', new Solenoid_IOModule());
	

