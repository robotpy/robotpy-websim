var analogModule = $('#analog').ioModule('analog', {
	title : 'Analog',
	init : function() {
		this.values = [0, 0, 0, 0, 0, 0, 0, 0];
		var module = this;
		
		$('.analog-slider').slider({
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
			for(i = 1; i <= 10; i++) {
				module.setSliderValue(i, 0);
			}
		}, 100);
		

		$('.analog-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.onSlide(element, ev.value);
		});
		
	},
	getData : function(dataToServer) {
		var analogs = dataToServer.analog_in;
		for(i = 0; i < analogs.length; i++) {
			analogs[i].value = this.getSliderValue(i + 1);
		}
	},
	setData : function(newData, oldData) {
		var analogs = newData.analog_in;
		var oldAnalogs = oldData.analog_in;
		for(i = 0; i < analogs.length; i++) {
			var id = '#analog-slider-' + (i + 1);
			if(!analogs[i].initialized) {
				$(id).addClass('hide');
				continue;
			} else {
				$(id).removeClass('hide');
			}
		}
	},
	setSliderValue: function(slideNumber, value) {
		var module = this;
		$('#analog-slider-' + slideNumber + ' .analog-slider').slider('setValue', value);
		$('#analog-slider-' + slideNumber).each(function() {
			var slider = $(this).find('.slider');
			module.onSlide($(slider), value);
		});
	},
	getSliderValue: function(slideNumber) {
		return this.values[slideNumber - 1];
	},
	onSlide: function(element, value) {
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
		this.values[analogNumber - 1] = value.toFixed(2);
	}
});
