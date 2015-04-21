"use strict";

var config_modal = new function() {
	
	// Config file content
	this.config_file_content = {};
	
	// Holds all the config category data
	this.config_settings = {};
	
	// Holds the config category data
	this.config_data = {};
	
	// DOM elements that contain parts of the config modal
	this.element = $('#config-modal');
	this.categories_element = this.element.find('#config-categories');
	this.category_form_element = this.element.find('#config-active-category-form');
	
	// Initialize form validation
	this.category_form_element.validate({
		
		errorPlacement: function(error, element) {
	        $(error).addClass('label label-danger error');
	        $(error).insertBefore(element);
	    },	    
	    errorElement: 'div',
	    rules : {},	    
	    messages : {}
	});
	
	this.load_config = function(callback) {
		
		
		$.ajax({
		   type: 'GET',
		   url: '/user/config.json',
		   dataType: 'json',
		   success: function(config) {
			   config_modal.config_file_content = config;
		   },
		   complete: function() {
			   if(_.isFunction(callback)) {
				   callback();
			   }
		   }
		});
	};
	
	this.add_category = function(id, settings, data) {
		
		if(this.config_settings[id] !== undefined && _.isObject(config) === false) {
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
		this.config_settings[id].element = $('<div>' + this.config_settings[id].html + '</div>');
		
		this.config_data[id] = data ? data : {};
		
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
			var data = this.config_data[id];
			this.config_settings[id].onsubmit(form, data);
			
		}
		
		$.ajax({
			type: 'POST',
			url: '/api/config/save',
			data: {
				'config' : JSON.stringify(config_modal.config_data)
			}
		});
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
		config_settings.element.appendTo(this.category_form_element);
		
		var settings = this.category_form_element.validate().settings;
		settings.rules = config_settings.rules;
		settings.messages = config_settings.messages;
		
		// Remove error messages when displayed
		this.category_form_element.valid();
		
		config_settings.onselect(config_settings.element, this.config_data[id]);
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
		
		// Only change to a different category if the current form input values are valid
		if(config_modal.category_form_element.valid()) {
			var category_id = $(this).attr('category-id');
			config_modal.set_category(category_id);
		}
		
	});
	
	// Hide the config modal
	$('#config-modal-ok-btn').click(function() {
		
		// Only save and hide if the current form input values are valid
		if(config_modal.category_form_element.valid()) {
			config_modal.save_config();
			config_modal.hide();
		}
	});	
}

var user_config = new function() {
	
	// The state of the config file when the program first starts
	// used for initialization
	this.saved_config = {};
	
	// Load the config file
	this.load_config = function(callback) {
		$.ajax({
		   type: 'GET',
		   url: '/user/user-config.json',
		   dataType: 'json',
		   success: function(config) {
			   user_config.saved_config = config;
		   },
		   complete: function() {
			   if(_.isFunction(callback)) {
				   callback();
			   }
		   }
		});
	};
	
	this.save_config = function() {
		
		var config = {};
		
		for(var id in sim.iomodules) {
			
			var iomodule = sim.iomodules[id];
			
			config[id] = {
				x : iomodule.element.offset().left,
				y : iomodule.element.offset().top,
				moved : iomodule.element.hasClass('absolute-layout')
			};
			
			
		};
		
		$.ajax({
			type: 'POST',
			url: '/api/user_config/save',
			data: {
				'config' : JSON.stringify(config)
			}
		});
		
	};
	
	
	
	// Move the modules
	// Events to drag toolbox
	$(function() {
		
		var iomodule = null;
		var iomodule_id = null;
		var click_position = null;
		var iomodule_start_position = null;
		
		$('body').on('mousedown', '.cursor-grab', function(e) {
			
			var $iomodule = $(this).closest('.iomodule');
			
			if( $iomodule.length === 0) {
				return;
			}
			
			iomodule_id = $iomodule.attr('id');
			
			iomodule = sim.iomodules[iomodule_id];
			
			if(!iomodule) {
				return;
			}
			
			
			// Set its position if it hasn't been moved
			if(!sim.config[iomodule_id].position.moved) {
				iomodule.set_position(iomodule.element.offset().left, iomodule.element.offset().top);
				iomodule.element.removeClass('flow-layout');
				iomodule.element.addClass('absolute-layout');
				sim.config[iomodule_id].position.moved = true;
			}
			
			
	    	click_position = { 'x' : e.clientX, 'y' : e.clientY };
	    	iomodule_start_position = { 'x' : iomodule.get_x(), 'y' : iomodule.get_y() };
	    	$('body').addClass('noselect');
	    	
	    });
		
		$(window).mouseup(function(e) {
		   
		   if(iomodule) {
			   user_config.save_config();
			   iomodule = null;
			   iomodule_id = null;
			   $('body').removeClass('noselect');
		   }
	       
	    }).mousemove(function(e) {
	    	
	    	if(!iomodule) {
	    		return;
	    	}
	    	
	    	var dx = e.clientX - click_position.x;
	    	var dy = e.clientY - click_position.y;
	    	
	    	var x = iomodule_start_position.x + dx;
	    	var y = iomodule_start_position.y + dy;
	    	
	    	iomodule.element.css({
	    		left : x,
	    		top : y
	    	});
	    	
	    	iomodule.element.removeClass('flow-layout');
	    	iomodule.element.addClass('absolute-layout');
	    	
	    });
		
	});

}
