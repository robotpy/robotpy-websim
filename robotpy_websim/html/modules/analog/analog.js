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
		
		setTimeout(function() {
			for(var i = 1; i <= 8; i++) {
				module.setSliderValue(i, 0);
			}
		}, 100);
		

		this.element.find('.analog-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.onSlide(element, ev.value);
		});
		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		var analogs = data_to_server.analog_in;
		
		for(var i = 0; i < analogs.length; i++) {
			analogs[i].value = module.getSliderValue(i);
		}
	};
	
	this.update_interface = function(data_from_server) {
		
		var analogs = data_from_server.analog_in;
		
		// Hide analogs if not initialized
		for(var i = 0; i < analogs.length; i++) {
			if(!analogs[i].initialized) {
				this.element.find('form p:nth-child(' + (i + 1) + ')').addClass('hidden');
			} else {
				this.element.find('form p:nth-child(' + (i + 1) + ')').removeClass('hidden');
			}
		}
	};

	
	this.setSliderValue = function(slideNumber, value) {
		
		value = parseFloat(value);
		
		var slide_holder = this.element.find('p:nth-child(' + slideNumber + ')');
		slide_holder.find('.analog-slider').slider('setValue', value);
		var slider = slide_holder.find('.slider');
		module.onSlide(slider, value);
	};
	
	this.getSliderValue = function(slideNumber) {
		var slide_holder = this.element.find('p:nth-child(' + slideNumber + ')');
		return slide_holder.find('.slider-value').text();
	};
	
	this.onSlide = function(element, value) {
		var negColor = '#FCC';
		var posColor = '#CFC';
		
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
		
		
		//get analog number
		var analogNumber = parseInt(element.siblings('b').text());
	};
}

Analog_IOModule.prototype = new IOModule();

sim.add_iomodule('analog', new Analog_IOModule());
	
