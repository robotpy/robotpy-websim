var digitalModule = $('#digital').ioModule('digital', {
	title : 'Digital',
	init : function() {
		var module = this;
		//pwm sliders
		this.sliderValues = new Array(20);
		for(var i = 0; i < this.sliderValues.length; i++) {
			this.sliderValues[i] = 0;
		}
		
		$('.pwm-slider').slider({
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
			for(var i = 1; i <= 20; i++) {
				module.setSliderValue(i, 0);
			}
		}, 100);
		

		$('.pwm-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.onSlide(element, ev.value);
		});
		
		//digital i/o, relay
		$('.digital-io, .relay').click(function() {
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
		
		
		
	},
	getData : function(dataToServer) {
		var pwm = dataToServer.pwm;
		for(var i = 0; i < pwm.length; i++) {
			pwm[i].value = this.getSliderValue(i + 1);
		}
		
		var dio = dataToServer.dio;
		for(var i = 0; i < dio.length; i++) {
			var id = '#digital-io-' + (i + 1);
			dio[i].value = $(id).hasClass('btn-success');
		}
		
		var relay = dataToServer.relay;
		for(var i = 0; i < relay.length; i++) {
			var id = '#relay-' + (i + 1);
			relay[i].value = $(id).hasClass('btn-success');
		}
	},
	setData : function(newData, oldData) {
		var pwm = newData.pwm;
		for(var i = 0; i < pwm.length; i++) {
			var id = '#pwm-slider-' + (i + 1);
			if(!pwm[i].initialized) {
				$(id).addClass('hide');
			} else {
				$(id).removeClass('hide');
			}
		}
		
		var dio = newData.dio;
		for(var i = 0; i < dio.length; i++) {
			var id = '#digital-io-' + (i + 1);
			if(!dio[i].initialized) {
				$(id).closest('.col-xs-6').addClass('hide');
			} else {
				$(id).closest('.col-xs-6').removeClass('hide');
			}
		}
		
		var relay = newData.relay;
		for(var i = 0; i < relay.length; i++) {
			var id = '#relay-' + (i + 1);
			if(!relay[i].initialized) {
				$(id).closest('.row').addClass('hide');
			} else {
				$(id).closest('.row').removeClass('hide');
			}
		}
	},
	setSliderValue: function(slideNumber, value) {
		var module = this;
		$('#pwm-slider-' + slideNumber + ' .pwm-slider').slider('setValue', value);
		$('#pwm-slider-' + slideNumber).each(function() {
			var slider = $(this).find('.slider');
			module.onSlide($(slider), value);
		});
	},
	getSliderValue: function(slideNumber) {
		return this.sliderValues[slideNumber - 1];
	},
	onSlide: function(element, value) {
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
		
		
		//get analog number
		var pwmNumber = parseInt(element.siblings('b').text());
		this.sliderValues[pwmNumber - 1] = value.toFixed(2);
	}
});
