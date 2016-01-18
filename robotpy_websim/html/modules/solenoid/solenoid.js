/*"use strict";

$(function() {
	
	function Solenoid() {
		this.title = 'Solenoid';
		
		this.order = 2;
		
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		var prev_data = {
			solenoids : { }	
		};
		
		// Solenoid DOM elements
		this.solenoid_elements = [];
		
		this.init = function() {
			
			var $solenoids = $('<div class="row">' +
							      '<form class="form-horizontal" action=""></form>' +
							   '</div>').appendTo(this.element);
			
			for(var i = 0; i < 8; i++) {
				
				var $solenoid_holder = $('<div class="col-xs-3 solenoid-holder">' +
								     '<div class="row">' +
								     	'<b>' + i + '</b>' +
								     	'<a href="#" class="btn btn-danger btn-circle solenoid"></a>' +
								     '</div>' +
								  '</div>').appendTo($solenoids).tooltip();	
				
				var $solenoid = $solenoid_holder.find('.solenoid');
				
				this.solenoid_elements.push({ holder: $solenoid_holder, solenoid: $solenoid });
			}
		};
		
		
		this.update_interface = function(data_from_server) {
			
			for(var i = 0; i < data_from_server.solenoid.length; i++) {
				
				// Only update if data has since changed
				var solenoid = _.pick(data_from_server.solenoid[i], 'initialized', 'value');
				
				if(_.isEqual(prev_data.solenoids[i], solenoid)) 
					continue;
				
				prev_data.solenoids[i] = solenoid;
				
				// Update solenoid
				if(!solenoid.initialized) {
					this.solenoid_elements[i].holder.addClass('hide');
					continue;
				} 
				
				this.solenoid_elements[i].holder.removeClass('hide');
				this.set_solenoid_value(i, solenoid.value);
			}
		};
		
		// TODO: Set the color of the solenoid indicator based on the real value given
		this.set_solenoid_value = function(index, value) {
			var solenoid = this.solenoid_elements[index].solenoid;
			
			if(value === true) {
				solenoid.addClass('btn-success');
				solenoid.removeClass('btn-danger');
				solenoid.removeClass('btn-default');
			} else if(value === false) {
				solenoid.removeClass('btn-success');
				solenoid.addClass('btn-danger');
				solenoid.removeClass('btn-default');
			} else {
				solenoid.removeClass('btn-success');
				solenoid.removeClass('btn-danger');
				solenoid.addClass('btn-default');
			}
		};
		
	}
	
	sim.add_iomodule('solenoid', Solenoid, function(iomodule) {
		
		// Initialize the tooltip	
		iomodule.init();
		
		// Add to config modal
		if(!config.config_data.solenoid)
			config.config_data.solenoid = {};
		
		var data = config.config_data.solenoid;
		
		if(data.visible != 'y' && data.visible != 'n') {
			data.visible = 'y';
		}
		
		for(var i = 0; i < 8; i++) {
			
			var key = 'solenoid-' + i + '-tooltip';
			
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

			html += config_modal.get_input_field('Solenoid ' + i + ' Tooltip:', {
				type : "text",
				name : 'solenoid-' + i + '-tooltip',
				id : 'solenoid-' + i + '-tooltip'
			});		
		}
		
		// Add category
		config_modal.add_category({
			config_key: 'solenoid',
			html: html,
			title : 'Solenoid',
			onopen : function(form, data) {

				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
				
				for(var i = 0; i < 8; i++) {
					var name = 'solenoid-' + i + '-tooltip';
					form.find('input[name=' + name + ']').val(data[name]);
				}
			},
			onsave : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();
				
				for(var i = 0; i < 8; i++) {
					var name = 'solenoid-' + i + '-tooltip';
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
				var tooltip = data['solenoid-' + i + '-tooltip'];
				iomodule.solenoid_elements[i].holder.attr('data-original-title', tooltip);
			}		
		}
		
		// Context menu
		context_menu.add(iomodule, {
			config_key: 'solenoid',
			oncreate: function(menu, data) {
				menu.find('#hide-iomodule').on('click', function() {
					data.visible = 'n';
					iomodule.element.addClass('hidden');
					config.save_config();
				});
			}
		});
	});
	
});*/
