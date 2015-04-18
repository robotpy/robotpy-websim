"use strict";

$(function() {
	
	// Load content
	$.get('modules/control/control.html', function(content) {
		
		// Add the content
		$('<div id="control">' + content + '</div>').appendTo('body');
		
		// Create module
		function Control(){ this.title = 'Control'; };
		Control.prototype = new IOModule();
		
		var iomodule = new Control();

		if(!sim.add_iomodule('control', iomodule)) {
			return;
		}
		
		// Add css
		sim.add_css('modules/control/control.css');
		
		// Initialize the module
		iomodule.element.find("input[name='mode']").change(function() {
			var mode = $(this).val();
			var enabled = mode != 'disabled';
			if (mode == 'disabled')
				mode = 'teleop';
			sim.set_robot_mode(mode, enabled);
		});
		
		// enable config modal button
		$('#open-config-modal-btn').click(function() {
			config_modal.show();
		});
		
		// Add connection listener
		sim.add_connection_listener(function(connected) {
			
			var $connection_indicator = iomodule.element.find('#connection_notification');
			
			if(connected) {
				$connection_indicator.addClass('connected');
				$connection_indicator.removeClass('disconnected');
				$connection_indicator.text('Connected!');		
			} else {
				$connection_indicator.removeClass('connected');
				$connection_indicator.addClass('disconnected');
				$connection_indicator.text('Disconnected!');
			}
			
		});
	});
	
});