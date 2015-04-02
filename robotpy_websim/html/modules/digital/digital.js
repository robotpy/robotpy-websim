"use strict";

	
function Digital_IOModule() {
	
	var module = this;
	
	this.title = 'Digital';
	
	this.init = function() {

		this.element.find('.pwm-slider').slider({
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
			for(var i = 0; i < 20; i++) {
				module.setSliderValue(i, 0);
			}
		}, 100);
		

		this.element.find('.pwm-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.onSlide(element, ev.value);
		});
		
		//digital i/o, relay
		this.element.find('.digital-io, .relay').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		var dio = data_to_server.dio;
		
		for(var i = 0; i < dio.length; i++) {
			dio[i].value = this.element.find('.digital-io-' + i).hasClass('btn-success');
		}
		

	};
	
	this.update_interface = function(data_from_server) {

		var pwm = data_from_server.pwm;
		for(var i = 0; i < pwm.length; i++) {
			var selector = '.pwm-slider-' + i;
			if(!pwm[i].initialized) {
				this.element.find(selector).addClass('hide');
				continue;
			} else {
				this.element.find(selector).removeClass('hide');
			}
			
			this.setSliderValue(i, pwm[i].value);
		}
		
		var relay = data_from_server.relay;
		for(var i = 0; i < relay.length; i++) {
			var selector = '.relay-' + i;
			if(!relay[i].initialized) {
				this.element.find(selector).closest('.row').addClass('hide');
			} else {
				this.element.find(selector).closest('.row').removeClass('hide');
			}
		}
	};
	
	
	this.setSliderValue = function(slideNumber, value) {
		
		value = parseFloat(value);
		
		var slide_holder = this.element.find('p:nth-child(' + (slideNumber + 1) + ')');
		slide_holder.find('.pwm-slider').slider('setValue', value);
		var slider = slide_holder.find('.slider');
		module.onSlide(slider, value);
	};
	
	this.getSliderValue = function(slideNumber) {
		var slide_holder = this.element.find('p:nth-child(' + (slideNumber + 1) + ')');
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

Digital_IOModule.prototype = new IOModule();

sim.add_iomodule('digital', new Digital_IOModule());
	

