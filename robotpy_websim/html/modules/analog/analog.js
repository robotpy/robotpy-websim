"use strict";

(function() {

	var $cache = {
		element : null,
		analogs : [],
		config : null
	};

	// Contains relevant data from the previous data from server.
	// Used to check if the hal_data has since changed.
	var prevData = {
		analogs : { }	
	};

	// True if user has recently interacted with the ui and the changes
	// haven't been sent to the server.
	var uiUpdated = false;

	// Render the module
	var template = sim.compileTemplate.handlebars(sim.templates.analog.analog, {
		analogs : _.range(8)
	});

	$cache.element = $(template);
	
	$cache.element.find('.analog-slider').each(function() {
		var $el = $(this);
		$el.sliderFacade({
			magnitude: 10,
			keyStep: 1,
			label: '<b>' + $el.index() + '</b> (<span class="analog-type"></span>)',
			setTextValue: function(element, value) {
				var $type = element.find('.analog-type');
					
				if($type && $type.text() == 'trigger') {
					return (value < 0) ? 'False' : 'True';
				}
				
				return value;
			},
		}).tooltip();

		var analog = {
			element : $el,
			type : $el.find('.analog-type'),
		};

		$cache.analogs.push(analog);
	});



	sim.events.on('serverDataUpdate', function(serverData, enabled) {

		_.forEach($cache.analogs, function($analog, i) {

			// Only update if data has since changed
			var analog = {
				input : _.pick(serverData.analog_in[i], 'initialized', 'value'),
				output : _.pick(serverData.analog_out[i], 'initialized', 'value'),
				trigger : _.pick(serverData.analog_trigger[i], 'initialized', 'trig_state')
			};

			if(_.isEqual(prevData.analogs[i], analog)) return;

			
			prevData.analogs[i] = analog;

			// Update the interface
			var analogType = null;
			

			if(analog.input.initialized)			
				analogType = 'input';
			else if(analog.output.initialized)
				analogType = 'output';			
			else if(analog.trigger.initialized)					
				analogType = 'trigger';

			sim.animation.queue('analogServerDataUpdate', function() {
				if(analogType === null) {
					$analog.element.addClass('hidden');
				} else {
					$anlaog.element.removeClass('hidden');
					$analog.type.text(analogType);
					
					if(analogType != 'input') {
						$analog.element.sliderFacade('setValue', analog.output.value);
					}
				}
			});

		});
	});


	sim.events.on('requestWebDataUpdate', function(webData, enabled) {
			
		if(!uiUpdated) return;

		uiUpdated = false;

		// Send analog input values to server	
		_.forEach($cache.analogs, function($analog, i) {
			if($analog.type.text() == 'input') {
				webData.analog_in[i].value = $analog.element.sliderFacade('getValue');
			}
		});
	});

	// Add analog to config
	sim.configHelpers.setBasicConfig('analog', 'Analog', 8);


	sim.events.on('configCategoryUpdated', 'analog', function(config) {	
		sim.animation.queue('analogApplyConfig', function() {
			if(config.visible == 'y') {
				$cache.element.removeClass('hidden');
			} else {
				$cache.element.addClass('hidden');
			}
			
			for(var i = 0; i < 8; i++) {
				var tooltip = config['analog-' + i + '-tooltip'];
				$cache.analogs[i].element.attr('data-original-title', tooltip);
			}	
		});	
	});

	$cache.element.appendTo('.websim-modules');

})(window.sim = window.sim || {});

/*

		
		
// Context menu
context_menu.add(iomodule, {
	config_key: 'analog',
	oncreate: function(menu, data) {
		menu.find('#hide-iomodule').on('click', function() {
			data.visible = 'n';
			iomodule.element.addClass('hidden');
			config.save_config();
		});
	}
});
		
*/
