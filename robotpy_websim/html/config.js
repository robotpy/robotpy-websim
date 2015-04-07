var config_modal = new function() {
	
	this.element = $('#config-modal');
	this.categories_element = this.element.find('#config-categories');
	this.category_form_element = this.element.find('#config-active-category-form');
	
	// Object that stores category data by id
	this.categories = {};
	
	this.show = function() {
		var current_category_id = this.get_active_category_id();
		this.set_active_category(current_category_id);
		this.element.modal('show');
	};
	
	this.hide = function() {
		this.element.modal('hide');
	};
	
	// Adds a category to the modal
	this.add_category = function(id, title, form) {
		
		if(this.categories[id] !== undefined) 
			return;
		
		this.categories[id] = {
			'title' : title,
			'form' : form
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
		this.set_form_content(id);
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
	
	this.set_form_content = function(category_id) {
		
		// Make sure the category exists
		var category = this.categories[category_id];
		
		if(category === undefined)
			return;
		
		// Reset the content in form
		this.category_form_element.html('');
		
		// Add each form item
		var form = category.form;	
		this.category_form_element.validate();
		
		for(var name in form) {
			
			var input = form[name];
			
			switch(input.type) {
			
				case 'input':
							
					if(sim.config[category_id] !== undefined && sim.config[category_id][name] !== undefined) {
						input.attr.value = sim.config[category_id][name];
					}
					
					var $input_group = $( get_input_field(input.label, name) ).appendTo(this.category_form_element);
					var $input = $input_group.find('input');
					
					for(var attr in input.attr) {
						$input.attr(attr, input.attr[attr]);
					}
					
					$input.rules("remove");
					
					var rules = input.rules;
					rules.messages = input.messages;
					$input.rules("add", rules);
					
					
					break;
					
				case 'checkbox-group':
					
					if(sim.config[category_id] !== undefined && sim.config[category_id][name] !== undefined) {
						
						var values = sim.config[category_id][name];
						
						for(var i = 0; i < input.checkboxes.length && i < values.length; i++) {
							input.checkboxes[i].checked = values[i];
						}
						
					}
					
					var $inputs = $( get_checkbox_group(input.label, name, input.inline, input.checkboxes) )
							.appendTo(this.category_form_element);
					
					this.category_form_element.find('input[name=' + name + ']').rules("remove");
					
					var rules = input.rules;
					rules.messages = input.messages;
					this.category_form_element.find('input[name=' + name + ']').rules("add", rules);
					
					break;
			}
		}
		
	};
	
	this.update_config = function() {
		
		var category_id = this.get_active_category_id();
		var category = this.categories[category_id];
		
		if(category === undefined) 
			return;
		
		var config = {};
		
		for(var name in category.form) {
			
			var input = category.form[name];
			
			switch(input.type) {
			
				case 'input':
					config[name] = this.category_form_element.find('#' + name).val();
					break;
					
					
				case 'checkbox-group':
					
					var values = [];
					
					this.category_form_element.find('input[name=' + name + ']').each(function() {
						values.push($(this).prop('checked'));
					});
					
					config[name] = values;
					
					break;
			
			}

		}
		
		sim.config[category_id] = config;
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
	
	function get_checkbox_group(label, name, inline, checkboxes) {

		var html = '<label for="' + name + '">' + label + '</label><br />';
		
		if(!inline) {
			for(var i = 0; i < checkboxes.length; i++) {
				var checked = checkboxes[i].checked ? 'checked="checked"' : '';
				html += '<div class="checkbox">';
				html +=		'<label>';
				html +=			'<input type="checkbox" name="' + name + '" value="' + checkboxes[i].value + '" ' + checked + '>';
				html +=			checkboxes[i].label;
				html +=		'</label>';
				html +=	'</div>';
			}
		} else {
			for(var i = 0; i < checkboxes.length; i++) {
				var checked = checkboxes[i].checked ? 'checked="checked"' : '';
				html += '<label class="checkbox-inline">';
				html +=		'<input type="checkbox" name="' + name + '" value="' + checkboxes[i].value + '" ' + checked + '>';
				html +=		checkboxes[i].label;
				html +=	'</label>';
			}
		}
		
		return html;
	};
};

$(function() {
	// When a category is selected make it the active category
	config_modal.categories_element.on('click', 'a', function() {
		var category_id = $(this).attr('category-id');
		config_modal.set_active_category(category_id);
	});
	
	// Open the config modal
	$('#open-config-modal-btn').click(function() {
		config_modal.show();
	});
	
	// Hide the config modal
	$('#config-modal-ok-btn').click(function() {
		if(!config_modal.category_form_element.valid()) {
			config_modal.category_form_element.submit();
		} else {
			config_modal.update_config();
			sim.save_config();
			config_modal.hide();
		}
	});
	
});

$.validator.setDefaults({ 
	errorPlacement: function(error, element) {
        $(error).addClass('label label-danger error');
        $(error).insertBefore(element);
    },
    errorElement: 'div'
});