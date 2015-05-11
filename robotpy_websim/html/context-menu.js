"use strict";


var context_menu = new function() {
	
	this.element = $('#context-menu');
	
	// Stores a list of context menus where the keys are the modules' index
	this.menus = {};
	
	// Adds a context menu based on the iomodule element id
	this.add = function(iomodule, settings) {
		
		var menu = $.extend(true, {
			// False by default. If true then the config data is retrieved from the user config
			user_config: false,
			// The key that contains the config data. If omitted or empty then all the config data is given
			config_key: '',
			html: this.create_button('hide-iomodule', 'Hide', 'eye-close'),
			// Used to attach listeners to the menu when it is created
			oncreate: function(menu, data) { },
			onopen: function(menu, data) { }
		}, settings);
		
		// Get the module's index
		var index = iomodule.element.attr('id');
		
		// Add menu element
		menu.element = $('<ul data-module-index="' + index + '" class="context-menu-items dropdown-menu" role="menu">' +
					     	menu.html + 
						 '</ul>');
		
		if(menu.user_config) {
			var config_data = menu.config_key == '' ? config.user_config_data : config.user_config_data[menu.config_key];
		} else {
			var config_data = menu.config_key == '' ? config.config_data : config.config_data[menu.config_key];
		}
		
		menu.oncreate(menu.element, config_data);
		
		this.menus[index] = menu;
		
	};
	
	// Shows the context menu of a particular iomodule
	this.show = function(index, x, y) {
		
		var menu = this.menus[index];

		if(!menu)
			return;
		
		
		this.element.css({
			display: 'block',
			left: x,
			top: y
		});
		
		this.element.find('.context-menu-items').detach();
		menu.element.appendTo(this.element);
		
		if(menu.user_config) {
			var config_data = menu.config_key == '' ? config.user_config_data : config.user_config_data[menu.config_key];
		} else {
			var config_data = menu.config_key == '' ? config.config_data : config.config_data[menu.config_key];
		}
		
		menu.onopen(menu.element, config_data);
	};
	
	// Hides the context menu
	this.hide = function() {
		this.element.css('display', 'none');
	};
	
	this.create_button = function(id, title, glyphicon) {
		var glyph_html = glyphicon ? '<span class="glyphicon glyphicon-' + glyphicon + '"></span>' : '';
		return '<li id="' + id + '"><a href="#">' + glyph_html + ' ' + title + '</a></li>';
	};
	
	this.create_checkbox = function(id, title, glyphicon) {
		var glyph_html = glyphicon ? '<span class="glyphicon glyphicon-' + glyphicon + '"></span>' : '';
		
		var html = '<li class="menu-checkbox" id="' + id + '">' +
				       '<a href="#">' +
				           '<input type="checkbox" name="" checked>' +
				           '<span class="lbl"> ' + title + '</span>' +
				       '</a>' +
				   '</li>';
		
		return html;
	};
	
	this.add_checkbox_events = function(button, callback) {
		
		var checkbox = button.find('input');
		
		checkbox.click(function(e) {
			e.stopPropagation();
		});
		
		button.click(function(e) {
			e.stopPropagation();
			var checked = checkbox.prop('checked');
			checkbox.prop('checked', !checked);
			checkbox.change();
		});
		
		checkbox.change(function(e) {
			
			var checked = checkbox.prop('checked');
			if(_.isFunction(callback))
				callback(checked, e);
		});
	}
	
	// Open context menu
	// Events to open/close context menu
	
	$(window).on("contextmenu", function(e) {
			
		var x = e.pageX;
		var y = e.pageY;
		
		for(var index in context_menu.menus) {
		//for(var index in sim.iomodules) {
			if(in_module(index, x, y)) {
				e.preventDefault();
				context_menu.show(index, x, y);
				break;
			}
		}
	}).mouseup(function(e) {
		context_menu.hide();
	});
	
	
	function in_module(index, x, y) {
		var module = sim.iomodules[index];
		if(!module || module.element.hasClass('hidden'))
			return;
		
		var left = module.element.offset().left;
		var right = left + module.element.outerWidth();
		var top = module.element.offset().top;
		var bottom = top + module.element.outerHeight();
		
		return left < x && x < right && top < y && y < bottom;
	}
	
};