"use strict";

$(function() {
	
	function create_iomodule() {
		
		return sim.add_iomodule('solenoid', new function() {
			this.title = 'Solenoid';
			
			
			this.update_interface = function(data_from_server) {
				var solenoid = data_from_server.solenoid;
				for(var i = 0; i < solenoid.length; i++) {
					
					var selector = this.get_solenoid(i);
					if(!solenoid[i].initialized) {
						selector.addClass('hide');
						continue;
					} 
					
					selector.removeClass('hide');
					this.set_solenoid_value(i, solenoid[i].value);
				}
			};
			
			this.get_solenoid = function(index) {
				return this.element.find('.solenoid-holder:nth-of-type(' + (index + 1) + ')');
			};
			
			// TODO: Set the color of the solenoid indicator based on the real value given
			this.set_solenoid_value = function(index, value) {
				var solenoid = this.get_solenoid(index).find('.solenoid');
				
				if(value) {
					solenoid.addClass('btn-success');
					solenoid.removeClass('btn-danger');
					solenoid.removeClass('btn-default');
				} else if(!value) {
					solenoid.removeClass('btn-success');
					solenoid.addClass('btn-danger');
					solenoid.removeClass('btn-default');
				} else {
					solenoid.removeClass('btn-success');
					solenoid.removeClass('btn-danger');
					solenoid.addClass('btn-default');
				}
			};
		});
		
	}
	
	// Load content
	$.get('modules/solenoid/solenoid.html', function(content) {
		
		// Add the content
		$('<div id="solenoid">' + content + '</div>').appendTo('body');
		
		// Create the module. Do nothing if it wasn't properly added
		var iomodule = create_iomodule();
		
		if(!iomodule) {
			return;
		}
		
		// Add the css
		sim.add_css('modules/solenoid/solenoid.css');
		
		// Initialize the tooltip	
		for(var i = 0; i < 8; i++) {
			iomodule.get_solenoid(i).tooltip();
		}
		
		// Add to config modal
		var form = {};
		
		form.visible = {
			"type" : "radio-group",
			"label" : "Visible:",
			"inline" : true,
			"value" : "n",
			"radios" : [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			],
			"rules" : {},
			"messages" : {}
		};
		
		for(var i = 0; i < 8; i++) {
			form['solenoid-' + i + '-tooltip'] = {
				"type" : "input",
				"label" : "Solenoid " + i + " Tooltip:",
				"attr" : {
					"type" : "text",
					"value" : ""
				},
				"rules" : { },
				"messages" : { }
			};
		}
		
		config_modal.add_category('solenoid', 'Solenoid', form, 1);
		config_modal.add_update_listener('solenoid', true, function(solenoid) {
				
			// set tooltip
			for(var i = 0; i < 8; i++) {
				var tooltip = solenoid[0]['solenoid-' + i + '-tooltip'];
				iomodule.get_solenoid(i).attr('data-original-title', tooltip);
			}
			
			// Set visibility
			var visible = solenoid[0].visible;
			
			if(visible === 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}
			
		});
	});
	
});
