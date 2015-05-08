"use strict";

(function($) {
	
	$.fn.slider.Constructor.prototype.disable = function () {
		this.picker.off();
	};
	
	$.fn.slider.Constructor.prototype.enable = function () {
	        if (this.touchCapable) {
	            // Touch: Bind touch events:
	            this.picker.on({
	                touchstart: $.proxy(this.mousedown, this)
	            });
	        } else {
	            this.picker.on({
	                mousedown: $.proxy(this.mousedown, this)
	            });
	        }
	};
	
	$.widget( "websim.sliderFacade", {
		
		options : {
			// The range of the slider is +/- the magnitude
			magnitude: 1,
			// The label that appears before the slider
			label: '',
			// Sets the text value of the slider
			setTextValue: function(element, value) {
				return value;
			},
			onChange: function(element, value) {
				
			},
			// How much slider moves up or down when +/- keys are pressed
			keyStep: .1
		},
		
		// If disabled the slider can't be moved with the mouse or keyboard
		_enabled: true,
	
		labelElement: null,
		sliderElement: null,
	    sliderHolderElement: null,
		textElement: null,
		
		_create: function() {
			
			// Prevents scoping issues
			var sliderFacade = this;
			
			// Add bootstrap slider class
			sliderFacade.element.addClass('bootstrap-slider-facade');
			
			// Initialize the label element
			sliderFacade.labelElement = $('<span>' + sliderFacade.options.label + '</span>')
				.appendTo(sliderFacade.element);
			
			// Initialize the slider element
			sliderFacade.sliderElement = $('<input type="text" class="form-control" value="">')
				.appendTo(sliderFacade.element)
				.slider({
					min: -sliderFacade.options.magnitude,
					max: sliderFacade.options.magnitude,
					value: 0,
					step: .01,
					tooltip: 'hide',
					handle: 'round',
					formater: function(value) {
						return value.toFixed(2);
					}
				});
			
			sliderFacade.sliderElement.slider().on('slide', function(ev){
				var element = $(ev.target).parent();
				var value = ev.value;
				sliderFacade._onSlide(element, value);
			});	
			
			sliderFacade.sliderHolderElement = sliderFacade.element.find('.slider');
			
			// Initialize text element
			sliderFacade.textElement = $('<span class="slider-value">0</span>')
				.appendTo(sliderFacade.element);
			
			// Set value
			sliderFacade.setValue(0);
			
			// Make the slider focusable
			this.element.attr('tabindex', 1);
			
			this.element.on('keypress', function(e) {
				
				if(!sliderFacade._enabled)
					return;
				
				// - pressed
				if(e.keyCode == 45) {
					
					var value = sliderFacade.getValue() - sliderFacade.options.keyStep;
					
					if(value < -sliderFacade.options.magnitude) {
						value = -sliderFacade.options.magnitude;
					}
					
					sliderFacade.setValue(value);
					
				// + or +/= pressed
				} else if(e.keyCode == 43 || e.keyCode == 61) {
					
					var value = sliderFacade.getValue() + sliderFacade.options.keyStep;
					
					if(value > sliderFacade.options.magnitude) {
						value = sliderFacade.options.magnitude;
					}
					
					sliderFacade.setValue(value);
					
				// 0 is pressed
				} else if(e.keyCode == 48) {
					sliderFacade.setValue(0);
				}
				
			});
			

			/*$('body').on('keydown', sliderFacade.element, function(e) {
				
				if($(this).is(':focus')) {
					console.log('sdfdfd');
				}
			});*/
			
			
		},
		
		
		_onSlide: function(element, value) {
			
			// Prevents scoping issues
			var sliderFacade = this;
						
			var negative_color = '#FCC';
			var positive_color = '#CFC';
			var neutral_color = 'lightgray';
			
			//get size and position
			var width = (Math.abs(value / sliderFacade.options.magnitude) * 50).toFixed(0);
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
			sliderFacade.textElement.text(sliderFacade.options.setTextValue(sliderFacade.element, value.toFixed(2)));
			
			// Alert for change
			sliderFacade.options.onChange(sliderFacade.element, value.toFixed(2));
		},
		
		// Sets options
	    _setOption : function( key, value ) {
	    	
	    	// Prevents scoping issues
	    	var sliderFacade = this;
	    	
	    	switch(key) {
	    		
	    	case 'label':
	    	
	    		sliderFacade.options[key] = value;
	    		sliderFacade.labelElement.html(value);
	    		
	    	}
	    },
	    
	    
	    
	    setValue: function(value) {
	    	
	    	// Prevents scoping issues
	    	var sliderFacade = this;
	    	
	    	if(value > sliderFacade.options.magnitude)
	    		value = sliderFacade.options.magnitude;
	    	else if(value < -sliderFacade.options.magnitude)
	    		value = -sliderFacade.options.magnitude;
	    	
			sliderFacade.sliderElement.slider('setValue', value);
			var slider = sliderFacade.sliderHolderElement;
			sliderFacade._onSlide(slider, value);
	    },
		
		
		getValue: function() {
			return parseFloat(this.textElement.text());
		},
		
		enable: function() {
			this._enabled = true;
			this.sliderElement.slider('enable');
		},
		
		disable: function() {
			this._enabled = false;
			this.sliderElement.slider('disable');
		},
		
		enabled: function() {
			return this._enabled;
		}
		
	});
	
	
})(jQuery);