/*
 *	Config and Templates
 */
(function(sim) {

	function SimConfig(url) {
		this.config = {};
		this.url = url;
	}

	SimConfig.prototype.updateCategory = function(category, data) {
		console.log(category, data);
		this.config[category] || (this.config[category] = {});
		$.extend(true, this.config[category], data);
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

	sim.config = new SimConfig('/api/config/save');
	sim.userConfig = new SimConfig('/api/user_config/save');
	sim.templates = {};

	// Loads config files and module templates
	sim.getConfigAndModules = function() {
		return Q($.getJSON('/api/modules_and_config')).then(function(data) {

			// Update config categories
			_.forEach(data.config, function(categoryData, categoryName) {
				sim.config.updateCategory(categoryName, categoryData);
			});
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
		modal : $('#config-modal'),
		openBtn : null,
		closeBtn : $('#config-modal .modal-footer .close-btn'),
		xBtn : $('#config-modal .modal-header .x-btn'),
		saveBtn : $('#config-modal .modal-footer .save-btn'),
		categoryTabs : $('#config-modal .config-categories'),
		categories : {},
		form : $('#config-modal .config-form')
	};

	function getCurrentCategoryId() {
		return $cache.categoryTabs.find('li.active');
	}

	function changeCategory($el) {
		$cache.categoryTabs.find('li').removeClass('active');
		$cache.modal.find('.category').remove('active');
		var categoryId = $el.data('category-id');
		$el.addClass('active');
		$cache.categories[categoryId].addClass('active');
	}

	// Modal Events
	$cache.modal.on('hidden.bs.modal', function(e) {
		$cache.modal.trigger('modalClose');
	});

	$cache.modal.on('show.bs.modal', function(e) {
		$cache.modal.trigger('modalOpen');
	});

	$cache.categoryTabs.on('click', 'li', function(e) {
		var $el = $(this);
		changeCategory($el);
		var categoryId = $el.data('category-id');
		var $category = $cache.categories[categoryId];
		$cache.modal.trigger('categoryChange', [categoryId, $category]);
	});

	$cache.saveBtn.on('click', function(e) {
		_.forEach($cache.categories, function(category, categoryName) {
			sim.events.trigger('configModalSave', categoryName, [category.inputs]);
		});
		sim.config.save();
		sim.userConfig.save();
		$cache.modal.trigger('save');
	});

	sim.configModal = {
		$el: $cache.modal,
		$categories : $cache.categories,
		addCategory : function($category) {
			var categoryId = $category.data('category-id');
			if(categoryId in $cache.categories) {
				return false;
			}
			$cache.categories[categoryId] = {
				tab : $('<li data-category-id="' + categoryId + '"></li>').appendTo($cache.categoryTabs),
				inputs : $category.appendTo($cache.form)
			};
		},
		removeCategory : function(categoryId) {
			if(categoryId in $cache.categories) {
				$cache.modal.find('[data-category-id]').remove();
				delete $cache.categories[categoryId];
			}
		}
	};

})(window.sim = window.sim || {});
