"use strict";

$(function() {
	
	function create_iomodule() {
		
		return sim.add_iomodule('can', new function() {
		
			var module = this;
			
			this.title = 'CAN';
			
			
			this.modify_data_to_server = function(data_to_server) {
				
				var can = data_to_server.CAN;
	
				
				for(var i in can) {
					
					var $can = this.get_can(i);
					if(!$can) {
						$can = add_can(i);
					}
					
					// Set limit switches
					var rev_closed = $can.find('input[name=rev-limit-switch]').prop('checked');
					can[i].limit_switch_closed_rev = rev_closed;
					
					var fwd_closed = $can.find('input[name=fwd-limit-switch]').prop('checked');
					can[i].limit_switch_closed_for = fwd_closed;
				}
			};
			
			this.update_interface = function(data_from_server) {
				var can = data_from_server.CAN;
				
				
				for(var i in can) {
					
					
					var $can = this.get_can(i);
					if(!$can) {
						
						$can = this.add_can(i);
		
					}
					
					// Set value
					var value = can[i].value / 1024;
					this.set_can_value(i, value);
					
					// Set the mode
					var mode = can[i].mode_select;
					$can.find('.can-mode').text(mode);
					
					// Set encode value
					var encoder = can[i].enc_position;
					$can.find('.encoder-value span').text(encoder);
					
					// Set S thingy value
					var s_thingy = 0;
					
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
			
			this.add_can = function(index) {

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
						'<p><strong class="s-value">S: </strong><span>0</span></p>' +
					'</div>' +
					
					'<div class="col-xs-2" style="left: -10px; padding-left: 0px;">' +
						'<label><input type="checkbox" name="for-limit-switch" /> Fwd</label>' +
						'<label><input type="checkbox" name="rev-limit-switch" /> Rev</label>' +
					'</div>' +
				'</div>').appendTo(this.element);
				
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
		});
	}
	

	
	// Add the content
	$('<div id="can"></div>').appendTo('body');
	
	// Create the module. Do nothing if it wasn't properly added
	var iomodule = create_iomodule();
	
	if(!iomodule) {
		return;
	}
	
	// Add the css
	sim.add_css('modules/can/can.css');
	
	
	
	// Add tooltips to the sliders
	iomodule.element.find('.slide-holder').tooltip();
	
	// Add to config modal
	var form = {};
	
	form.visible = {
		"type" : "radio-group",
		"label" : "Visible:",
		"inline" : true,
		"value" : "y",
		"radios" : [
            { "label" : "Yes", "value" : "y" },
            { "label" : "No", "value" : "n" }
		],
		"rules" : {},
		"messages" : {}
	};
	
	config_modal.add_category('can', 'CAN', form, 1);
	config_modal.add_update_listener('can', true, function(can) {
			
		var visible = can[0].visible;
		
		if(visible === 'y') {
			iomodule.element.removeClass('hidden');
		} else {
			iomodule.element.addClass('hidden');
		}
		
		
	});
	

});
	
