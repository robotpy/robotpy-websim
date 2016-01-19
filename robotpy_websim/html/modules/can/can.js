"use strict";

(function() {

	var cache = {
		$element : null,
		canDevices : {},
		canModeMap : {},
		$config : null,
		// Contains relevant data from the previous data from server.
		// Used to check if the hal_data has since changed.
		prevData : {
			can : {}
		},
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		uiUpdated : false
	};

	// Get the can mode map from the server
	$.getJSON('/api/can_mode_map', function(data) { cache.canModeMap = data; });

	// Render the module
	cache.$element = $(sim.templates.can.can);


	function addCan(index) {

		var $canDevice = $(sim.compileTemplate.handlebars(sim.templates.can['can-device'], {
			index : index
		})).appendTo(cache.$element);

		return cache.canDevices[index] = {
			$element : $canDevice,
			$slider : $canDevice.find('.slide-holder').sliderFacade().tooltip().sliderFacade('disable'),
			$mode : $canDevice.find('.can-mode'),
			$encoderValue : $canDevice.find('.encoder-value span'),
			$sensorValue : $canDevice.find('.sensor-value span'),
			$fwdLimitSwitch : $canDevice.find('input[name=for-limit-switch]'),
			$revLimitSwith : $canDevice.find('input[name=rev-limit-switch]')
		};
	}

	function getModeName(mode) {
		var modeName = cache.canModeMap[mode];
		return (modeName !== undefined) ? modeName : 'Unknown';
	}


	sim.events.on('serverDataUpdate', function(serverData, enabled) {

		_.forEach(serverData.CAN, function(can, i) {
			// Only update if data has since changed
			var canData = _.pick(can, 'value', 'mode_select', 'enc_position', 'sensor_position');
			
			if(_.isEqual(cache.prevData.can[i], canData)) return;
			cache.prevData.can[i] = canData;

			// Add CAN Device if it hasn't been added already
			var canDevice = cache.canDevices[i] ? cache.canDevices[i] : addCan(i);
	
			// Set value, mode, encode value, and S thingy value
			sim.animation.queue('canServerDataUpdate', function() {
				canDevice.$slider.sliderFacade('setValue', canData.value / 1024);	
				canDevice.$mode.text(getModeName(canData.mode_select));
				canDevice.$encoderValue.text(canData.enc_position);		
				canDevice.$sensorValue.text(canData.sensor_position);
			});
		});
	});


	sim.events.on('requestWebDataUpdate', function(webData, enabled) {
			
		if(!cache.uiUpdated) return;

		cache.uiUpdated = false;

		_.forEach(webData.CAN, function(can, i) {		
			// Add CAN Device if it hasn't been added already
			var canDevice = cache.canDevices[i] ? cache.canDevices[i] : addCan(i);
				
			// Set limit switches
			can.limit_switch_closed_rev = canDevice.$revLimitSwitch.prop('checked');
			can.limit_switch_closed_for = canDevice.$fwdLimitSwitch.prop('checked');
		});
	});

	// Alert module that ui has been updated if fwd or rev limit switches have been pressed
	$('body').on('click', '.can-module input[name=for-limit-switch], .can-module input[name=rev-limit-switch]', function() {
		cache.uiUpdated = true;
	});

	// Add CAN to config
	var defaults = {
		visible : 'y'
	};

	sim.config.setCategoryDefaults('can', defaults);

	// Add CAN to config modal
	cache.$config = $(sim.compileTemplate.handlebars(sim.templates.can.config, {
		visible : {
			label : 'Visible:',
			name : 'visible',
			inline : true,
			radios : [
				{ "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			]
		}
	}));

	sim.configModal.addCategory(cache.$config);
	
	// Populate inputs when config modal is opened
	sim.events.on('configModalCategoryShown', 'can', function() {
		var data = sim.config.getCategory('can');
		$cache.config.find('[name=visible]').prop('checked', data.visible == 'y');
	});

	// Update config data when modal is saved
	sim.events.on('configModalCategorySave', 'analog', function() {
		sim.config.updateCategory('can', {
			visible : $cache.config.find('[name=visible]').prop('checked')
		});
		applyConfig();
	});


	function applyConfig() {	
		sim.animation.queue('canApplyConfig', function() {
			var data = sim.config.getCategory('can');
			if(data.visible == 'y') {
				$cache.element.removeClass('hidden');
			} else {
				$cache.element.addClass('hidden');
			}
		});	
	}


	cache.$element.appendTo('.websim-modules');

})(window.sim = window.sim || {});
