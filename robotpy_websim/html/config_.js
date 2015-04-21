//"use strict";

var config_modal = new function() {
	
	this.element = $('#config-modal');
	this.categories_element = this.element.find('#config-categories');
	this.category_form_element = this.element.find('#config-active-category-form');
	
	// Each category has a list of functions that are called when they are updated
	var on_update_listeners = {};
	
	var temp_config = null;
	
	// Object that stores category data by id
	this.categories = {};
	
	this.show = function() {
		temp_config = $.extend(true, {}, sim.config);
		var current_category_id = this.get_active_category_id();
		this.set_active_category(current_category_id);
		this.element.modal('show');
	};
	
	this.hide = function() {
		this.element.modal('hide');
	};
	
	this.save_config = function() {
		update_config();
		sim.config = temp_config;
		sim.save_config();
		
		for(var category in this.categories) {
			this.notify_listeners(category);
		}
	};
	
	// Adds a category to the modal
	this.add_category = function(id, title, form, elements) {
		
		if(temp_config === null) {
			temp_config = $.extend(true, {}, sim.config);
		}
		
		if(this.categories[id] !== undefined) 
			return;
		
		this.categories[id] = {
			'title' : title,
			'form' : form,
			'elements' : (elements !== undefined) ? elements : 1
		};
		
		// Add to the list of categories
		$('<li role="presentation"><a href="#" category-id="' + id + '">' + title + '</a></li>')
				.appendTo(this.categories_element);
		
		// Makes it so you can add listeners
		on_update_listeners[id] = [];
		
		// Make sure config is in the right format
		format_config(id);
	};
	
	// Adds a listener that is notified when a specific category is updated
	this.add_update_listener = function(id, update_immediately, listener) {
		
		if(_.isFunction(listener) === false || on_update_listeners[id] === undefined) {
			return;
		}
		
		on_update_listeners[id].push(listener);
		
		if(update_immediately) {
			listener(sim.config[id].elements, id);
		}
		
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
		create_form(id);
		
		// Populates the form fields
		populate_form_fields();
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
	
	// Notifies a category's on update listeners that updates have been made
	this.notify_listeners = function(category_id) {
		
		var listeners = on_update_listeners[category_id];
		for(var i = 0; i < listeners.length; i++) {
			listeners[i](sim.config[category_id].elements, category_id);
		}
	};
	
	// Gets the current element number from the category
	this.get_current_category_element = function() {
		var active_category_id = this.get_active_category_id();
		
		if(active_category_id === null)
			return null;
		
		var category = this.categories[active_category_id];
		
		// Get element 0 if there is only 1
		if(category.elements <= 1) {
			return 0;
		}
		
		// Otherwise get the element from the current select option
		var $select = this.category_form_element.find('#category-elements');
		
		if($select) {
			return $select.val();
		}
		
		return 0;
	}
	
	function create_form(category_id) {
		
		// Make sure the category exists
		var category = config_modal.categories[category_id];
		
		if(category === undefined)
			return;
		
		// Reset the content in form
		config_modal.category_form_element.html('');
		
		// Add each form item
		var form = category.form;	
		config_modal.category_form_element.validate();
		
		// Add select if there are multiple elements
		if(category.elements > 1) {
			var $select = $(get_select(category.title, category.elements)).appendTo(config_modal.category_form_element);
		}
		
		for(var name in form) {
			
			var input = form[name];
			
			switch(input.type) {
			
				case 'input':
							
					var $input_group = $( get_input_field(input.label, name) ).appendTo(config_modal.category_form_element);
					var $input = $input_group.find('input');
					
					for(var attr in input.attr) {
						//$input.attr(attr, input.attr[attr]);
					}
					
					$input.rules("remove");
					
					var rules = input.rules;
					rules.messages = input.messages;
					$input.rules("add", rules);
					
					
					break;
					
				case 'checkbox-group':
					
					var $inputs = $( get_checkbox_group(input.label, name, input.inline, input.checkboxes) )
							.appendTo(config_modal.category_form_element);
					
					config_modal.category_form_element.find('input[name=' + name + ']').rules("remove");
					
					var rules = input.rules;
					rules.messages = input.messages;
					config_modal.category_form_element.find('input[name=' + name + ']').rules("add", rules);
					
					break;
					
				case 'radio-group':
					
					var $inputs = $( get_radio_group(input.label, name, input.value, input.inline, input.radios) )
							.appendTo(config_modal.category_form_element);
					
					config_modal.category_form_element.find('input[name=' + name + ']').rules("remove");
					
					var rules = input.rules;
					rules.messages = input.messages;
					config_modal.category_form_element.find('input[name=' + name + ']').rules("add", rules);
					
					break;
			}
		}
		
	};
	
	// Sets the config object in the websim based on the input values in the config modal
	function update_config() {
		
		var category_id = config_modal.get_active_category_id();
		var category = config_modal.categories[category_id];
		
		if(category === undefined) 
			return;
		
		var config = {};
		
		for(var name in category.form) {
			
			var input = category.form[name];
			
			switch(input.type) {
			
				case 'input':
					config[name] = config_modal.category_form_element.find('#' + name).val();
					break;
					
					
				case 'checkbox-group':
					
					var values = {};
					
					config_modal.category_form_element.find('input[name=' + name + ']').each(function() {
						values[$(this).val()] = ($(this).prop('checked'));
					});
					
					config[name] = values;
					
					break;
					
				case 'radio-group':
					
					config[name] = config_modal.category_form_element.find('input[name=' + name + ']:checked').val();
					break;
			
			}

		}
		
		// Get the current element number
		var element = config_modal.get_current_category_element();
		
		if(element === null)
			return;
		
		temp_config[category_id].elements[element] = config;
	};
	
	function get_select(title, elements) {
		var html = '';
		html += '<div class="row" style="padding-bottom: 15px;">';
		html += '<div class="col-sm-5">';
		html += '<select id="category-elements" class="form-control">';
		for(var i = 0; i < elements; i++) {
			html += '<option value="' + i + '" style="font-weight: bold">' + title + ' ' + i + '</option>';
		}
		html += '</select>';
		html += '</div>';
		html += '</div>';

		return html;
	}
	
	
	// Returns the html for a single input
	function get_input_field(label, name) {
		
		var html = '<div class="single-line-input">';
		html += '<label for="' + name + '">' + label + '</label>';
		html += '<span>';
		html += '<input class="form-control" id="' + name + '" name="' + name + '">';
		html += '</span>';
		//html += '</div>';
		return html;
	}
	
	// Returns the html for a group of checkbox inputs
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
	
	// Returns the html for a group of radio button inputs
	function get_radio_group(label, name, value, inline, radios) {

		var html = '<label for="' + name + '" style="margin-right: 10px;">' + label + '</label>';
		
		if(!inline) {
			html += '<br />';
			for(var i = 0; i < radios.length; i++) {
				var checked = radios[i].value === value ? 'checked="checked"' : '';
				html += '<div class="radio">';
				html +=		'<label>';
				html +=			'<input type="radio" name="' + name + '" value="' + radios[i].value + '" ' + checked + '>';
				html +=			radios[i].label;
				html +=		'</label>';
				html +=	'</div>';
			}
		} else {
			for(var i = 0; i < radios.length; i++) {
				var checked = radios[i].value === value ? 'checked="checked"' : '';
				html += '<label class="radio-inline" style="padding-top: 0px;">';
				html +=		'<input type="radio" name="' + name + '" value="' + radios[i].value + '" ' + checked + '>';
				html +=		radios[i].label;
				html +=	'</label>';
			}
		}
		
		return html;
	};
	
	// Populates the form fields with the correct values
	function populate_form_fields() {
		
		var category_id = config_modal.get_active_category_id();
		var category = config_modal.categories[category_id];
		
		if(category === undefined) {
			return;
		}
		
		//Set the data
		var cat_data = temp_config[category_id];
		
		if (cat_data === undefined)
			
			return;
		
		var elements = cat_data.elements;
		
		if(elements === undefined) {
			return;
		}

		
		var data = elements[config_modal.get_current_category_element()];
		
		if(data === undefined)
			return;
		
		for(var name in data) {
			
			switch(config_modal.categories[category_id].form[name].type) {
			
				case 'input':
					
					var $input = config_modal.category_form_element.find('input[name=' + name + ']')
							.val(data[name]);
					
					break;
					
				case 'checkbox-group':
					
					var $checkboxes = config_modal.category_form_element.find('input[name=' + name + ']');
					
					for(var i = 0; i < data[name].length; i++) {
						if(data[name][i]) {
							var $checkbox = $( $checkboxes[i] );
							$checkbox.prop('checked', true);
						}
					}
					
					break;
					
				case 'radio-group':
					
					config_modal.category_form_element.find('input[name=' + name + '][value=' + data[name] + ']')
							.prop('checked', true);
					
					break;
			}
		}
		
	}
	
	// Make sure the config object is in the right format
	function format_config(category_id) {
		
		// Get the category. If the category doesn't exist in the form return null
		var category = config_modal.categories[category_id];
		
		if(category === undefined)
			return;
		
		// Initialize the config if it doesn't exist
		if(sim.config[category_id] === undefined) {
			sim.config[category_id] = {};
		}
		
		// Initialize elements if they don't exist
		if(sim.config[category_id].elements === undefined) {
			sim.config[category_id].elements = {};
		}
		
		// Set each element in the config
		for(var i = 0; i < category.elements; i++) {
			
			// Initialize the element if it doesn't exist
			if(sim.config[category_id].elements[i] === undefined) {
				sim.config[category_id].elements[i] = {};
			}
			
			// Set each form item in the element
			for(var name in category.form) {
				
				switch(category.form[name].type) {
				
					case 'input':
						
						// If it already has a value just continue
						if(sim.config[category_id].elements[i][name] !== undefined)
							continue;
						
						// Otherwise set a value
						var value = category.form[name].attr.value;
						sim.config[category_id].elements[i][name] = value;
						
						break;
						
					case 'checkbox-group':
						
						// If it isn't an array initialize
						if( _.isObject(sim.config[category_id].elements[i][name]) === false)
							sim.config[category_id].elements[i][name] = {};
						
						// go through each checkbox
						for(var j = 0; j < category.form[name].checkboxes.length; j++) {
							
							// Initialize the element exists just continue
							var checkbox_value = category.form[name].checkboxes[j].value;
							
							if(sim.config[category_id].elements[i][name][checkbox_value] !== undefined)
								continue;
							
							// Otherwise set a value
							var checked = category.form[name].checkboxes[j].checked;
							sim.config[category_id].elements[i][name][checkbox_value] = checked;
						}
							
						break;
						
					case 'radio-group':
						
						var values = [];
						
						for(var j = 0; j < category.form[name].radios.length; j++) {
							values.push(category.form[name].radios[j].value);
						}
						
						// If the selected radio isn't one of the possible options then set it to the default
						if( _.contains(values, sim.config[category_id].elements[i][name]) === false )
							sim.config[category_id].elements[i][name] = category.form[name].value;
							
						break;
				}
				
			}
		}
	};
	

	// When a category is selected make it the active category
	this.categories_element.on('click', 'a', function() {
		update_config();
		var category_id = $(this).attr('category-id');
		config_modal.set_active_category(category_id);
	});
	
	// Hide the config modal
	$('#config-modal-ok-btn').click(function() {
		if(!config_modal.category_form_element.valid()) {
			config_modal.category_form_element.submit();
		} else {
			config_modal.save_config();
			config_modal.hide();
		}
	});
	
	// Sets the category element
	var previous_category_element = null;
	
	this.category_form_element.on('focus', '#category-elements', function(e) {
		update_config();
	});
	
	this.category_form_element.on('change', '#category-elements', function(e) {
		populate_form_fields();
	})
	
}

$.validator.setDefaults({ 
	errorPlacement: function(error, element) {
        $(error).addClass('label label-danger error');
        $(error).insertBefore(element);
    },
    errorElement: 'div'
});