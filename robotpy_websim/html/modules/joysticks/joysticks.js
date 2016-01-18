/*"use strict";

$(function() {
	
	function Joysticks() {
			
		this.title = 'Joysticks';
		
		this.order = 4;
		
		var module = this;
		
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		this.ui_updated = false;
		
		
		this.joystick_elements = [];
		
		this.init = function() {
			
			
			var $joysticks = $('<div class="row"></div>').appendTo(this.element);
			
			for(var i = 0; i < 6; i++) {
				
				var joystick_element = { holder: null, axes: [], buttons: [] };
				
				var $joystick = $('<div class="col-xs-4 joystick">' +
							     '<h4 class="text-center">Joystick ' + i + '</h4>' +
							     '<form class="form-horizontal" action=""></form>' +
						     '</div>').appendTo($joysticks);
				
				joystick_element.holder = $joystick;
				
				var axis_names = ['x', 'y', 'z', 't'];
				for(var a in axis_names) {
					
					var $axis = $('<p class="slide-holder ' + axis_names[a] + '-axis"></p>').appendTo($joystick).tooltip().sliderFacade({
						label: '<b>' + _.string.capitalize(axis_names[a]) + ' </b>',
						onChange: function() {
							module.ui_updated = true;
						}
					});
					
					joystick_element.axes.push($axis);
				}
				
				var $buttons = $('<div class="row"></row>').appendTo($joystick);
				
				for(var b = 0; b < 12; b++) {
					
					var $button_holder = $('<div class="col-xs-4 joystick-btn-container">' +
										      '<div class="checkbox">' +
										         '<label>' +
										         	'<input type="checkbox" class="joystick-btn"> ' + (b + 1) +
										      	 '</label>' +
										      '</div>' +
									       '</div>').appendTo($buttons).tooltip();
					
					var $button = $button_holder.find('input');
					
					joystick_element.buttons.push({ holder: $button_holder, button: $button });
				}
				
				this.joystick_elements.push(joystick_element);
			}
			
		};
		
		this.modify_data_to_server = function(data_to_server) {
			
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			var joysticks = data_to_server.joysticks;

			for(var j = 0; j < 6; j++) {
				for(var a = 0; a < 4; a++) {
					joysticks[j].axes[a] = this.joystick_elements[j].axes[a].sliderFacade('getValue');
				}
				
				for(var b = 0; b < 12; b++) {
					joysticks[j].buttons[b] = this.joystick_elements[j].buttons[b].button.prop('checked');
				}
			}
		};
			
		// Alert module that ui has been updated if fwd or rev limit switches have been pressed
		$('body').on('click', '#joysticks input[type=checkbox]', function() {
			module.ui_updated = true;
		});
	}

	sim.add_iomodule('joysticks', Joysticks, function(iomodule) {
		
		iomodule.init();
				
		// Add to config modal
		if(!config.config_data.joysticks)
			config.config_data.joysticks;
		
		var data = config.config_data.joysticks;
		
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
		var config_form = null;
		
		config_modal.add_category({
			config_key: 'joysticks',
			html: html,
			title : 'Joysticks',
			onopen : function(form, data) {
				config_form = form;
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
			onsave : function(form, data) {
				
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
		});
		
		function apply_config(data) {
			
			var joystick_visible = false;
			
			for(var j = 0; j < 6; j++) {
				
				if(data[j].visible == 'y') {
					iomodule.joystick_elements[j].holder.removeClass('hidden');
					joystick_visible = true;
				} else {
					iomodule.joystick_elements[j].holder.addClass('hidden');
				}
				
				// axes
				var axes = ['x', 'y', 'z', 't'];
				
				for(var a = 0; a < 4; a++) {
					
					var tooltip = data[j][axes[a] + '-axis-tooltip'];
					iomodule.joystick_elements[j].axes[a].attr('data-original-title', tooltip);
				}
				
				// buttons
				for(var b = 0; b < 12; b++) {
					
					var tooltip = data[j]['btn-' + (b + 1) + '-tooltip'];
					iomodule.joystick_elements[j].buttons[b].holder.attr('data-original-title', tooltip);
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
			
			var joystick = config_form.find('#joystick-chooser').val();
			var $joysticks = config_form.find('.joystick-config');
			
			
			for(var j = 0; j < 6; j++) {
				
				var $joystick = $( $joysticks[j] );
				if(j == joystick) {
					$joystick.removeClass('hidden');
				} else {
					$joystick.addClass('hidden');
				}
			}
		}
		
		// Context menu
		var context_menu_html = '';
		
		for(var i = 0; i < 6; i++) {
			context_menu_html += context_menu.create_checkbox('show-joystick-' + i, 'Show Joystick ' + i);
		}
		
		context_menu.add(iomodule, {
			config_key: 'joysticks',
			html: context_menu_html,
			oncreate: function(menu, data) {
				
				for(var i = 0; i < 6; i++) {
					
					(function(i) {
					
						menu.find('#show-joystick-' + i + ' input').prop('checked', data[i].visible == 'y');
						context_menu.add_checkbox_events(menu.find('#show-joystick-' + i), function(checked) {
							if(checked) {
								data[i].visible = 'y';
								iomodule.joystick_elements[i].holder.removeClass('hidden');
							} else {
								data[i].visible = 'n';
								iomodule.joystick_elements[i].holder.addClass('hidden');
							}
							
							var joystick_visible = false;
							
							for(var j = 0; j < 6; j++) {
								
								if(config.config_data.joysticks[j].visible == 'y') {
									joystick_visible = true;
									break;
								}
							}
							
							if(!joystick_visible)
								iomodule.element.addClass('hidden');
							
							config.save_config();
						});
						
					
					})(i);
				}
			
			}
		});
		
		
	});
	
});*/
	