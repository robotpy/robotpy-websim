/*
 *	Save conifg
 */
(function(sim) {

	sim.config = {
		data : window.config,
		save : function() {
			$.ajax({
				type: 'POST',
				url: '/api/config/save',
				data: {
					'config' : JSON.stringify(this.data)
				}
			});
		}
	};

	sim.userConfig = {
		data : window.userConfig,
		save : function() {
			$.ajax({
				type: 'POST',
				url: '/api/user_config/save',
				data: {
					'config' : JSON.stringify(this.data)
				}
			});
		}
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
		$cache.categories.forEach(function(category) {
			sim.events.trigger('configModalSave', category, [category.inputs]);
		});
		sim.config.saveConfig();
		sim.config.saveUserConfig();
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
