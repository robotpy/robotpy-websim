"use strict";

$(function() {
	
	function CAN() {
		
		var module = this;
		
		this.title = 'CAN';
		
		this.order = 3;
		
		var can_mode_map = {};
		
		// Get the can mode map from the server
		$.getJSON('/api/can_mode_map', function(data) { can_mode_map = data; });
		
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		this.ui_updated = false;
		
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		var prev_data = {
			can : { }	
		};
		
		// List of DOM CAN elements
		var can_elements = {};
		
		
		this.modify_data_to_server = function(data_to_server) {
			
			// If the ui has not been interacted with don't update
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			// Update data to server
			var can = data_to_server.CAN;

			for(var i in can) {
				
				if(can_elements[i] === undefined)
					add_can(i);
				
				var $can = can_elements[i];
				
				// Set limit switches
				can[i].limit_switch_closed_rev = $can.rev_limit_switch.prop('checked');
				can[i].limit_switch_closed_for = $can.fwd_limit_switch.prop('checked');
			}
		};
		
		this.update_interface = function(data_from_server) {

			for(var i in data_from_server.CAN) {
				
				// Only update if data has since changed
				var can = _.pick(data_from_server.CAN[i], 'value', 'mode_select', 'enc_position', 'sensor_position');
				
				if(_.isEqual(prev_data.can[i], can)) 
					continue;
				
				prev_data.can[i] = can;
				
				// Update CAN
				if(can_elements[i] === undefined)
					add_can(i);
				
				var $can = can_elements[i];
		
				// Set value
				$can.slider.sliderFacade('setValue', can.value / 1024);
				
				// Set the mode
				$can.mode.text(get_mode_name(can.mode_select));
				
				// Set encode value
				$can.encoder_value.text(can.enc_position);
				
				// Set S thingy value
				$can.sensor_value.text(can.sensor_position);
				
			}
			
		};
		
		function add_can(index) {

			var $can = $('<div class="row can-device" device-index="' + index + '">' +
				'<div class="col-xs-1" style="padding-left: 10px">' +
					'<strong class="can-index" style="font-size: 20px;">' + index + '</strong>' +
				'</div>' +
				
				'<div class="col-xs-5" style="padding-left: 0px; padding-right: 0px">' +
					'<p class="slide-holder"></p>' +
					'<span style="font-weight: 600">Mode: </span><span class="can-mode">PercentVBus</span>' +						
				'</div>' +
				
				'<div class="col-xs-4" style="padding-left: 10px;  padding-right: 0px;">' +
					'<p><strong class="encoder-value">Encoder: </strong><span>0</span></p>' +
					'<p><strong class="sensor-value">Sensor: </strong><span>0</span></p>' +
				'</div>' +
				
				'<div class="col-xs-2" style="left: -10px; padding-left: 0px;">' +
					'<label><input type="checkbox" name="for-limit-switch" /> Fwd</label>' +
					'<label><input type="checkbox" name="rev-limit-switch" /> Rev</label>' +
				'</div>' +
			'</div>').appendTo(module.element);
			
			var can_element = {};
			
			can_element.slider = $can.find('.slide-holder').sliderFacade().tooltip();
			can_element.slider.sliderFacade('disable');
			can_element.mode = $can.find('.can-mode');
			can_element.encoder_value = $can.find('.encoder-value span');
			can_element.sensor_value = $can.find('.sensor-value span');
			can_element.fwd_limit_switch = $can.find('input[name=for-limit-switch]');
			can_element.rev_limit_switch = $can.find('input[name=rev-limit-switch]');
			
			can_elements[index] = can_element;
			
		}
		
		function get_mode_name(mode) {
			
			var mode_name = can_mode_map[mode];
				
			return (mode_name !== undefined) ? mode_name : 'Unknown';
		}
		
		// Alert module that ui has been updated if fwd or rev limit switches have been pressed
		$('body').on('click', '#can input[name=for-limit-switch], #can input[name=rev-limit-switch]', function() {
			module.ui_updated = true;
		});
	}
	
	sim.add_iomodule('can', CAN, function(iomodule) {
		
		// Add to config modal
		if(!config.config_data.can)
			config.config_data.can = {};
		
		var data = config.config_data.can;
		
		if(data.visible != 'y' && data.visible != 'n') {
			data.visible = 'y';
		}
		
		apply_config(data);
		
		// config form
		var html = config_modal.get_radio_group('Visible:', 'visible', true, [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			]);
		
		// Add category
		config_modal.add_category({
			config_key: 'can',
			html: html,
			title : 'CAN',
			onopen : function(form, data) {
				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
			},
			onsave : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();
	
				apply_config(data);
			}
		});
		
		function apply_config(data) {
			
			if(data.visible == 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}			
		}
		
		// Context menu
		context_menu.add(iomodule, {
			config_key: 'can',
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
