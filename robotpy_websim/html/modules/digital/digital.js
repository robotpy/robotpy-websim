"use strict";


(function() {

	var cache = {
		$element : null,
		pwms : {
			$element : null,
			devices : []
		},
		dios : {
			$element : null,
			devices : []
		},
		relays : {
			$element : null,
			devices : []
		},
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		prevData : {
			pwms : {},
			dios : {},
			relays : {}
		},
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		uiUpdated : false
	};

	// Render the module
	cache.$element = $(sim.compileTemplate.handlebars(sim.templates.digital.digital, {
		pwms : _.range(20),
		dios : _.range(26),
		relays : _.range(8)
	}));



	// Initialize pwms
	cache.pwms.$element = cache.$element.find('.pwms form');
	cache.pwms.$element.find('.slide-holder').each(function() {
		var $el = $(this);
		$el.tooltip().sliderFacade({
			label: '<b>' + $el.index() + '</b>'
		}).sliderFacade('disable');

		cache.pwms.devices.push({
			$element : $el
		});	
	});

	// Initialize dios
	cache.dios.$element = cache.$element.find('.dios form');
	cache.dios.$element.find('.dio-holder').each(function() {
		var $el = $(this).tooltip(),
			$button = $el.find('.digital-io');

		cache.dios.devices.push({
			$element : $el,
			$button : $button
		});
	});

	// Initialize relays
	cache.relays.$element = cache.$element.find('.relays form');
	cache.relays.$element.find('.relay-holder').each(function() {
		var $el = $(this).tooltip(),
			$button = $el.find('.relay');

		cache.relays.devices.push({
			$element : $el,
			$button : $button
		});
	});

	sim.events.on('requestWebDataUpdate', function(webData, enabled) {

		if(!cache.uiUpdated) return;
			
		cache.uiUpdated = false;
		
		// Send dio value to server
		_.forEach(webData.dio, function(dio, i) {
			dio.value = cache.dios.devices[i].$button.hasClass('btn-success');
		});
	});


	sim.events.on('serverDataUpdate', function(serverData, enabled) {

		// Hide the pwms if they aren't initialized. Update their values otherwise
		_.forEach(serverData.pwm, function(pwm, i) {
			// Only update if data has since changed
			var pwmData = _.pick(pwm, 'initialized', 'value');

			if(_.isEqual(cache.prevData.pwms[i], pwmData)) return;
			cache.prevData.pwms[i] = pwmData;

			// Update
			if(!pwmData.initialized) {
				cache.pwms.devices[i].$element.addClass('hide');
				return;
			}

			cache.pwms.devices[i].$element.removeClass('hide');
			cache.pwms.devices[i].$element.sliderFacade('setValue', pwmData.value);
		});
				
		// Hide DIOs if they aren't initialized
		_.forEach(serverData.dio, function(dio, i) {
			// Only update if data has since changed
			var dioData = _.pick(dio, 'initialized');

			if(_.isEqual(cache.prevData.dios[i], dioData)) return;
			cache.prevData.dios[i] = dioData;

			if(!dioData.initialized) {
				cache.dios.devices[i].$element.addClass('hide');
				return;
			}

			cache.dios.devices[i].$element.removeClass('hide');
		});

		// Hide the relays if they aren't initialized
		_.forEach(serverData.relay, function(relay, i) {
			// Only update if data has since changed
			var relayData = _.pick(relay, 'initialized', 'fwd', 'rev');
			
			if(_.isEqual(cache.prevData.relays[i], relayData)) return;
			cache.prevData.relays[i] = relayData;
			
			// Update
			if(!relayData.initialized) {
				cache.relays.devices[i].$element.addClass('hide');
				return;
			}
			
			cache.relays.devices[i].$element.removeClass('hide');
			setRelayValue(i, relayData.fwd, relayData.rev);
		});

	});

	function setRelayValue(index, fwd, rev) {

		var $relayBtn = cache.relays.devices[i].$button;
		
		if(fwd) {
			$relayBtn.addClass('btn-success');
			$relayBtn.removeClass('btn-danger');
			$relayBtn.removeClass('btn-default');
		} else if(rev) {
			$relayBtn.removeClass('btn-success');
			$relayBtn.addClass('btn-danger');
			$relayBtn.removeClass('btn-default');
		} else {
			$relayBtn.removeClass('btn-success');
			$relayBtn.removeClass('btn-danger');
			$relayBtn.addClass('btn-default');
		}
	};

	// Alert module that ui has been updated if fwd or rev limit switches have been pressed
	$('body').on('click', '.digital-module .btn.digital-io', function() {
		cache.uiUpdated = true;
	});

	//digital i/o, relay
	cache.$element.find('.digital-io').click(function(e) {
		e.preventDefault();
		$(this).toggleClass('btn-success');
		$(this).toggleClass('btn-danger');
	});


	// Add PWM, DIO, and Relay config
	sim.configHelpers.setBasicConfig('pwm', 'PWM', 20);
	sim.configHelpers.setBasicConfig('dio', 'Digital I/O', 26);
	sim.configHelpers.setBasicConfig('relay', 'Relay', 8);

	sim.events.on('configCategoryUpdated', 'pwm', function(config) {	
		if(config.visible == 'y') {
			cache.pwms.$element.removeClass('hidden');
		} else {
			cache.pwms.$element.addClass('hidden');
		}
		
		for(var i = 0; i < 20; i++) {
			var tooltip = config['pwm-' + i + '-tooltip'];
			cache.pwms.devices[i].$element.attr('data-original-title', tooltip);
		}
					
		hideDigitalIfEmpty();
	});

	sim.events.on('configCategoryUpdated', 'dio', function(config) {	
		if(config.visible == 'y') {
			cache.dios.$element.removeClass('hidden');
		} else {
			cache.dios.$element.addClass('hidden');
		}
		
		for(var i = 0; i < 26; i++) {
			var tooltip = config['dio-' + i + '-tooltip'];
			cache.dios.devices[i].$element.attr('data-original-title', tooltip);
		}
					
		hideDigitalIfEmpty();
	});

	sim.events.on('configCategoryUpdated', 'relay', function(config) {	
		if(config.visible == 'y') {
			cache.dios.$element.removeClass('hidden');
		} else {
			cache.dios.$element.addClass('hidden');
		}
		
		for(var i = 0; i < 8; i++) {
			var tooltip = config['relay-' + i + '-tooltip'];
			cache.relays.devices[i].$element.attr('data-original-title', tooltip);
		}
					
		hideDigitalIfEmpty();
	});

	function hideDigitalIfEmpty() {
		// Hide all if all are hidden
		if(cache.relays.$element.hasClass('hidden') &&
				cache.dios.$element.hasClass('hidden') &&
				cache.pwms.$element.hasClass('hidden') ) {
			
			cache.$element.addClass('hidden');
		} else {
			cache.$element.removeClass('hidden');
		}
	}

	cache.$element.appendTo('.websim-modules');


})(window.sim = window.sim || {});
