"use strict";

(function() {

	var cache = {
		$element : null,
		$mode : null,
		$connectionIndicator : null,
		$openConfigModalBtn : null
	};

	// Render the module
	cache.$element = $(sim.templates.control.control);
	cache.$mode = cache.$element.find("input[name='mode']");
	cache.$connectionIndicator = cache.$element.find(".connection-notification");
	cache.$openConfigModalBtn = cache.$element.find('.open-config-modal-btn');

	// Set robot mode
	cache.$mode.change(function() {
		var mode = $(this).val();
		var enabled = mode != 'disabled';
		if (mode == 'disabled')
			mode = 'teleop';
		sim.main.setRobotMode(mode, enabled);
	});

	cache.$openConfigModalBtn.click(function() {
		sim.configModal.show();
	});

	sim.events.on('simConnected', function() {
		cache.$connectionIndicator.addClass('connected');
		cache.$connectionIndicator.removeClass('disconnected');
		cache.$connectionIndicator.text('Connected!');		
	});

	sim.events.on('simDisconnected', function() {
		cache.$connectionIndicator.removeClass('connected');
		cache.$connectionIndicator.addClass('disconnected');
		cache.$connectionIndicator.text('Disconnected!');
	});

	cache.$element.appendTo('.websim-modules');

})(window.sim = window.sim || {});
