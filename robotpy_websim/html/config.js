"use strict";

var config = new function() {
	
	// The state of the config file when the program first starts. Used for initialization
	this.saved_config = {};
	
	// The state of the user config file when the program first starts. Used for initialization
	this.saved_user_config = {};
	
	// Holds the config category data
	this.config_data = {};
	
	// Holds the user config data
	this.user_config_data = {};
	
	
	this.load = function(callback) {
		
		$.ajax({
		   type: 'GET',
		   url: '/user/config.json',
		   dataType: 'json',
		   success: function(content) {
			   config.saved_config = content;
		   },
		   complete: function() {
			   
				$.ajax({
				   type: 'GET',
				   url: '/user/user-config.json',
				   dataType: 'json',
				   success: function(content) {
					   config.saved_user_config = content;
				   },
				   complete: function() {
					   if(_.isFunction(callback)) {
						   callback();
					   }
				   }
				});
			   
			   
		   }
		});
	};
	
	this.save_config = function() {
		
		$.ajax({
			type: 'POST',
			url: '/api/config/save',
			data: {
				'config' : JSON.stringify(config.config_data)
			}
		});
	};
	
	this.save_user_config = function() {
				
		$.ajax({
			type: 'POST',
			url: '/api/user_config/save',
			data: {
				'config' : JSON.stringify(config.user_config_data)
			}
		});
		
	};
	
};

var config_modal = new function() {

	// Holds all form settings for the config modal
	this.config_settings = {};
	
	// DOM elements that contain parts of the config modal
	this.element = $('#config-modal');
	this.categories_element = this.element.find('#config-categories');
	this.category_form_holder = this.element.find('#config-form-holder');
	

	
	this.add_category = function(id, settings, data) {
		
		if(this.config_settings[id] !== undefined && _.isObject(settings) === false) {
			return false;
		}
		
		this.config_settings[id] = $.extend(true, {
			
			html : '',
			rules : {},
			messages : {},
			onsubmit : function(form, data) {},
			onselect : function(form, data) {},
			title : 'Just Another Category'
			
		}, settings);
		
		// Creates the jQuery element
		this.config_settings[id].element = $('<form action="#" id="' + id + '-form" class="form-horizontal">' + 
												this.config_settings[id].html + 
											'</form>');
		
		this.config_settings[id].element.validate({
			
			errorPlacement: function(error, element) {
		        $(error).addClass('label label-danger error');
		        $(error).insertBefore(element);
		    },	    
		    errorElement: 'div',
		    rules : this.config_settings[id].rules,	    
		    messages : this.config_settings[id].messages
		});
		
		config.config_data[id] = data ? data : {};
		
		// Add to the list of categories
		$('<li role="presentation"><a href="#" category-id="' + id + '">' + this.config_settings[id].title + '</a></li>')
				.appendTo(this.categories_element);
		
		return true;
	};
	
	this.show = function() {
		
		this.element.modal('show');
		
		// Set a category if none have been chosen
		var categories = Object.keys(this.config_settings);
		
		if(categories.length > 0) {
			this.set_category(categories[0]);
		}
		
		for(var id in this.config_settings) {
			var settings = this.config_settings[id];
			settings.onselect(settings.element, config.config_data[id]);
		}
				
	};
	
	this.hide = function() {
		this.element.modal('hide');
	};
	
	this.visible = function() {
		return this.element.hasClass('in');
	}
	
	this.save_config = function() {

		for(var id in this.config_settings) {
			
			var form = this.config_settings[id].element;
			var data = config.config_data[id];
			this.config_settings[id].onsubmit(form, data);
			
		}
		
		config.save_config();
	};
	
	this.set_category = function(id) {
		
		// Detach current category element
		var current_category_id = this.get_category_id();
		
		if(current_category_id) {
			this.config_settings[current_category_id].element.detach();
		}
		
		// Get the settings of the current config category
		var config_settings = this.config_settings[id];
		
		if(config_settings === undefined) {
			return;
		}

		// Deactivate currently active category
		this.categories_element.find('li').removeClass('active');
		
		// Activate current category
		this.categories_element.find('a[category-id=' + id + ']').parent().addClass('active');
		
		// Apply settings
		config_settings.element.appendTo(this.category_form_holder);
				
		// Remove error messages when displayed
		config_settings.element.valid();
	};
	
	
	// Gets the current active category
	this.get_category_id = function() {
		
		var category_id = this.categories_element.find('li.active a').attr('category-id');
		
		return category_id ? category_id : null;
	};
	
	// Returns the html for a single input
	this.get_input_field = function(label, attr) {
		
		var html = '<div class="input-holder single-line-input">';
		html += '<label for="' + name + '">' + label + '</label>';
		html += '<span>';
		html += '<input class="form-control"';
		for(var name in attr) {
			html += ' ' + name + '="' + attr[name] + '"';
		}
		html += '>';
		html += '</span>';
		html += '</div>';
		return html;
	}
	
	// Returns the html for a group of checkbox inputs
	this.get_checkbox_group = function(label, name, inline, checkboxes) {
		
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
	this.get_radio_group = function(label, name, inline, radios) {

		var html = '<label for="' + name + '" style="margin-right: 10px;">' + label + '</label>';
		
		if(!inline) {
			html += '<br />';
			for(var i = 0; i < radios.length; i++) {
				html += '<div class="radio">';
				html +=		'<label>';
				html +=			'<input type="radio" name="' + name + '" value="' + radios[i].value + '">';
				html +=			radios[i].label;
				html +=		'</label>';
				html +=	'</div>';
			}
		} else {
			for(var i = 0; i < radios.length; i++) {
				html += '<label class="radio-inline" style="padding-top: 0px;">';
				html +=		'<input type="radio" name="' + name + '" value="' + radios[i].value + '">';
				html +=		radios[i].label;
				html +=	'</label>';
			}
		}
		
		return html;
	};
	
	this.get_select = function(id, options) {
		var html = '';
		html += '<div class="row" style="padding-bottom: 15px;">';
		html += '<div class="col-sm-5">';
		html += '<select id="' + id + '" class="form-control">';
		for(var value in options) {
			html += '<option value="' + value + '" style="font-weight: bold">' + options[value] + '</option>';
		}
		html += '</select>';
		html += '</div>';
		html += '</div>';

		return html;
	}
	
	
	// When a category is selected make it the active category
	this.categories_element.on('click', 'a', function() {
		
		var category_id = config_modal.get_category_id();
		
		// Only change to a different category if the current form input values are valid
		if(category_id !== null && config_modal.config_settings[category_id].element.valid()) {
			config_modal.set_category($(this).attr('category-id'));
		}
		
	});
	
	// Hide the config modal
	$('#config-modal-ok-btn').click(function() {
		
		var category_id = config_modal.get_category_id();
		
		// Only save and hide if the current form input values are valid
		if(category_id !== null && config_modal.config_settings[category_id].element.valid()) {
			config_modal.save_config();
			config_modal.hide();
		}
	});	
}
