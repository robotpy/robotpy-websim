"use strict";

$(function() {
	
	function Solenoid() {
		this.title = 'Solenoid';
		
		this.order = 2;
		
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		var prev_data = {
			solenoids : { }	
		};
		
		
		this.update_interface = function(data_from_server) {
			
			for(var i = 0; i < data_from_server.solenoid.length; i++) {
				
				// Only update if data has since changed
				var solenoid = _.pick(data_from_server.solenoid[i], 'initialized', 'value');
				
				if(_.isEqual(prev_data.solenoids[i], solenoid)) 
					continue;
				
				prev_data.solenoids[i] = solenoid;
				
				// Update solenoid
				var selector = this.get_solenoid(i);
				if(!solenoid.initialized) {
					selector.addClass('hide');
					continue;
				} 
				
				selector.removeClass('hide');
				this.set_solenoid_value(i, solenoid.value);
			}
		};
		
		this.get_solenoid = function(index) {
			return this.element.find('.solenoid-holder:nth-of-type(' + (index + 1) + ')');
		};
		
		// TODO: Set the color of the solenoid indicator based on the real value given
		this.set_solenoid_value = function(index, value) {
			var solenoid = this.get_solenoid(index).find('.solenoid');
			
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
		for(var i = 0; i < 8; i++) {
			iomodule.get_solenoid(i).tooltip();
		}
				
		// Add to config modal

		var data = _.isObject(config.saved_config.solenoid) ? config.saved_config.solenoid : {};
		
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
		config_modal.add_category('solenoid', {
			html: html,
			title : 'Solenoid',
			onselect : function(form, data) {

				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
				
				for(var i = 0; i < 8; i++) {
					var name = 'solenoid-' + i + '-tooltip';
					form.find('input[name=' + name + ']').val(data[name]);
				}
			},
			onsubmit : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();
				
				for(var i = 0; i < 8; i++) {
					var name = 'solenoid-' + i + '-tooltip';
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
				var tooltip = data['solenoid-' + i + '-tooltip'];
				iomodule.get_solenoid(i).attr('data-original-title', tooltip);
			}
				
		}
	});
	
});
