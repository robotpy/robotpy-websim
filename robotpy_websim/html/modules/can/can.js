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
		
		
		this.modify_data_to_server = function(data_to_server) {
			
			// If the ui has not been interacted with don't update
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			// Update data to server
			var can = data_to_server.CAN;

			for(var i in can) {
				
				var $can = this.get_can(i);
				if(!$can) {
					$can = add_can(i);
				}
				
				// Set limit switches
				var rev_closed = $can.find('input[name=rev-limit-switch]').prop('checked');
				//console.log(console.log(i) + ', ' + rev_closed);
				can[i].limit_switch_closed_rev = rev_closed;
				
				var fwd_closed = $can.find('input[name=fwd-limit-switch]').prop('checked');
				can[i].limit_switch_closed_for = fwd_closed;
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
				var $can = this.get_can(i);
				if(!$can) {
					
					$can = add_can(i);		
				}
				
				
				// Set value
				var value = can[i].value / 1024;
				this.set_can_value(i, value);
				
				// Set the mode
				var mode = can[i].mode_select;
				$can.find('.can-mode').text(get_mode_name(mode));
				
				// Set encode value
				var encoder = can[i].enc_position;
				$can.find('.encoder-value span').text(encoder);
				
				// Set S thingy value
				var sensor = can[i].sensor_position;
				$can.find('.sensor-value span').text(sensor);
				
			}
			
		};
		
		this.get_can = function(index) {
			//console.log('index: ' + index);
			var can = this.element.find('.can-device[device-index=' + index + ']');

			if(can.length === 0) {
				return  null;
			}
			
			return can;
			
		};
		
		this.get_can_value_holder = function(index) {
			var can = this.get_can(index);
			return can.find('.slide-holder');
		};
			
		this.set_can_value = function(index, value) {
			
			value = parseFloat(value);
			
			var can_value_holder = this.get_can_value_holder(index);
			can_value_holder.find('input').slider('setValue', value);
			var slider = can_value_holder.find('.slider');
			module.on_slide(slider, value);
		};
		
		
		this.get_can_value = function(index) {
			var can_value_holder = this.get_can_value_holder(index);
			return parseFloat(can_value_holder.find('.slider-value').text());
		};
		
		
		this.on_slide = function(element, value) {
			var negative_color = '#FCC';
			var positive_color = '#CFC';
			var neutral_color = 'lightgray';
			
			//get size and position
			var width = (Math.abs(value / 1.0) * 50.00).toFixed(0);
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
		
		function add_can(index) {
			
			//console.log(module);

			var $can = $('<div class="row can-device" device-index="' + index + '">' +
				'<div class="col-xs-1" style="padding-left: 10px">' +
					'<strong class="can-index" style="font-size: 20px;">' + index + '</strong>' +
				'</div>' +
				
				'<div class="col-xs-5" style="padding-left: 0px; padding-right: 0px">' +
					'<p class="slide-holder">' +
						'<input type="text" class="form-control" value="">' +
						'<span class="slider-value">0</span>' +
					'</p>' +
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
			
			$can.find('.slide-holder').find('input').slider({
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
			
			
			
			$can.find('.slide-holder').find('input').slider().on('slide', function(ev){
				var element = $(ev.target).parent();
				module.on_slide(element, ev.value);
			});	
			
			return $can;
			
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
	
	CAN.prototype = new IOModule();
	
	sim.add_iomodule('can', CAN, function(iomodule) {
		
	
		// Add tooltips to the sliders
		iomodule.element.find('.slide-holder').tooltip();
		
		
		// Add to config modal
		var data = _.isObject(config.saved_config.can) ? config.saved_config.can : {};
		
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
		config_modal.add_category('can', {
			html: html,
			title : 'CAN',
			onselect : function(form, data) {
				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
			},
			onsubmit : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();
	
				apply_config(data);
			}
		}, data);
		
		function apply_config(data) {
			
			if(data.visible == 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}			
		}
	});
	

});
	
