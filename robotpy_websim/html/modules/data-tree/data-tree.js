"use strict";

$(function() {
	
	function Data_Tree() {
			
		var module = this;
		
		this.title = 'Data Tree';
		
		this.on_config_update = function(data_tree) {
			
			var visible = data_tree[0].visible;
			
			if(visible === 'y') {
				this.element.removeClass('hidden');
			} else {
				this.element.addClass('hidden');
			}
		};
		
		this.init = function() {
			
			this.update = true;
			this.element.on('click', '.update-btn', function() {
				module.update = true;
			});	
		};

		this.update_interface = function(data) {
			if(this.update) {
				this.element.find('.out-tree').jsonTree({ 'data' : data });
				this.update = false;
			}
			
		};
		
	}
	
	Data_Tree.prototype = new IOModule();
	
	
	// Load content
	$.get('modules/data-tree/data-tree.html', function(content) {
		
		// Add the content
		$('<div id="data-tree">' + content + '</div>').appendTo('body');
		
		// Create the module. Do nothing if it wasn't properly added
		var iomodule = new Data_Tree();
		
		if(!sim.add_iomodule('data-tree', iomodule)) {
			return;
		}
		
		// Add the css
		sim.add_css('modules/data-tree/data-tree.css');
		
		// Initialize the sliders
		iomodule.update = true;
		iomodule.element.on('click', '.update-btn', function() {
			iomodule.update = true;
		});	
				
		// Add to config modal
		var config = config_modal.config_file_content;
			
		var data = _.isObject(config['data-tree']) ? config['data-tree'] : {};
		
		if(data.visible != 'y' && data.visible != 'n') {
			data.visible = 'y';
		}
		
		apply_config(data);
		
		// config form
		var html = config_modal.get_radio_group('Visible:', 'visible', true, [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			]);
		
		// Add category
		config_modal.add_category('data-tree', {
			html: html,
			title : 'Data Tree',
			onselect : function(form, data) {
				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
			},
			onsubmit : function(form, data) {			
				data.visible = form.find('input[name=visible]:checked').val();			
				apply_config(data);
			}
		}, data);
		
		function apply_config(data) {
			
			if(data.visible == 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}				
		}
	});
	
	
});
