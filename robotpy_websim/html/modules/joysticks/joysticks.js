"use strict";

function Joysticks_IOModule() {
	
	this.title = 'Joysticks';
	
	var module = this;
	
	this.on_config_update = function(config) {
		
		var show_joysticks = config['show-joysticks'];
		
		for(var i = 0; i < 6; i++) {
			if(show_joysticks[i]) {
				this.get_joystick(i).removeClass('hidden');
			} else {
				this.get_joystick(i).addClass('hidden');
			}
		}
		
	};
	
	this.init = function() {

		
		this.element.find('.joystick-slider').slider({
			min: -1,
			max: 1,
			value: 0,
			step: .01,
			tooltip: 'hide',
			handle: 'round',
			formater: function(value) {
				return value.toFixed(2);
			}
		});
		
		for(var j = 0; j < 6; j++) {			
			for(var a = 0; a < 4; a++) {
				module.set_axis_value(j, a, 0);
			}
		}
		

		this.element.find('.joystick-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.on_slide(element, ev.value);
		});
		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		var joysticks = data_to_server.joysticks;

		for(var j = 0; j < 6; j++) {
			for(var a = 0; a < 4; a++) {
				joysticks[j].axes[a] = this.get_axis_value(j, a);
			}
			
			for(var b = 0; b < 12; b++) {
				joysticks[j].buttons[b] = this.get_button_value(j, b);
			}
		}
	};
	
	this.get_joystick = function(index) {
		return this.element.find('.joystick:nth-of-type(' + (index + 1) + ')');
	};
	
	this.get_axis = function(joystick, axis) {
		var joystick = this.get_joystick(joystick);
		return joystick.find('.slide-holder:nth-of-type(' + (axis + 1) + ')');
	};
	
	this.get_button = function(joystick, button) {
		var joystick = this.get_joystick(joystick);
		return joystick.find('.joystick-btn-' + (button + 1));
	};
	
	this.set_axis_value = function(joystick, axis, value) {
		
		value = parseFloat(value);
		
		var axis = this.get_axis(joystick, axis);
		axis.find('input').slider('setValue', value);
		var slider = axis.find('.slider');
		this.on_slide(slider, value);
	}
	
	this.get_axis_value = function(joystick, axis) {
		var axis = this.get_axis(joystick, axis);
		return parseFloat(axis.find('.slider-value').text());
	};
	
	this.get_button_value = function(joystick, button) {
		var button = this.get_button(joystick, button);
		return button.is(":checked");
	}
	
	this.on_slide = function(element, value) {
		var negative_color = '#FCC';
		var positive_color = '#CFC';
		var neutral_color = 'lightgray';
		
		//get size and position
		var width = (Math.abs(value / 1.0) * 50).toFixed(0);
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

Joysticks_IOModule.prototype = new IOModule();

sim.add_iomodule('joysticks', new Joysticks_IOModule());
	