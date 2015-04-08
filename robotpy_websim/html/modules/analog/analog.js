"use strict";

	
function Analog_IOModule() {
	
	var module = this;
	
	this.title = 'Analog';
	
	this.on_config_update = function(config) {
		
		var show_analogs = config['show-analogs'];
		
		if(show_analogs['inputs']) {
			this.element.find('#analog-inputs').removeClass('hidden');
		} else {
			this.element.find('#analog-inputs').addClass('hidden');
		}
		
		if(show_analogs['outputs']) {
			this.element.find('#analog-outputs').removeClass('hidden');
		} else {
			this.element.find('#analog-outputs').addClass('hidden');
		}
		
		if(show_analogs['triggers']) {
			this.element.find('#analog-triggers').removeClass('hidden');
		} else {
			this.element.find('#analog-triggers').addClass('hidden');
		}
		
		if(!show_analogs['inputs'] && !show_analogs['outputs'] && !show_analogs['triggers']) {
			this.element.addClass('hidden');
		} else {
			this.element.removeClass('hidden');
		}
		
	};
	
	this.init = function() {

		
		this.element.find('#analog-inputs, #analog-outputs, #analog-triggers').find('input').slider({
			min: -10,
			max: 10,
			value: 0,
			step: .01,
			tooltip: 'hide',
			handle: 'round',
			formater: function(value) {
				return value.toFixed(2);
			}
		});
		
		for(var i = 0; i < 8; i++) {
			this.set_analog_input_value(i, 0);
			this.set_analog_output_value(i, 0);
			this.set_analog_trigger_value(i, 0);
		}
		

		this.element.find('#analog-inputs, #analog-outputs').find('input').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.on_slide(element, ev.value);
		});		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		// Send analog input values to server
		var analogs = data_to_server.analog_in;
		
		for(var i = 0; i < analogs.length; i++) {
			analogs[i].value = this.get_analog_input_value(i);
		}
	};
	
	this.update_interface = function(data_from_server) {
		
		// Hide analog inputs if not initialized
		var analog_in = data_from_server.analog_in;
		
		for(var i = 0; i < analog_in.length; i++) {
			if(!analog_in[i].initialized) {
				this.get_analog_input(i).addClass('hidden');
			} else {
				this.get_analog_input(i).removeClass('hidden');
			}
		}
		
		// Hide analog outputs if not initialized and set the value
		var analog_out = data_from_server.analog_out;
		
		for(var i = 0; i < analog_out.length; i++) {
			if(!analog_out[i].initialized) {
				this.get_analog_output(i).addClass('hidden');
				continue;
			}

			this.get_analog_output(i).removeClass('hidden');
			this.set_analog_output_value(i, analog_out[i].value);
		}
		
		// Hide analog inputs if not initialized
		var analog_trigger = data_from_server.analog_trigger;
		
		for(var i = 0; i < analog_trigger.length; i++) {
			
			var analog_holder = this.get_analog_trigger(i);
			
			if(!analog_trigger[i].initialized) {
				analog_holder.addClass('hidden');
				continue;
			} 
			
			analog_holder.removeClass('hidden');
			
			this.set_analog_trigger_value(i, analog_trigger[i].trig_state);
		}
	};
	
	this.get_analog_input = function(index) {
		return this.element.find('#analog-inputs .slide-holder:nth-of-type(' + (index + 1) + ')');
	};
	
	this.get_analog_output = function(index) {
		return this.element.find('#analog-outputs .slide-holder:nth-of-type(' + (index + 1) + ')');
	};
	
	this.get_analog_trigger = function(index) {
		return this.element.find('#analog-triggers .analog-trigger-holder:nth-of-type(' + (index + 1) + ')');
	};

	
	this.set_analog_input_value = function(index, value) {
		
		value = parseFloat(value);
		
		var slide_holder = this.get_analog_input(index);
		slide_holder.find('input').slider('setValue', value);
		var slider = slide_holder.find('.slider');
		module.on_slide(slider, value);
	};
	
	this.set_analog_output_value = function(index, value) {
		
		value = parseFloat(value);
		
		var slide_holder = this.get_analog_output(index);
		slide_holder.find('input').slider('setValue', value);
		var slider = slide_holder.find('.slider');
		module.on_slide(slider, value);
	};
	
	this.set_analog_trigger_value = function(index, value) {
		
		var analog_trigger_holder = this.get_analog_trigger(index);
		var analog_trigger = analog_trigger_holder.find('.btn-circle');
		
		if(!value) {
			analog_trigger.addClass('btn-danger');
			analog_trigger.removeClass('btn-success');
		} else {
			analog_trigger.removeClass('btn-danger');
			analog_trigger.addClass('btn-success');
		}
	};
	
	this.get_analog_input_value = function(index) {
		var slide_holder = this.get_analog_input(index);
		return parseFloat(slide_holder.find('.slider-value').text());
	};
	
	this.get_analog_output_value = function(index) {
		var slide_holder = this.get_analog_output(index);
		return parseFloat(slide_holder.find('.slider-value').text());
	};
	
	this.get_analog_trigger_value = function(index) {
		var analog_trigger_holder = this.get_analog_trigger(index);
		return analog_trigger.find('btn-circle').hasClass('btn-success');
	};
	
	this.on_slide = function(element, value) {
		var negative_color = '#FCC';
		var positive_color = '#CFC';
		var neutral_color = 'lightgray';
		
		//get size and position
		var width = (Math.abs(value / 10.0) * 50).toFixed(0);
		var left = 50;
		if(value < 0) {
			left -= width;
		}
		//style
		element.find('.slider-track .slider-selection').css('left', left + '%');
		element.find('.slider-track .slider-selection').css('width', width + '%');
		if(value < 0) {
			element.find('.slider-track .slider-selection').css('background', negative_color);
			element.find('.slider-track .slider-handle').css('background', negative_color);
		} else if(value > 0) {
			element.find('.slider-track .slider-selection').css('background', positive_color);
			element.find('.slider-track .slider-handle').css('background', positive_color);
		} else {
			element.find('.slider-track .slider-handle').css('background', neutral_color);
		}
			
		//display value
		element.siblings('.slider-value').text(value.toFixed(2));
	};
}

Analog_IOModule.prototype = new IOModule();

sim.add_iomodule('analog', new Analog_IOModule());
	
