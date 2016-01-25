

(function() {

	var cache = {
		$element : null,
		joysticks : [],
		// True if user has recently interacted with the ui and the changes
		// haven't been sent to the server.
		uiUpdated : false,
		config : {
			$element : null,
			$chooser : null,
			$joysticks : null
		}
	};


	// Render the module
	var joystickHtml = sim.compileTemplate.handlebars(sim.templates.joysticks.joystick, {
		axis : ['x', 'y', 'z', 't'],
		buttons : _.range(1, 13)
	});
	cache.$element = $(sim.compileTemplate.handlebars(sim.templates.joysticks.joysticks, {
		joystickHtml : joystickHtml,
		joysticks : _.range(0, 6)
	}));

	// Cache and initialize the joysticks
	cache.$element.find('.joystick').each(function() {
		var joystick = {
			$element : $(this),
			axis : [],
			buttons : []
		};

		joystick.$element.find('.slide-holder').each(function() {
			var $axis = $(this),
				axisName = $axis.data('axis');

			$axis.tooltip().sliderFacade({
				label: '<b>' + _.capitalize(axisName) + ' </b>',
				onChange: function() {
					module.ui_updated = true;
				}
			});

			joystick.axis.push({
				$element : $axis,
				axisName : axisName
			});
		});

		joystick.$element.find('.joystick-btn-container').each(function() {
			var $holder = $(this),
				$btn = $holder.find('.joystick-btn');

			joystick.buttons.push({
				$element : $btn,
				$holder : $holder
			});
		});

		cache.joysticks.push(joystick);
	});

	sim.events.on('requestWebDataUpdate', function(webData, enabled) {

		if(!cache.uiUpdated) return;

		cache.uiUpdated = false;

		_.forEach(webData.joysticks, function(joystick, i) {
			for(var a = 0; a < 4; a++) {
				joystick.axes[a] = cache.joysticks[i].axis[a].$element.sliderFacade('getValue');
			}
			
			for(var b = 0; b < 12; b++) {
				joystick.buttons[b] = cache.joysticks[i].buttons[b].$element.prop('checked');ki
			}
		});
	});

	// Alert module that ui has been updated if fwd or rev limit switches have been pressed
	$('body').on('click', '.joystick-module input[type=checkbox]', function() {
		cache.uiUpdated = true;
	});

	// Add config
	var defaults = {
		joysticks : []
	};


	for(var i = 0; i < 6; i++) {
		var joystick = {
			visible : true,
			tooltips : {}
		};

		_.forEach(['x', 'y', 'z', 't'], function(axis, i) {
			joystick.tooltips[axis + '-axis'] = '';
		});

		_.forEach(_.range(1, 13), function(button, i) {
			joystick.tooltips['btn-' + button + '-tooltip'] = '';
		});

		defaults.joysticks.push(joystick);
	}

	sim.config.setCategoryDefaults('joystick', defaults);

	// Add joystick to config modal
	var configData = {
		joystickChooser : {
			id : 'joystick-chooser',
			options : {
				'0' : 'Joystick 0', '1' : 'Joystick 1', '2' : 'Joystick 2', 
				'3' : 'Joystick 3', '4' : 'Joystick 4', '5' : 'Joystick 5'
			}
		},
		joysticks : []
	}

	for(var i = 0; i < 6; i++) {
		var joystick = {
			visible : {
				label : 'Visible:',
				name : 'visible',
				inline : true,
				radios : [
					{ "label" : "Yes", "value" : "y" },
		            { "label" : "No", "value" : "n" }
				]
			},
			tooltips : []
		};

		_.forEach(['x', 'y', 'z', 't'], function(axis, i) {
			joystick.tooltips.push({
				name : 'tooltip-' + axis  + '-axis',
				label : axis + '-Axis Tooltip:'
			});
		});
		
		_.forEach(_.range(1, 13), function(button, i) {
			joystick.tooltips.push({
				name : 'tooltip-' + button  + '-button',
				label : 'Button ' + i + ' Tooltip:'
			});
			joystick.tooltips['btn-' + button + '-tooltip'] = 'Button ' + i + ' Tooltip:';
		});

		configData.joysticks.push(joystick);
	}
	
	cache.config.$element = $(sim.compileTemplate.handlebars(sim.templates.joysticks.config, configData));
	cache.config.$chooser = cache.config.$element.find('#joystick-chooser');
	cache.config.$joysticks = cache.config.$element.find('[data-joystick]');
	sim.configModal.addCategory(cache.config.$element);

	cache.config.$chooser.on('change', function() {
		var $el = $(this),
			joystickNum = $el.val();

		cache.config.$joysticks.removeClass('selected-joystick');
		cache.config.$element.find('[data-joystick=' + joystickNum + ']').addClass('selected-joystick');
	});

	sim.events.on('configCategoryUpdated', 'joystick', function(config) {
		sim.animation.queue('joystickApplyConfig', function() {	
			_.forEach(config.joysticks, function(joystickConfig, i) {
				if(joystickConfig.visible == 'y') {
					$cache.joysticks[i].$element.removeClass('hidden');
				} else {
					$cache.joysticks[i].$element.addClass('hidden');
				}

				_.forEach(['x', 'y', 'z', 't'], function(axis, i) {
					var tooltip = joystickConfig.tooltips[axis + '-axis'];
					cache.joysticks.axis[i].$element.attr('data-original-title', tooltip);
				});
				
				_.forEach(_.range(1, 13), function(button, i) {
					var tooltip = joystickConfig.tooltips['btn-' + button + '-tooltip'];
					cache.joysticks.buttons[i].$element.attr('data-original-title', tooltip);
				});

			});
		});
	});

	cache.$element.appendTo('.websim-modules');


})(window.sim = window.sim || {});
