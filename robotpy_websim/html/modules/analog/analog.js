"use strict";

$(function() {
	
	function Analog() {
		
		var module = this;
		
		this.title = 'Analog';
		
		
		this.modify_data_to_server = function(data_to_server) {
			
			// Send analog input values to server
			
			for(var i = 0; i < 8; i++) {		
				
				var $analog = this.get_analog(i);
				var analog_type = $analog.find('.analog-type').text();
				
				if(analog_type === 'input') {
					data_to_server.analog_in[i].value = this.get_analog_value(i);
				}
			}
		};
		
		this.update_interface = function(data_from_server) {
			
			var analog_inputs = data_from_server.analog_in;
			var analog_outputs = data_from_server.analog_out;
			var analog_triggers = data_from_server.analog_trigger;
			
			for(var i = 0; i < 8; i++) {
				
				var analog_type = null;
				
				if(analog_inputs[i].initialized) {
					
					analog_type = 'input';
					
				} else if(analog_outputs[i].initialized) {
					
					analog_type = 'output';
					this.set_analog_value(i, analog_outputs[i].value);
					
				} else if(analog_triggers[i].initialized) {
					
					analog_type = 'trigger';
					if(analog_triggers[i].trig_state) {
						this.set_analog_value(i, true);
					} else {
						this.set_analog_value(i, false);
					}
				}
				
				var $analog = this.get_analog(i);
				
				if(analog_type === null) {
					$analog.addClass('hidden');
				} else {
					$analog.removeClass('hidden');
					$analog.find('.analog-type').text(analog_type);
					
				}
			}
		};
		
		this.get_analog = function(index) {
			var $slide_holders = this.element.find('.slide-holder');
			return $( $slide_holders[index] );
		};
			
		this.set_analog_value = function(index, value) {
			
			var num_value = _.isBoolean(value) ? (value ? 10 : -10) : parseFloat(value);
			
			var slide_holder = this.get_analog(index);
			slide_holder.find('input').slider('setValue', num_value);
			var slider = slide_holder.find('.slider');
			module.on_slide(slider, value);
		};
		
		
		this.get_analog_value = function(index) {
			var slide_holder = this.get_analog(index);
			return parseFloat(slide_holder.find('.slider-value').text());
		};
		
		
		this.on_slide = function(element, value) {
			
			var num_value = _.isBoolean(value) ? (value ? 10 : -10) : value;
			
			var negative_color = '#FCC';
			var positive_color = '#CFC';
			var neutral_color = 'lightgray';
			
			//get size and position
			var width = (Math.abs(num_value / 10.0) * 50).toFixed(0);
			var left = 50;
			if(num_value < 0) {
				left -= width;
			}
			//style
			element.find('.slider-track .slider-selection').css('left', left + '%');
			element.find('.slider-track .slider-selection').css('width', width + '%');
			if(num_value < 0) {
				element.find('.slider-track .slider-selection').css('background', negative_color);
				element.find('.slider-track .slider-handle').css('background', negative_color);
			} else if(num_value > 0) {
				element.find('.slider-track .slider-selection').css('background', positive_color);
				element.find('.slider-track .slider-handle').css('background', positive_color);
			} else {
				element.find('.slider-track .slider-handle').css('background', neutral_color);
			}
			
			//display value
			if(_.isBoolean(value)) {
				element.siblings('.slider-value').text(value ? 'True' : 'False');
			} else {
				element.siblings('.slider-value').text(value.toFixed(2));
			}
		};
	}
	
	Analog.prototype = new IOModule();
	
	// Load content
	$.get('modules/analog/analog.html', function(content) {
		
		// Add the content
		$('<div id="analog">' + content + '</div>').appendTo('body');
		
		// Create the module. Do nothing if it wasn't properly added
		var iomodule = new Analog();
		
		if(!sim.add_iomodule('analog', iomodule)) {
			return;
		}
		
		// Add the css
		sim.add_css('modules/analog/analog.css');
		
		// Initialize the sliders
		iomodule.element.find('.slide-holder').find('input').slider({
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
		
		for(var i = 0; i < 8; i++) {
			iomodule.set_analog_value(i, 0);
		}
		
		iomodule.element.find('.slide-holder').find('input').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			iomodule.on_slide(element, ev.value);
		});	
		
		
		// Add tooltips to the sliders
		iomodule.element.find('.slide-holder').tooltip();
		
		// Add to config modal
		var config = config_modal.config_file_content;
			
		var data = _.isObject(config.analog) ? config.analog : {};
		
		if(data.visible != 'y' && data.visible != 'n') {
			data.visible = 'y';
		}
		
		for(var i = 0; i < 8; i++) {
			
			var key = 'analog-' + i + '-tooltip';
			
			if( _.isString(data[key]) == false ) {
				data[key] = '';
			}	
		}
		
		apply_config(data);
		
		// config form
		var html = config_modal.get_radio_group('Visible:', 'visible', true, [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			]);
		
		for(var i = 0; i < 8; i++) {

			html += config_modal.get_input_field('Analog ' + i + ' Tooltip:', {
				type : "text",
				name : 'analog-' + i + '-tooltip',
				id : 'analog-' + i + '-tooltip'
			});		
		}
		
		// Add category
		config_modal.add_category('analog', {
			html: html,
			title : 'Analog',
			onselect : function(form, data) {

				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
				
				for(var i = 0; i < 8; i++) {
					var name = 'analog-' + i + '-tooltip';
					form.find('input[name=' + name + ']').val(data[name]);
				}
			},
			onsubmit : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();
				
				for(var i = 0; i < 8; i++) {
					var name = 'analog-' + i + '-tooltip';
					data[name] = form.find('input[name=' + name + ']').val();
				}
				
				apply_config(data);
			}
		}, data);
		
		function apply_config(data) {
			
			if(data.visible == 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}
			
			for(var i = 0; i < 8; i++) {
				var tooltip = data['analog-' + i + '-tooltip'];
				iomodule.get_analog(i).attr('data-original-title', tooltip);
			}
				
		}
		
	});
	

});
	
