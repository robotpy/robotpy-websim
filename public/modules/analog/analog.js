var analogModule = $('#analog').ioModule('analog', {
	title : 'Analog',
	init : function() {
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
				setSliderValue(i, 0);
			}
		}, 100);
		

		$('.analog-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			onSlide(element, ev.value);
		});
		
		function setSliderValue(slideNumber, value) {
			$('#analog-slider-' + slideNumber + ' .analog-slider').slider('setValue', value);
			$('#analog-slider-' + slideNumber).each(function() {
				var slider = $(this).find('.slider');
				onSlide($(slider), value);
			});
		}
		
		
		function onSlide(element, value) {
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
		}
	},
	getData : function(data) {

	},
	setData : function(data) {

	}
});
