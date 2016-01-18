/*"use strict";


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
		
		// Holds DOM elements
		this.pwm_holder = null;
		this.dio_holder = null;
		this.relay_holder = null;
		
		this.pwm_elements = [];
		this.dio_elements = [];
		this.relay_elements = [];
		
		// initializes the module
		this.init = function() {
			
			var $digital = $('<div class="row">' +
					 	 	'<div class="col-xs-5" id="pwms">' +
					 	 		'<h4 class="text-center">PWM</h4>' +
					 	 		'<form class="form-horizontal" action=""></form>' +
					 	 	'</div>' +
					 	 	'<div class="col-xs-4" id="dios">' +
					 	 		'<h4 class="text-center">Digital I/O</h4>' +
					 	 		'<form class="form-horizontal" action="" class="dio-buttons"></form>' +
				 	 		'</div>' +
				 	 		'<div class="col-xs-3" id="relays">' +
				 	 			'<h4 class="text-center">Relay</h4>' +
				 	 			'<form class="form-horizontal" action=""></form>' +
			 	 			'</div>' +
						 '</row>').appendTo(this.element);
			
			// Initializes the pwms
			var $pwms = $digital.find('#pwms form');
			this.pwm_holder = $digital.find('#pwms');
			
			for(var i = 0; i < 20; i++) {
				var $pwm = $('<p class="slide-holder"></p>').appendTo($pwms).tooltip().sliderFacade({
					label: '<b>' + i + '</b> '
				});
				$pwm.sliderFacade('disable');
				this.pwm_elements.push($pwm);
			}
			
			// Initialize the dios
			var $dios = $digital.find('#dios form');
			this.dio_holder = $digital.find('#dios');
			
			for(var i = 0; i < 26; i++) {
				
				if(i < 10)
					var index = '&nbsp;' + i;
				else
					var index = i;
				
				var $dio_holder = $('<div class="col-xs-6 dio-holder">' +
									'<div class="row">' +
										'<div class="col-xs-6"><b>' + index + '</b></div>' +
										'<div class="col-xs-5">' +
											'<a href="#" class="btn btn-danger btn-circle digital-io"></a>' +
										'</div>' +
									'</div>' +
								'</div>').appendTo($dios).tooltip();
				
				var $dio = $dio_holder.find('.digital-io');
				this.dio_elements.push({ holder: $dio_holder, button: $dio });
			}
			
			// Initialize the relays
			var $relays = $digital.find('#relays form');
			this.relay_holder = $digital.find('#relays');
			
			for(var i = 0; i < 8; i++) {
				var $relay_holder = $('<div class="row relay-holder">' +
						  		      '<div class="col-xs-4"><b>&nbsp;' + i + '</b></div>' +
					  		          '<div class="col-xs-5">' +
				  		          	     '<a href="#" class="btn btn-danger btn-circle relay"></a>' +
				  		          	  '</div>' +
			  		          	  '</div>').appendTo($relays).tooltip();
				
				var $relay = $relay_holder.find('.relay');
				this.relay_elements.push({ holder: $relay_holder, button: $relay });
			}
			
			
		};
		
		this.modify_data_to_server = function(data_to_server) {
			
			if(!this.ui_updated)
				return;
			
			this.ui_updated = false;
			
			// Send dio value to server
			var dio = data_to_server.dio;	
			for(var i = 0; i < dio.length; i++) {
				dio[i].value = dio_elements[i].button.hasClass('btn-success');
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
				if(!pwm.initialized) {
					this.pwm_elements[i].addClass('hide');
					continue;
				}
					
				this.pwm_elements[i].removeClass('hide');
				this.pwm_elements[i].sliderFacade('setValue', pwm.value);
			}
				
			// Hide DIOs if they aren't initialized
			for(var i = 0; i < data_from_server.dio.length; i++) {
				
				// Only update if data has since changed
				var dio = _.pick(data_from_server.dio[i], 'initialized');
				
				if(_.isEqual(prev_data.dios[i], dio)) 
					continue;
				
				prev_data.dios[i] = dio;
				
				// Update
				if(!dio.initialized) {
					this.dio_elements[i].holder.addClass('hide');
					continue;
				}
					
				this.dio_elements[i].holder.removeClass('hide');
			}
			
			// Hide the relays if they aren't initialized
			for(var i = 0; i < data_from_server.relay.length; i++) {
				
				// Only update if data has since changed
				var relay = _.pick(data_from_server.relay[i], 'initialized', 'fwd', 'rev');
				
				if(_.isEqual(prev_data.relays[i], relay)) 
					continue;
				
				prev_data.relays[i] = relay;
				
				// Update
				if(!relay.initialized) {
					this.relay_elements[i].holder.addClass('hide');
					continue;
				}
				
				this.relay_elements[i].holder.removeClass('hide');
				this.set_relay_value(i, relay.fwd, relay.rev);

			}
		};
		
		
		this.set_relay_value = function(index, fwd, rev) {
			var relay = this.relay_elements[index].button;
			
			if(fwd) {
				relay.addClass('btn-success');
				relay.removeClass('btn-danger');
				relay.removeClass('btn-default');
			} else if(rev) {
				relay.removeClass('btn-success');
				relay.addClass('btn-danger');
				relay.removeClass('btn-default');
			} else {
				relay.removeClass('btn-success');
				relay.removeClass('btn-danger');
				relay.addClass('btn-default');
			}
		};
		
		
		// Alert module that ui has been updated if fwd or rev limit switches have been pressed
		$('body').on('click', '#digital .btn.digital-io', function() {
			module.ui_updated = true;
		});
	}
	
	
	sim.add_iomodule('digital', Digital, function(iomodule) {
		
		iomodule.init();
		
		//digital i/o, relay
		iomodule.element.find('.digital-io').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('btn-success');
			$(this).toggleClass('btn-danger');
		});
		
		
		// Add to config modal
		(function() {


			if(!config.config_data.pwm)
				config.config_data.pwm = {};

			var data = config.config_data.pwm;
			
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
			config_modal.add_category({
				config_key: 'pwm',
				html: html,
				title : 'PWM',
				onopen : function(form, data) {
	
					form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
					
					for(var i = 0; i < 20; i++) {
						var name = 'pwm-' + i + '-tooltip';
						form.find('input[name=' + name + ']').val(data[name]);
					}
				},
				onsave : function(form, data) {
					
					data.visible = form.find('input[name=visible]:checked').val();
					
					for(var i = 0; i < 20; i++) {
						var name = 'pwm-' + i + '-tooltip';
						data[name] = form.find('input[name=' + name + ']').val();
					}
					
					apply_config(data);
				}
			});
			
			function apply_config(data) {
				
				if(data.visible == 'y') {
					iomodule.pwm_holder.removeClass('hidden');
				} else {
					iomodule.pwm_holder.addClass('hidden');
				}
				
				for(var i = 0; i < 20; i++) {
					var tooltip = data['pwm-' + i + '-tooltip'];
					iomodule.pwm_elements[i].attr('data-original-title', tooltip);
				}
							
				hide_digital_if_empty();
			}
			
		}());
		
		(function() {

			if(!config.config_data.dio)
				config.config_data.dio = {};
			
			var data = config.config_data.dio;
			
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
			config_modal.add_category({
				config_key: 'dio',
				html: html,
				title : 'Digital I/O',
				onopen : function(form, data) {
	
					form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
					
					for(var i = 0; i < 26; i++) {
						var name = 'dio-' + i + '-tooltip';
						form.find('input[name=' + name + ']').val(data[name]);
					}
				},
				onsave : function(form, data) {
					
					data.visible = form.find('input[name=visible]:checked').val();
					
					for(var i = 0; i < 26; i++) {
						var name = 'dio-' + i + '-tooltip';
						data[name] = form.find('input[name=' + name + ']').val();
					}
					
					apply_config(data);
				}
			});
			
			function apply_config(data) {
				
				if(data.visible == 'y') {
					iomodule.dio_holder.removeClass('hidden');
				} else {
					iomodule.dio_holder.addClass('hidden');
				}
				
				for(var i = 0; i < 26; i++) {
					var tooltip = data['dio-' + i + '-tooltip'];
					iomodule.dio_elements[i].holder.attr('data-original-title', tooltip);
				}
							
				hide_digital_if_empty();
			}
		}());
		
		
		(function() {

			if(!config.config_data.relay)
				config.config_data.relay = {};
			
			var data = config.config_data.relay;
			
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
			config_modal.add_category({
				config_key: 'relay',
				html: html,
				title : 'Relay',
				onopen : function(form, data) {
	
					form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
					
					for(var i = 0; i < 8; i++) {
						var name = 'relay-' + i + '-tooltip';
						form.find('input[name=' + name + ']').val(data[name]);
					}
				},
				onsave : function(form, data) {
					
					data.visible = form.find('input[name=visible]:checked').val();
					
					for(var i = 0; i < 20; i++) {
						var name = 'relay-' + i + '-tooltip';
						data[name] = form.find('input[name=' + name + ']').val();
					}
					
					apply_config(data);
				}
			});
			
			function apply_config(data) {
				
				if(data.visible == 'y') {
					iomodule.relay_holder.removeClass('hidden');
				} else {
					iomodule.relay_holder.addClass('hidden');
				}
				
				for(var i = 0; i < 8; i++) {
					var tooltip = data['relay-' + i + '-tooltip'];
					iomodule.relay_elements[i].holder.attr('data-original-title', tooltip);
				}
							
				hide_digital_if_empty();
			}
		}());
		
		
		// Context menu
		context_menu.add(iomodule, {
			html: context_menu.create_checkbox('show-pwms', 'Show PWMs') +
				  context_menu.create_checkbox('show-dios', 'Show DIOs') +
				  context_menu.create_checkbox('show-relays', 'Show Relays'),
			oncreate: function(menu, data) {
				
				var categories = ['pwm', 'dio', 'relay'];
				for(var i = 0; i < categories.length; i++) {
					
					(function(cat) {
					
						menu.find('#show-' + cat + 's input').prop('checked', data[cat].visible == 'y');
						context_menu.add_checkbox_events(menu.find('#show-' + cat + 's'), function(checked) {
							if(checked) {
								data[cat].visible = 'y';
								iomodule[cat + '_holder'].removeClass('hidden');
							} else {
								data[cat].visible = 'n';
								iomodule[cat + '_holder'].addClass('hidden');
							}
							
							hide_digital_if_empty();
							config.save_config();
						});
					})(categories[i]);
				}
			
			}
		});
		
		function hide_digital_if_empty() {
			// Hide all if all are hidden
			if(iomodule.relay_holder.hasClass('hidden') &&
					iomodule.dio_holder.hasClass('hidden') &&
					iomodule.pwm_holder.hasClass('hidden') ) {
				
				iomodule.element.addClass('hidden');
			} else {
				iomodule.element.removeClass('hidden');
			}
		}
		
		
		
	});
	
});*/
