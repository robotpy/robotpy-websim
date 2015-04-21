"use strict";


$(function() {
	
	function Digital() {
			
		var module = this;
		
		this.title = 'Digital';
		
		this.modify_data_to_server = function(data_to_server) {
			
			// Send dio value to server
			var dio = data_to_server.dio;	
			for(var i = 0; i < dio.length; i++) {
				dio[i].value = this.get_dio(i).find('.digital-io').hasClass('btn-success');
			}

		};
		
		this.update_interface = function(data_from_server) {

			// Hide the pwms if they aren't initialized. Update their values otherwise
			var pwm = data_from_server.pwm;
			for(var i = 0; i < pwm.length; i++) {
				var selector = this.get_pwm(i);
				if(!pwm[i].initialized) {
					selector.addClass('hide');
					continue;
				}
					
				selector.removeClass('hide');			
				this.set_slider_value(i, pwm[i].value);
			}
				
			// Hide DIOs if they aren't initialized
			var dio = data_from_server.dio;
			for(var i = 0; i < dio.length; i++) {
				var selector = this.get_dio(i);
				if(!dio[i].initialized) {
					selector.addClass('hide');
					continue;
				}
					
				selector.removeClass('hide');
			}
			
			// Hide the relays if they aren't initialized
			var relay = data_from_server.relay;
			for(var i = 0; i < relay.length; i++) {
				var selector = this.get_relay(i);
				if(!relay[i].initialized) {
					selector.addClass('hide');
					continue;
				}
				
				selector.removeClass('hide');
				this.set_relay_value(i, relay[i].fwd, relay[i].rev);

			}
		};
		
		this.get_pwm = function(index) {			
			var $pwms = this.element.find('.slide-holder');
			return $( $pwms[index] );
		};
		
		this.get_dio = function(index) {
			var $dios = this.element.find('.dio-holder');
			return $( $dios[index] );
		};
		
		this.get_relay = function(index) {
			var $relays = this.element.find('.relay-holder');
			return $( $relays[index] );
		}
		
		this.set_relay_value = function(index, fwd, rev) {
			var relay = this.get_relay(index);
			
			if(fwd) {
				relay.find('.relay').addClass('btn-success');
				relay.find('.relay').removeClass('btn-danger');
				relay.find('.relay').removeClass('btn-default');
			} else if(rev) {
				relay.find('.relay').removeClass('btn-success');
				relay.find('.relay').addClass('btn-danger');
				relay.find('.relay').removeClass('btn-default');
			} else {
				relay.find('.relay').removeClass('btn-success');
				relay.find('.relay').removeClass('btn-danger');
				relay.find('.relay').addClass('btn-default');
			}
		};
		
		
		this.set_slider_value = function(index, value) {
			
			value = parseFloat(value);
			
			var slide_holder = this.get_pwm(index);
			slide_holder.find('input').slider('setValue', value);
			var slider = slide_holder.find('.slider');
			module.on_slide(slider, value);
		};
		
		
		this.get_slider_value = function(index) {
			var slide_holder = this.get_pwm(index);
			return parseFloat(slide_holder.find('.slider-value').text());
		};
		
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
	}
	
	Digital.prototype = new IOModule();
	
	
	// Load content
	$.get('modules/digital/digital.html', function(content) {
		
		// Add the content
		$('<div id="digital">' + content + '</div>').appendTo('body');
		
		// Create the module. Do nothing if it wasn't properly added
		var iomodule = new Digital();
		
		if(!sim.add_iomodule('digital', iomodule)) {
			return;
		}
		
		// Add the css
		sim.add_css('modules/digital/digital.css');
		
		// Initialize the sliders
		iomodule.element.find('.pwm-slider').slider({
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
		
		//digital i/o, relay
		iomodule.element.find('.digital-io').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
		
		// Initalize the tooltip
		$('.slide-holder, .dio-holder, .relay-holder').tooltip();
		
		
		// Add to config modal
		(function() {
			var config = config_modal.config_file_content;
				
			var data = _.isObject(config.pwm) ? config.pwm : {};
			
			if(data.visible != 'y' && data.visible != 'n') {
				data.visible = 'y';
			}
			
			for(var i = 0; i < 20; i++) {
				
				var key = 'pwm-' + i + '-tooltip';
				
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
			
			for(var i = 0; i < 20; i++) {
	
				html += config_modal.get_input_field('PWM ' + i + ' Tooltip:', {
					type : "text",
					name : 'pwm-' + i + '-tooltip',
					id : 'pwm-' + i + '-tooltip'
				});		
			}
			
			// Add category
			config_modal.add_category('pwm', {
				html: html,
				title : 'PWM',
				onselect : function(form, data) {
	
					form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
					
					for(var i = 0; i < 20; i++) {
						var name = 'pwm-' + i + '-tooltip';
						form.find('input[name=' + name + ']').val(data[name]);
					}
				},
				onsubmit : function(form, data) {
					
					data.visible = form.find('input[name=visible]:checked').val();
					
					for(var i = 0; i < 20; i++) {
						var name = 'pwm-' + i + '-tooltip';
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
				
				for(var i = 0; i < 20; i++) {
					var tooltip = data['pwm-' + i + '-tooltip'];
					iomodule.get_pwm(i).attr('data-original-title', tooltip);
				}
							
				// Hide all if all are hidden
				if(iomodule.element.find('#relays').hasClass('hidden') &&
						iomodule.element.find('#dios').hasClass('hidden') &&
						iomodule.element.find('#pwms').hasClass('hidden') ) {
					
					iomodule.element.addClass('hidden');
				} else {
					iomodule.element.removeClass('hidden');
				}
			}
		}());
		
		
		
		
		(function() {
			var config = config_modal.config_file_content;
				
			var data = _.isObject(config.dio) ? config.dio : {};
			
			if(data.visible != 'y' && data.visible != 'n') {
				data.visible = 'y';
			}
			
			for(var i = 0; i < 26; i++) {
				
				var key = 'dio-' + i + '-tooltip';
				
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
			
			for(var i = 0; i < 26; i++) {
	
				html += config_modal.get_input_field('DIO ' + i + ' Tooltip:', {
					type : "text",
					name : 'dio-' + i + '-tooltip',
					id : 'dio-' + i + '-tooltip'
				});		
			}
			
			// Add category
			config_modal.add_category('dio', {
				html: html,
				title : 'Digital I/O',
				onselect : function(form, data) {
	
					form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
					
					for(var i = 0; i < 26; i++) {
						var name = 'dio-' + i + '-tooltip';
						form.find('input[name=' + name + ']').val(data[name]);
					}
				},
				onsubmit : function(form, data) {
					
					data.visible = form.find('input[name=visible]:checked').val();
					
					for(var i = 0; i < 26; i++) {
						var name = 'dio-' + i + '-tooltip';
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
				
				for(var i = 0; i < 26; i++) {
					var tooltip = data['dio-' + i + '-tooltip'];
					iomodule.get_dio(i).attr('data-original-title', tooltip);
				}
							
				// Hide all if all are hidden
				if(iomodule.element.find('#relays').hasClass('hidden') &&
						iomodule.element.find('#dios').hasClass('hidden') &&
						iomodule.element.find('#pwms').hasClass('hidden') ) {
					
					iomodule.element.addClass('hidden');
				} else {
					iomodule.element.removeClass('hidden');
				}
			}
		}());
		
		
		(function() {
			var config = config_modal.config_file_content;
				
			var data = _.isObject(config.relay) ? config.relay : {};
			
			if(data.visible != 'y' && data.visible != 'n') {
				data.visible = 'y';
			}
			
			for(var i = 0; i < 8; i++) {
				
				var key = 'relay-' + i + '-tooltip';
				
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
	
				html += config_modal.get_input_field('Relay ' + i + ' Tooltip:', {
					type : "text",
					name : 'relay-' + i + '-tooltip',
					id : 'relay-' + i + '-tooltip'
				});		
			}
			
			// Add category
			config_modal.add_category('relay', {
				html: html,
				title : 'Relay',
				onselect : function(form, data) {
	
					form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
					
					for(var i = 0; i < 8; i++) {
						var name = 'relay-' + i + '-tooltip';
						form.find('input[name=' + name + ']').val(data[name]);
					}
				},
				onsubmit : function(form, data) {
					
					data.visible = form.find('input[name=visible]:checked').val();
					
					for(var i = 0; i < 20; i++) {
						var name = 'relay-' + i + '-tooltip';
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
					var tooltip = data['relay-' + i + '-tooltip'];
					iomodule.get_relay(i).attr('data-original-title', tooltip);
				}
							
				// Hide all if all are hidden
				if(iomodule.element.find('#relays').hasClass('hidden') &&
						iomodule.element.find('#dios').hasClass('hidden') &&
						iomodule.element.find('#pwms').hasClass('hidden') ) {
					
					iomodule.element.addClass('hidden');
				} else {
					iomodule.element.removeClass('hidden');
				}
			}
		}());
		
	});
	
	
});
