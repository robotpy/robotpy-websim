"use strict";

$(function() {
	
	// Load content
	$.get('modules/mode/mode.html', function(content) {
		
		// Add the content
		$('<div id="mode">' + content + '</div>').appendTo('body');
		
		// Create module
		var iomodule = sim.add_iomodule('mode', { 'title' : 'Control' });
		
		if(!iomodule)
			return;
		
		// Add css
		sim.add_css('modules/mode/mode.css');
		
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
	});
	
});