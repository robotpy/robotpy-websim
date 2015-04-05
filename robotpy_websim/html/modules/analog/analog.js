"use strict";

	
function Analog_IOModule() {
	
	var module = this;
	
	this.title = 'Analog';
	
	this.init = function() {

		
		this.element.find('.analog-slider').slider({
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
		
		for(var i = 1; i <= 8; i++) {
			module.set_slider_value(i, 0);
		}
		

		this.element.find('.analog-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.on_slide(element, ev.value);
		});
		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		var analogs = data_to_server.analog_in;
		
		for(var i = 0; i < analogs.length; i++) {
			analogs[i].value = this.get_slider_value(i);
		}
	};
	
	this.update_interface = function(data_from_server) {
		
		var analogs = data_from_server.analog_in;
		
		// Hide analogs if not initialized
		for(var i = 0; i < analogs.length; i++) {
			if(!analogs[i].initialized) {
				this.get_slider(i).addClass('hidden');
			} else {
				this.get_slider(i).removeClass('hidden');
			}
		}
	};
	
	this.get_slider = function(index) {
		return this.element.find('.slide-holder:nth-of-type(' + (index + 1) + ')');
	};

	
	this.set_slider_value = function(index, value) {
		
		value = parseFloat(value);
		
		var slide_holder = this.get_slider(index);
		slide_holder.find('input').slider('setValue', value);
		var slider = slide_holder.find('.slider');
		module.on_slide(slider, value);
	};
	
	this.get_slider_value = function(index) {
		var slide_holder = this.get_slider(index);
		return parseFloat(slide_holder.find('.slider-value').text());
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
	
