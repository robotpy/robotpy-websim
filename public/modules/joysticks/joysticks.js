var joysticksModule = $('#joysticks').ioModule('joysticks', {
	title : 'Joysticks',
	init : function() {
		var module = this;
		
		$('.joystick-slider').slider({
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
			for(var i = 1; i <= 6; i++) {			
				for(var j = 0; j <= axis.length; j++) {
					module.setSliderValue(i, axis[j], 0);
				}
			}
		}, 100);
		

		$('.joystick-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			module.onSlide(element, ev.value);
		});
		
	},
	getData : function(dataToServer) {
		var joysticks = dataToServer.joysticks;
		var axis = ['x', 'y', 'z', 't']
		for(var i = 0; i < 6; i++) {			
			for(var j = 0; j < joysticks[i].axes.length && j < axis.length; j++) {
				joysticks[i].axes[j] = this.getSliderValue(i + 1, axis[j]);
			}
			
			for(var b = 0; b < joysticks[i].buttons.length; b++) {
				joysticks[i].buttons[b] = $('#joystick-' + (i + 1) + ' .joystick-btn-' + (b + 1)).is(":checked");
			}
		}
	},
	setData : function(newData, oldData) {
		var joysticks = newData.joysticks;
		for(var i = 0; i < joysticks.length; i++) {
			var id = '#joystick-' + (i + 1);
			/*if(!joysticks[i].initialized) {
				$(id).parent().addClass('hide');
				continue;
			} else {
				$(id).parent().removeClass('hide');
			}*/
		}
	},
	setSliderValue: function(joystick, axis, value) {
		var module = this;
		var joystickSelector = '#joystick-' + joystick;
		var axisSelector = '.' + axis + '-axis';
		var selector = joystickSelector + ' ' + axisSelector + ' .joystick-slider';
		$(selector).slider('setValue', value);
		$(joystickSelector + ' ' + axisSelector).each(function() {
			var slider = $(this).find('.slider');
			module.onSlide($(slider), value);
		});
	},
	getSliderValue: function(joystick, axis) {
		var joystickSelector = '#joystick-' + joystick;
		var axisSelector = '.' + axis + '-axis';
		var selector = joystickSelector + ' ' + axisSelector + ' .slider-value';
		var val = $(selector).text();
		return parseFloat(val);
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
	}
});
