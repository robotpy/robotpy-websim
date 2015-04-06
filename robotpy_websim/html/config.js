var config_modal = new function() {
	
	this.element = $('#config-modal');
	this.categories_element = this.element.find('#config-categories');
	this.category_title_element = this.element.find('#config-active-category-form');
	this.category_form_element = this.element.find('#config-active-category-form');
	
	// Object that stores category data by id
	this.categories = {};
	
	// Adds a category to the modal
	this.add_category = function(id, title, config) {
		
		if(this.categories[id] !== undefined) 
			return;
		
		this.categories[id] = {
			'title' : title,
			'config' : config
		};
		
		// Add to the list of categories
		$('<li role="presentation"><a href="#" category-id="' + id + '">' + title + '</a></li>')
				.appendTo(this.categories_element);
	};
	
	// Sets the current active category
	this.set_active_category = function(id) {
		
		var category = this.categories[id];
		
		if(category === undefined) 
			return;
		
		// Deactivate currently active category
		this.categories_element.find('li').removeClass('active');
		
		// Activate current category
		this.categories_element.find('a[category-id=' + id + ']').parent().addClass('active');
		
		// Sets the content of the config modal
		//this.category_form_element.html(category.content);
		this.set_form_content(category.config);
	};
	
	
	
	// Gets the current active category
	this.get_active_category_id = function() {
		
		var active_category_id = null;
		
		this.categories_element.find('li').each(function() {
			
			var $element = $(this);
			
			if($element.hasClass('active')) {
				active_category_id = $element.find('a').attr('category-id');
			}
			
			
		});
		
		return active_category_id;
	};
	
	this.set_form_content = function(config) {
		
		this.category_form_element.html('');
		
		config = $.extend({
			type : 'text',
			label : 'Input',
			value : '',
			attr : {},
			rules : {},
			messages : {}
		}, config);
		
		for(var name in config) {
			
			if(_.contains(['text', 'email', 'password', 'range', 'color', 'number', 'date'], config[name].type)) {
				
				var $input_group = $( get_input_field(config[name].label, name) ).appendTo(this.category_form_element);
				var $input = $input_group.find('input');
				
				$input
					.attr('type', config[name].type)
					.attr('value', config[name].value);
				
				for(var attr in config[name].attr) {
					$input.attr(attr, config[name].attr[attr]);
				}
				
				this.category_form_element.validate();
				$input.rules("remove");
				
				var rules = config[name].rules;
				rules.messages = config[name].messages;
				$input.rules("add", rules);
				
			}
		}
		
	};
	
	function get_input_field(label, name) {
		var html = '<div class="form-group">';
		html += '<label for="' + name + '" class="col-sm-2 control-label">' + label + '</label>';
		html += '<div class="col-sm-10">';
		html += '<input class="form-control" id="' + name + '" name="' + name + '">';
		html += '</div>';
		html += '</div>';
		return html;
	}
};

$(function() {
	// When a category is selected make it the active category
	config_modal.categories_element.on('click', 'a', function() {
		var category_id = $(this).attr('category-id');
		config_modal.set_active_category(category_id);
	});
});

$.validator.setDefaults({ 
	errorPlacement: function(error, element) {
        $(error).addClass('label label-danger error');
        $(error).insertBefore(element);
    },
    errorElement: 'div'
});