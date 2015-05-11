"use strict";

var config = new function() {
	
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
			   config.config_data = content;
		   },
		   complete: function() {
			   
				$.ajax({
				   type: 'GET',
				   url: '/user/user-config.json',
				   dataType: 'json',
				   success: function(content) {
					   config.user_config_data = content;
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
	this.config_settings = [];
	
	// DOM elements that contain parts of the config modal
	this.element = $('#config-modal');
	this.categories_element = this.element.find('#config-categories');
	this.category_form_holder = this.element.find('#config-form-holder');
	

	
	this.add_category = function(settings) {
		
		if(_.isObject(settings) === false) {
			return false;
		}
		
		var category = $.extend(true, {
			
			// False by default. If true then the config data is retrieved from the user config
			user_config: false,
			// The key that contains the config data. If omitted or empty then all the config data is given
			config_key: '',
			html : '',
			rules : {},
			messages : {},
			onopen : function(form, data) {},
			onsave : function(form, data) {},
			title : 'Just Another Category'
			
		}, settings);
		
		var index = this.config_settings.length;
		this.config_settings.push(category);
		
		// Creates the jQuery element		
		category.element = $('<form action="#" id="' + index + '-form" class="form-horizontal">' + 
												category.html + 
											'</form>');
		
		category.element.validate({
			
			errorPlacement: function(error, element) {
		        $(error).addClass('label label-danger error');
		        $(error).insertBefore(element);
		    },	    
		    errorElement: 'div',
		    rules : category.rules,	    
		    messages : category.messages
		});
		
		// Add to the list of categories
		$('<li role="presentation"><a href="#" category-index="' + index + '">' + category.title + '</a></li>')
				.appendTo(this.categories_element);
		
		return true;
	};
	
	this.show = function() {
		
		this.element.modal('show');
		
		// Set a category if none have been chosen
		if(this.config_settings.length > 0 && this.get_category_index() === null) {
			this.set_category(0);
		}
		
		for(var i = 0; i < this.config_settings.length; i++) {
			var settings = this.config_settings[i];
			if(settings.user_config) {
				var config_data = settings.config_key == '' ? config.user_config_data : config.user_config_data[settings.config_key];
			} else {
				var config_data = settings.config_key == '' ? config.config_data : config.config_data[settings.config_key];
			}
			settings.onopen(settings.element, config_data);
		}
				
	};
	
	this.hide = function() {
		this.element.modal('hide');
	};
	
	this.visible = function() {
		return this.element.hasClass('in');
	}
	
	this.save_config = function() {

		for(var i = 0; i < this.config_settings.length; i++) {
			
			var settings = this.config_settings[i];
			if(settings.user_config) {
				var config_data = settings.config_key == '' ? config.user_config_data : config.user_config_data[settings.config_key];
			} else {
				var config_data = settings.config_key == '' ? config.config_data : config.config_data[settings.config_key];
			}
			settings.onsave(settings.element, config_data);
			
		}
		
		config.save_config();
	};
	
	this.set_category = function(index) {
		
		// Detach current category element
		var current_category_index = this.get_category_index();
		
		if(current_category_index) {
			this.config_settings[current_category_index].element.detach();
		}
		
		// Get the settings of the current config category
		var config_settings = this.config_settings[index];
		
		if(config_settings === undefined) {
			return;
		}

		// Deactivate currently active category
		this.categories_element.find('li').removeClass('active');
		
		// Activate current category
		this.categories_element.find('a[category-index=' + index + ']').parent().addClass('active');
		
		// Apply settings
		config_settings.element.appendTo(this.category_form_holder);
				
		// Remove error messages when displayed
		config_settings.element.valid();
	};
	
	
	// Gets the current active category
	this.get_category_index = function() {
		
		var category_index = this.categories_element.find('li.active a').attr('category-index');
		return category_index ? category_index : null;
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

		var category_index = config_modal.get_category_index();
		
		// Only change to a different category if the current form input values are valid
		if(category_index !== null && config_modal.config_settings[category_index].element.valid()) {
			config_modal.set_category($(this).attr('category-index'));
		}
		
	});
	
	// Hide the config modal
	$('#config-modal-ok-btn').click(function() {
		
		var category_index = config_modal.get_category_index();
		
		// Only save and hide if the current form input values are valid
		if(category_index !== null && config_modal.config_settings[category_index].element.valid()) {
			config_modal.save_config();
			config_modal.hide();
		}
	});	
}
