"use strict";


(function() {

	var cache = {
		$element : null,
		$updateBtn : null,
		$dataTree : null,
		update : true,
		$config : null
	};

	// Render the module
	cache.$element = $(sim.templates['data-tree']['data-tree']);
	cache.$updateBtn = cache.$element.find('.update-btn');
	cache.$dataTree = cache.$element.find('.data-tree');

	// Update data tree
	cache.$updateBtn.on('click', function() {
		cache.update = true;
	});

	sim.events.on('serverDataUpdate', function(serverData, enabled) {
		if(cache.update) {
			cache.$dataTree.jsonTree({ 'data' : serverData });
			cache.update = false;
		}
	});

	// Add Data Tree to config
	sim.config.setCategoryDefaults('data-tree', {
		visible : 'y'
	});

	cache.$config = $(sim.compileTemplate.handlebars(sim.templates['data-tree'].config));
	sim.configModal.addCategory(cache.$config);

	// Update module when config is updated
	sim.events.on('configCategoryUpdated', 'data-tree', function(config) {	
		if(config.visible == 'y') {
			cache.$element.removeClass('hidden');
		} else {
			cache.$element.addClass('hidden');
		}			
	});

	cache.$element.appendTo('.websim-modules');

})(window.sim = window.sim || {});

