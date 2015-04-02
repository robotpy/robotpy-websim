"use strict";

function Joysticks_IOModule() {
	
	this.title = 'Joysticks';
	
	var module = this;
	
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
		
		setTimeout(function() {
			var axis = ['x', 'y', 'z', 't']
			for(var i = 0; i < 6; i++) {			
				for(var j = 0; j < axis.length; j++) {
					module.setSliderValue(i, axis[j], 0);
				}
			}
		}, 100);
		

		this.element.find('.joystick-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.onSlide(element, ev.value);
		});
		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		var joysticks = data_to_server.joysticks;
		var axis = ['x', 'y', 'z', 't']
		for(var i = 0; i < 6; i++) {
			joysticks[i] = {};
			for(var j = 0; j < axes.length; j++) {
				joysticks[i].axes = {};
				joysticks[i].axes[j] = this.getSliderValue(i + 1, axis[j]);
			}
			
			for(var b = 0; b < 12; b++) {
				joysticks[i].buttons = {};
				joysticks[i].buttons[b] = this.element.find('.joystick-' + i + ' .joystick-btn-' + (b + 1)).is(":checked");
			}
		}
	};
	
	this.setSliderValue = function(joystick, axis, value) {
		var module = this;
		var joystickSelector = '.joystick-' + joystick;
		var axisSelector = '.' + axis + '-axis';
		var selector = joystickSelector + ' ' + axisSelector + ' .joystick-slider';
		this.element.find(selector).slider('setValue', value);
		this.element.find(joystickSelector + ' ' + axisSelector).each(function() {
			var slider = $(this).find('.slider');
			module.onSlide(slider, value);
		});
	}
	
	this.getSliderValue = function(slideNumber) {
		var slide_holder = this.element.find('p:nth-child(' + slideNumber + ')');
		return slide_holder.find('.slider-value').text();
	};
	
	this.onSlide = function(element, value) {
		var negColor = '#FCC';
		var posColor = '#CFC';
		
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
			element.find('.slider-track .slider-selection').css('background', negColor);
			element.find('.slider-track .slider-handle').css('background', negColor);
		} else if(value > 0) {
			element.find('.slider-track .slider-selection').css('background', posColor);
			element.find('.slider-track .slider-handle').css('background', posColor);
		} else {
			element.find('.slider-track .slider-handle').css('background', 'lightgray');
		}
		
		
		
		//display value
		element.siblings('.slider-value').text(value.toFixed(2));
	};
}

Joysticks_IOModule.prototype = new IOModule();

sim.add_iomodule('joysticks', new Joysticks_IOModule());
	