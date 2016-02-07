"use strict";

(function(sim) {

	var cache = {
		$element : null,
		solenoids : [],
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		prevData : {
			solenoids : {}
		},
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		uiUpdated : false
	};


	// Render the module
	cache.$element = $(sim.compileTemplate.handlebars(sim.templates.solenoid.solenoid, {
		solenoids : _.range(8)
	}));

	// Initialize solenoids
	cache.$element.find('.solenoid-holder').each(function() {
		var $el = $(this),
			$button = $el.find('.solenoid');

		$el.tooltip();
		cache.solenoids.push({
			$element : $el,
			$button : $button
		});
	});	


	sim.events.on('serverDataUpdate', function(serverData, enabled) {
		_.forEach(serverData.solenoid, function(solenoid, i) {
			// Only update if data has since changed
			var solenoidData = _.pick(solenoid, 'initialized', 'value');
			
			if(_.isEqual(cache.prevData.solenoids[i], solenoidData)) return;
			
			cache.prevData.solenoids[i] = solenoidData;
			
			// Update solenoid
			if(!solenoidData.initialized) {
				cache.solenoids[i].$element.addClass('hide');
				return;
			} 
			
			cache.solenoids[i].$element.removeClass('hide');
			setSolenoidValue(i, solenoidData.value);
		});
	});

	// TODO: Set the color of the solenoid indicator based on the real value given
	function setSolenoidValue(index, value) {
		var solenoid = cache.solenoids[index].$button;
		
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

	// Add config
	sim.config.setCategoryDefaults('solenoid', {
		visible : 'y',
		tooltips : Array(8).fill('')
	});

	cache.$config = $(sim.compileTemplate.handlebars(sim.templates.solenoid.config));
	sim.configModal.addCategory(cache.$config);

	sim.events.on('configCategoryUpdated', 'solenoid', function(config) {	
		if(config.visible == 'y') {
			cache.$element.removeClass('hidden');
		} else {
			cache.$element.addClass('hidden');
		}
		
		_.forEach(config.tooltips, function(tooltip, i) {
			cache.solenoids[i].$element.attr('data-original-title', tooltip);
		});
	});

	cache.$element.appendTo('.websim-modules');

})(window.sim = window.sim || {});