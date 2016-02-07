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
		sim.events.trigger(this.id + 'CategoryUpdated', category, [this.config[category], category]);
	};

	SimConfig.prototype.updateCategory = function(category, data) {
		this.config[category] || (this.config[category] = {});
		$.extend(true, this.config[category], data);
		sim.events.trigger(this.id + 'CategoryUpdated', category, [this.config[category], category]);
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