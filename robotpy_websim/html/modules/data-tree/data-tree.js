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
	sim.config.setCategoryDefaults('can', {
		visible : 'y'
	});

	// Add Data Tree to config modal
	cache.$config = $(sim.compileTemplate.handlebars(sim.templates['data-tree'].config, {
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
	sim.events.on('configModalCategoryShown', 'data-tree', function() {
		var data = sim.config.getCategory('data-tree');
		cache.$config.find('[name=visible]').prop('checked', data.visible == 'y');
	});

	// Update config data when modal is saved
	sim.events.on('configModalCategorySave', 'data-tree', function() {
		sim.config.updateCategory('data-tree', {
			visible : cache.$config.find('[name=visible]').prop('checked')
		});
		applyConfig();
	});

	function applyConfig() {	
		sim.animation.queue('dataTreeApplyConfig', function() {
			var data = sim.config.getCategory('data-tree');
			if(data.visible == 'y') {
				cache.$element.removeClass('hidden');
			} else {
				cache.$element.addClass('hidden');
			}	
		});			
	}

	cache.$element.appendTo('.websim-modules');

})(window.sim = window.sim || {});

