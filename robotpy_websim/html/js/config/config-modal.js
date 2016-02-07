
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
			sim.configInputs.setInputValues(category.inputs);
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
			sim.configInputs.getInputValues(category.inputs);
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