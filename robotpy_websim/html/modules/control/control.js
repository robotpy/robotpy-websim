"use strict";

$(function() {
	
	function Control() { 
		this.title = 'Control'; 
		this.order = 5;
	};
	
	sim.add_iomodule('control', Control, function(iomodule) {
		
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