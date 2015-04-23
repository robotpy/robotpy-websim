"use strict";


$(function() {
	
	function Digital() {
			
		var module = this;
		
		this.title = 'Digital';
		
		this.order = 1;
		
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		this.ui_updated = false;
		
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		var prev_data = {
			pwms : {},
			dios : {},
			relays : {}
		};
		
		this.modify_data_to_server = function(data_to_server) {
			
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			// Send dio value to server
			var dio = data_to_server.dio;	
			for(var i = 0; i < dio.length; i++) {
				dio[i].value = this.get_dio(i).find('.digital-io').hasClass('btn-success');
			}

		};
		
		this.update_interface = function(data_from_server) {

			// Hide the pwms if they aren't initialized. Update their values otherwise
			for(var i = 0; i < data_from_server.pwm.length; i++) {
				
				// Only update if data has since changed
				var pwm = _.pick(data_from_server.pwm[i], 'initialized', 'value');
				
				if(_.isEqual(prev_data.pwms[i], pwm)) 
					continue;
				
				prev_data.pwms[i] = pwm;
							
				// Update
				var selector = this.get_pwm(i);
				if(!pwm.initialized) {
					selector.addClass('hide');
					continue;
				}
					
				selector.removeClass('hide');			
				this.set_slider_value(i, pwm.value);
			}
				
			// Hide DIOs if they aren't initialized
			for(var i = 0; i < data_from_server.dio.length; i++) {
				
				// Only update if data has since changed
				var dio = _.pick(data_from_server.dio[i], 'initialized');
				
				if(_.isEqual(prev_data.dios[i], dio)) 
					continue;
				
				prev_data.dios[i] = dio;
				
				// Update
				var selector = this.get_dio(i);
				if(!dio.initialized) {
					selector.addClass('hide');
					continue;
				}
					
				selector.removeClass('hide');
			}
			
			// Hide the relays if they aren't initialized
			for(var i = 0; i < data_from_server.relay.length; i++) {
				
				// Only update if data has since changed
				var relay = _.pick(data_from_server.relay[i], 'initialized', 'fwd', 'rev');
				
				if(_.isEqual(prev_data.relays[i], relay)) 
					continue;
				
				prev_data.relays[i] = relay;
				
				// Update
				var selector = this.get_relay(i);
				if(!relay.initialized) {
					selector.addClass('hide');
					continue;
				}
				
				selector.removeClass('hide');
				this.set_relay_value(i, relay.fwd, relay.rev);

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
		
		// Alert module that ui has been updated if fwd or rev limit switches have been pressed
		$('body').on('click', '#digital .btn.digital-io', function() {
			module.ui_updated = true;
		});
	}
	
	
	sim.add_iomodule('digital', Digital, function(iomodule) {
		
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

			var data = _.isObject(config.saved_config.pwm) ? config.saved_config.pwm : {};
			
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

			var data = _.isObject(config.saved_config.dio) ? config.saved_config.dio : {};
			
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

			var data = _.isObject(config.saved_config.relay) ? config.saved_config.relay : {};
			
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
