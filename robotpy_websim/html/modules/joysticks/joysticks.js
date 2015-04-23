"use strict";

$(function() {
	
	function Joysticks() {
			
		this.title = 'Joysticks';
		
		this.order = 4;
		
		var module = this;
		
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		this.ui_updated = false;
		
		
		this.modify_data_to_server = function(data_to_server) {
			
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			var joysticks = data_to_server.joysticks;

			for(var j = 0; j < 6; j++) {
				for(var a = 0; a < 4; a++) {
					joysticks[j].axes[a] = this.get_axis_value(j, a);
				}
				
				for(var b = 0; b < 12; b++) {
					joysticks[j].buttons[b] = this.get_button_value(j, b);
				}
			}
		};
		
		this.get_joystick = function(index) {
			return this.element.find('.joystick:nth-of-type(' + (index + 1) + ')');
		};
		
		this.get_axis = function(joystick, axis) {
			var joystick = this.get_joystick(joystick);
			return joystick.find('.slide-holder:nth-of-type(' + (axis + 1) + ')');
		};
		
		this.get_button = function(joystick, button) {
			var joystick = this.get_joystick(joystick);
			return joystick.find('.joystick-btn-' + (button));
		};
		
		this.set_axis_value = function(joystick, axis, value) {
			
			value = parseFloat(value);
			
			var axis = this.get_axis(joystick, axis);
			axis.find('input').slider('setValue', value);
			var slider = axis.find('.slider');
			this.on_slide(slider, value);
		}
		
		this.get_axis_value = function(joystick, axis) {
			var axis = this.get_axis(joystick, axis);
			return parseFloat(axis.find('.slider-value').text());
		};
		
		this.get_button_value = function(joystick, button) {
			var button = this.get_button(joystick, button);
			return button.is(":checked");
		}
		
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
		
		// Alert module that ui has been updated if fwd or rev limit switches have been pressed
		$('body').on('click', '#joysticks input[type=checkbox]', function() {
			module.ui_updated = true;
		});
	}

	sim.add_iomodule('joysticks', Joysticks, function(iomodule) {
		
		// Initialize the sliders
		iomodule.element.find('.joystick-slider').slider({
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
		
		for(var j = 0; j < 6; j++) {			
			for(var a = 0; a < 4; a++) {
				iomodule.set_axis_value(j, a, 0);
			}
		}
		

		iomodule.element.find('.joystick-slider').slider().on('slide', function(ev){
			var element = $(ev.target).parent();
			iomodule.on_slide(element, ev.value);
			iomodule.ui_updated = true;
		});
		
		// Initialize the tooltips
		for(var j = 0; j < 6; j++) {
			
			// axes
			for(var a = 0; a < 4; a++) {
				iomodule.get_axis(j, a).tooltip();
			}
			
			// buttons
			for(var b = 0; b < 12; b++) {
				iomodule.get_button(j, b).closest('.checkbox').tooltip();
			}
			
		}
		
		
		// Add to config modal

		var data = _.isObject(config.saved_config.joysticks) ? config.saved_config.joysticks : {};
		
		var tooltips = {};
		tooltips['x-axis-tooltip'] = 'x-Axis Tooltip:';
		tooltips['y-axis-tooltip'] = 'y-Axis Tooltip:';
		tooltips['z-axis-tooltip'] = 'z-Axis Tooltip:';
		tooltips['t-axis-tooltip'] = 't-Axis Tooltip:';
		
		for(var i = 1; i <= 12; i++) {
			tooltips['btn-' + i + '-tooltip'] = 'Button ' + i + ' Tooltip:';
		}
		
		
		for(var j = 0; j < 6; j++) {
			
			data[j] = _.isObject(data[j]) ? data[j] : {};
			
			if(data[j].visible != 'y' && data[j].visible != 'n') {
				data[j].visible = 'y';
			}
			
			for(var name in tooltips) {
				data[j][name] = _.isString(data[j][name]) ? data[j][name] : '';
			}
		}
		
		apply_config(data);

		
		// config form
		var html = config_modal.get_select('joystick-chooser', {
			'0' : 'Joystick 0', '1' : 'Joystick 1', '2' : 'Joystick 2', 
			'3' : 'Joystick 3', '4' : 'Joystick 4', '5' : 'Joystick 5'
		});
		
		for(var  i = 0; i < 6; i++) {
			
			html += '<div class="joystick-config">';
		
			html += config_modal.get_radio_group('Visible:', 'visible-' + i, true, [
		            { "label" : "Yes", "value" : "y" },
		            { "label" : "No", "value" : "n" }
				]);
			
			for(var name in tooltips) {
				
				html += config_modal.get_input_field(tooltips[name], {
					type : "text",
					name : name,
					id : name
				});	
			}
			
			html += '</div>';
		}
		
		
		// Add category
		config_modal.add_category('joysticks', {
			html: html,
			title : 'Joysticks',
			onselect : function(form, data) {
				
				set_visible_joystick_config();
				
				var $joysticks = form.find('.joystick-config');
				
				for(var j = 0; j < 6; j++) {
					
					var $joystick = $( $joysticks[j] );
					
					$joystick.find('input[name=visible-' + j + '][value=' + data[j].visible + ']').prop('checked', true);

					
					for(var name in tooltips) {
						$joystick.find('input[name=' + name + ']').val(data[j][name]);
					}
				}
			},
			onsubmit : function(form, data) {
				
				var $joysticks = form.find('.joystick-config');
				
				for(var j = 0; j < 6; j++) {
					
					var $joystick = $( $joysticks[j] );
					data[j].visible = $joystick.find('input[name=visible-' + j + ']:checked').val();
					
					for(var name in tooltips) {
						data[j][name] = $joystick.find('input[name=' + name + ']').val();
					}
				}
				
				
				apply_config(data);
			}
		}, data);
		
		function apply_config(data) {
			
			var joystick_visible = false;
			
			for(var j = 0; j < 6; j++) {
				
				if(data[j].visible == 'y') {
					iomodule.get_joystick(j).removeClass('hidden');
					joystick_visible = true;
				} else {
					iomodule.get_joystick(j).addClass('hidden');
				}
				
				// axes
				var axes = ['x', 'y', 'z', 't'];
				
				for(var a = 0; a < 4; a++) {
					
					var tooltip = data[j][axes[a] + '-axis-tooltip'];
					iomodule.get_axis(j, a).attr('data-original-title', tooltip);
				}
				
				// buttons
				for(var b = 0; b < 12; b++) {
					
					var tooltip = data[j]['btn-' + (b + 1) + '-tooltip'];
					iomodule.get_button(j, b).closest('.checkbox').attr('data-original-title', tooltip);
				}
			}
			
			if(joystick_visible) {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}
		}
		
		config_modal.category_form_holder.on('change', '#joystick-chooser', set_visible_joystick_config);
		
		function set_visible_joystick_config() {
			var form = config_modal.config_settings.joysticks.element;
			
			var joystick = form.find('#joystick-chooser').val();
			var $joysticks = form.find('.joystick-config');
			
			
			for(var j = 0; j < 6; j++) {
				
				var $joystick = $( $joysticks[j] );
				if(j == joystick) {
					$joystick.removeClass('hidden');
				} else {
					$joystick.addClass('hidden');
				}
			}
		}
		
	});
	
});


	