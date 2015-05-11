"use strict";

$(function() {
	
	function Analog() {
		
		var module = this;
		
		this.title = 'Analog';
		
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		this.ui_updated = false;
		
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		var prev_data = {
			analogs : { }	
		};
		
		this.order = 0;
		
		
		this.sliders = [];
		
		
		this.modify_data_to_server = function(data_to_server) {
			
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			// Send analog input values to server		
			for(var i = 0; i < 8; i++) {		
				
				var analog_type = module.sliders[i].analogTypeElement.text();
				
				if(analog_type === 'input') {
					var value = module.sliders[i].element.sliderFacade('getValue');
					data_to_server.analog_in[i].value = value;
				}
			}
		};
		
		this.update_interface = function(data_from_server) {
				
			for(var i = 0; i < 8; i++) {
				
				// Only update if data has since changed
				var analog = {
					input : _.pick(data_from_server.analog_in[i], 'initialized', 'value'),
					output : _.pick(data_from_server.analog_out[i], 'initialized', 'value'),
					trigger : _.pick(data_from_server.analog_trigger[i], 'initialized', 'trig_state')
				};
				
				if(_.isEqual(prev_data.analogs[i], analog)) 
					continue;
				
				prev_data.analogs[i] = analog;
				
				// Update the interface
				var analog_type = null;
				
				if(analog.input.initialized)			
					analog_type = 'input';
				else if(analog.output.initialized)
					analog_type = 'output';			
				else if(analog.trigger.initialized)					
					analog_type = 'trigger';

				if(analog_type === null) {
					this.sliders[i].element.addClass('hidden');
				} else {
					this.sliders[i].element.removeClass('hidden');
					this.sliders[i].analogTypeElement.text(analog_type);
					
					if(analog_type != 'input')
						this.sliders[i].element.sliderFacade('setValue', analog.output.value);
				}
			}
		};
		
		
		
		// The events that alert the server of ui updates
	}
	
	sim.add_iomodule('analog', Analog, function(iomodule) {
		
		
		// Create 8 sliders
		for(var i = 0; i < 8; i++) {
			
			var slider_element = $('<p></p>')
				.appendTo(iomodule.element)
				.sliderFacade({
					magnitude: 10,
					label: '<b>' + i + '</b> (<span class="analog-type"></span>)',
					setTextValue: function(element, value) {

						var $analog_type = element.data('websim-sliderFacade').analogTypeElement;
							
						if($analog_type && $analog_type.text() == 'trigger') {
							return (value < 0) ? 'False' : 'True';
						}
						
						return value;
					},
					onChange(element, value) {
						iomodule.ui_updated = true;
					},
					keyStep: 1
				}).tooltip();
			
			var slider_obj = slider_element.data('websim-sliderFacade');
			slider_obj.analogTypeElement = slider_obj.labelElement.find('.analog-type');
			
			iomodule.sliders.push(slider_obj);		
		}
		
		// Add to config modal
		if(!config.config_data.analog)
			 config.config_data.analog = {};
		
		var data = config.config_data.analog;
		
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
		config_modal.add_category({
			config_key: 'analog',
			html: html,
			title : 'Analog',
			onopen : function(form, data) {

				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
				
				for(var i = 0; i < 8; i++) {
					var name = 'analog-' + i + '-tooltip';
					form.find('input[name=' + name + ']').val(data[name]);
				}
			},
			onsave : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();
				
				for(var i = 0; i < 8; i++) {
					var name = 'analog-' + i + '-tooltip';
					data[name] = form.find('input[name=' + name + ']').val();
				}
				
				apply_config(data);
			}
		});
		
		function apply_config(data) {
			
			if(data.visible == 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}
			
			for(var i = 0; i < 8; i++) {
				var tooltip = data['analog-' + i + '-tooltip'];
				iomodule.sliders[i].element.attr('data-original-title', tooltip);
			}
				
		}
		
		
		// Context menu
		context_menu.add(iomodule, {
			config_key: 'analog',
			oncreate: function(menu, data) {
				menu.find('#hide-iomodule').on('click', function() {
					data.visible = 'n';
					iomodule.element.addClass('hidden');
					config.save_config();
				});
			}
		});
		
	});
	

});
	
