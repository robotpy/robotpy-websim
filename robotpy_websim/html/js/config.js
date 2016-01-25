"use strict";


/*
 *	Config and Templates
 */
(function(sim) {

	function SimConfig(id, url) {
		this.config = {};
		this.id = id;
		this.url = url;
	}

	SimConfig.prototype.setCategoryDefaults = function(category, data) {
		this.config[category] || (this.config[category] = {});
		this.config[category] = $.extend(true, data, this.config[category]);
		sim.events.trigger(this.id + 'CategoryUpdated', category, [this.config[category]]);
	};

	SimConfig.prototype.updateCategory = function(category, data) {
		this.config[category] || (this.config[category] = {});
		$.extend(true, this.config[category], data);
		sim.events.trigger(this.id + 'CategoryUpdated', category, [this.config[category]]);
	};

	SimConfig.prototype.getCategory = function(category) {
		this.config[category] || (this.config[category] = {});
		return this.config[category];
	};

	SimConfig.prototype.getCategoryNames = function() {
		return Object.keys(this.config);
	};

	SimConfig.prototype.save = function() {
		var url = this.url,
			config = this.config;

		$.ajax({
			type: 'POST',
			url: url,
			data: {
				'config' : JSON.stringify(config)
			}
		});
	};

	sim.config = new SimConfig('config', '/api/config/save');
	sim.userConfig = new SimConfig('userConfig', '/api/user_config/save');

	// Loads config files and module templates
	sim.getConfigAndModules = function() {
		return Q($.getJSON('/api/modules_and_config')).then(function(data) {
			// Update config 
			console.log('updating categories');
			_.forEach(data.config, function(categoryData, categoryName) {
				sim.config.updateCategory(categoryName, categoryData);
			});
			console.log('updating updating categories');
			// Update user config categories
			_.forEach(data.user_config, function(categoryData, categoryName) {
				sim.userConfig.updateCategory(categoryName, categoryData);
			});
			// load template js, css, and templates
			_.forEach(data.modules, function(moduleData, moduleName) {
				var css = moduleData.css,
					js = moduleData.js,
					templates = moduleData.templates;

				sim.templates[moduleName] = templates;
				
				css.forEach(function(fileName) {
					$('<link rel="stylesheet" href="' + fileName + '">').appendTo('head');
				});

				js.forEach(function(fileName) {
					$('<script src="' + fileName + '"></script>').appendTo('body');
				});

			});
		});
	};

})(window.sim = window.sim || {});

/*
 *	Config Modal
 */
(function(sim) {


	var $cache = {
		modal : $('.config-modal'),
		openBtn : null,
		closeBtn : $('.config-modal .modal-footer .close-btn'),
		xBtn : $('.config-modal .modal-header .x-btn'),
		saveBtn : $('.config-modal .modal-footer .save-btn'),
		categoryTabs : $('.config-modal .config-categories'),
		categories : {},
		form : $('.config-modal .config-form')
	};

	function getCurrentCategoryId() {
		return $cache.categoryTabs.find('li.active').data('category-id');
	}

	function changeCategory(categoryId) {
		// Make current category not active
		var currentCatId = getCurrentCategoryId();
		if(currentCatId) {
			$cache.categories[currentCatId].tab.removeClass('active');
			$cache.categories[currentCatId].inputs.removeClass('active');
		}
		// Set new active category
		$cache.categories[categoryId].tab.addClass('active');
		$cache.categories[categoryId].inputs.addClass('active');
	}

	// Modal Events
	$cache.modal.on('hidden.bs.modal', function(e) {
		sim.events.trigger('configModalHidden');
	});

	$cache.modal.on('show.bs.modal', function(e) {
		var firstCategory = $cache.categoryTabs.find('li:first-of-type');
		if(firstCategory.length > 0) {
			changeCategory(firstCategory.data('category-id'));
		}
		sim.events.trigger('configModalShown');

		_.forEach($cache.categories, function(category, categoryName) {
			sim.events.trigger('configModalCategoryShown', categoryName, [category.inputs]);
		});
	});

	$cache.categoryTabs.on('click', 'li', function(e) {
		var $el = $(this);
		var categoryId = $el.data('category-id');
		changeCategory(categoryId);
		var $category = $cache.categories[categoryId];
		sim.events.trigger('configModalCategoryChange', [categoryId, $category]);
	});

	$cache.saveBtn.on('click', function(e) {

		sim.events.trigger('configModalSave');
		_.forEach($cache.categories, function(category, categoryName) {
			sim.events.trigger('configModalCategorySave', categoryName, [category.inputs]);
		});
		sim.config.save();
		sim.userConfig.save();
		$cache.modal.trigger('save');
		sim.configModal.hide();
	});

	sim.configModal = {
		$el: $cache.modal,
		$categories : $cache.categories,
		addCategory : function($category) {

			$category = _.isString($category) ? $($category) : $category;

			var categoryId = $category.data('category-id');
			if(categoryId in $cache.categories) {
				return false;
			}
			var title = $category.data('category-title') ? $category.data('category-title') : _.startCase(categoryId);
			$cache.categories[categoryId] = {
				tab : $('<li role="presentation" data-category-id="' + categoryId + '"><a href="#">' + title + '</a></li>').appendTo($cache.categoryTabs),
				inputs : $category.appendTo($cache.form)
			};
		},
		removeCategory : function(categoryId) {
			if(categoryId in $cache.categories) {
				$cache.modal.find('[data-category-id]').remove();
				delete $cache.categories[categoryId];
			}
		},
		show : function() {
			this.$el.modal('show');
		},
		hide : function() {
			this.$el.modal('hide');
		}
	};

})(window.sim = window.sim || {});


/*
 *	Config helper functions
 */
(function(sim) {

	function setBasicCategoryDefaults(categoryId, deviceCount) {
		// Add analog to config
		var defaults = {
			visible : 'y'
		};

		for(var i = 0; i < 8; i++) {
			defaults[categoryId + '-' + i + '-tooltip'] = '';
		}

		sim.config.setCategoryDefaults(categoryId, defaults);
	}

	function getBasicConfigInputs(categoryId, categoryTitle, deviceCount) {
		// Add analog to config modal
		var configTemplateData = {
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

		for(var i = 0; i < deviceCount; i++) {
			configTemplateData.tooltips.push({
				name : 'tooltip-' + i,
				label : categoryTitle + ' ' + i + ' Tooltip:'
			});
		}

		var templateHtml = '{{configRadioGroup visible}}' +
						   '{{#each tooltips as |tooltip index|}}' +
						      '{{configInput tooltip}}' +
						   '{{/each}}';

		return sim.compileTemplate.handlebars(templateHtml, configTemplateData);
	}

	function populateBasicConfigInputs(categoryId, deviceCount) {
		// Populate inputs when config modal is opened
		sim.events.on('configModalCategoryShown', categoryId, function($inputs) {

			var data = sim.config.getCategory(categoryId);
		
			$inputs.find('[name=visible]').prop('checked', data.visible == 'y');
					
			for(var i = 0; i < deviceCount; i++) {
				var name = categoryId + '-' + i + '-tooltip';
				$inputs.find('[name=' + name + ']').val(data[name]);
			}
		});
	}

	function updateBasicConfig(categoryId, deviceCount) {
		// Update config data when modal is saved
		sim.events.on('configModalCategorySave', categoryId, function($inputs) {

			var data = {
				visible : $inputs.find('[name=visible]').prop('checked')
			};

			for(var i = 0; i < deviceCount; i++) {
				var name = categoryId + '-' + i + '-tooltip';
				data[name] = $inputs.find('input[name=' + name + ']').val();
			}

			sim.config.updateCategory(categoryId, data);
		});
	}

	function setBasicConfig(categoryId, categoryTitle, deviceCount) {
		setBasicCategoryDefaults(categoryId, deviceCount);
		sim.configModal.addCategory($(
			'<div data-category-id="' + categoryId + '" data-category-title="' + categoryTitle + '">' +
				getBasicConfigInputs(categoryId, categoryTitle, deviceCount) +
			'</div>'
		));
		populateBasicConfigInputs(categoryId, deviceCount);
		updateBasicConfig(categoryId, deviceCount);
	}

	sim.configHelpers = {
		setBasicCategoryDefaults : setBasicCategoryDefaults,
		getBasicConfigInputs : getBasicConfigInputs,
		populateBasicConfigInputs : populateBasicConfigInputs,
		updateBasicConfig : updateBasicConfig,
		setBasicConfig : setBasicConfig
	};




})(window.sim = window.sim || {});
