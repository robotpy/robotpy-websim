
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
