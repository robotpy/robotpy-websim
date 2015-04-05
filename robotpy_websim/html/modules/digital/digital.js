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
		
		//digital i/o, relay
		this.element.find('.digital-io').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
		
	};
	
	this.modify_data_to_server = function(data_to_server) {
		
		// Send dio value to server
		var dio = data_to_server.dio;	
		for(var i = 0; i < dio.length; i++) {
			dio[i].value = this.get_dio(i).find('.digital-io').hasClass('btn-success');
		}

	};
	
	this.update_interface = function(data_from_server) {

		// Hide the pwms if they aren't initialized. Update their values otherwise
		var pwm = data_from_server.pwm;
		for(var i = 0; i < pwm.length; i++) {
			var selector = this.get_pwm(i);
			if(!pwm[i].initialized) {
				selector.addClass('hide');
				continue;
			}
				
			selector.removeClass('hide');			
			this.set_slider_value(i, pwm[i].value);
		}
			
		// Hide DIOs if they aren't initialized
		var dio = data_from_server.dio;
		for(var i = 0; i < dio.length; i++) {
			var selector = this.get_dio(i);
			if(!dio[i].initialized) {
				selector.addClass('hide');
				continue;
			}
				
			selector.removeClass('hide');
		}
		
		// Hide the relays if they aren't initialized
		var relay = data_from_server.relay;
		for(var i = 0; i < relay.length; i++) {
			var selector = this.get_relay(i);
			if(!relay[i].initialized) {
				selector.addClass('hide');
				continue;
			}
			
			selector.removeClass('hide');
			this.set_relay_value(i, relay[i].fwd, relay[i].rev);

		}
	};
	
	this.get_pwm = function(index) {
		return this.element.find('.slide-holder:nth-of-type(' + (index + 1) + ')');
	};
	
	this.get_dio = function(index) {
		return this.element.find('.dio-holder:nth-of-type(' + (index + 1) + ')');
	};
	
	this.get_relay = function(index) {
		return this.element.find('.relay-holder:nth-of-type(' + (index + 1) + ')');
	}
	
	this.set_relay_value = function(index, fwd, rev) {
		var relay = this.get_relay(index);
		
		if(fwd) {
			relay.find('.relay').addClass('btn-success');
			relay.find('.relay').removeClass('btn-danger');
			relay.find('.relay').removeClass('btn-default');
		} else if(rev) {
			relay.find('.relay').removeClass('btn-success');
			relay.find('.relay').addClass('btn-danger');
			relay.find('.relay').removeClass('btn-default');
		} else {
			relay.find('.relay').removeClass('btn-success');
			relay.find('.relay').removeClass('btn-danger');
			relay.find('.relay').addClass('btn-default');
		}
	};
	
	
	this.set_slider_value = function(index, value) {
		
		value = parseFloat(value);
		
		var slide_holder = this.get_pwm(index);
		slide_holder.find('input').slider('setValue', value);
		var slider = slide_holder.find('.slider');
		module.on_slide(slider, value);
	};
	
	
	this.get_slider_value = function(index) {
		var slide_holder = this.get_pwm(index);
		return parseFloat(slide_holder.find('.slider-value').text());
	};
	
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

Digital_IOModule.prototype = new IOModule();

sim.add_iomodule('digital', new Digital_IOModule());
	

