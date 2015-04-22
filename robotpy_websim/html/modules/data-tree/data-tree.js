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
	
	sim.add_iomodule('data-tree', Data_Tree, function(iomodule) {
		
		// Initialize the sliders
		iomodule.update = true;
		iomodule.element.on('click', '.update-btn', function() {
			iomodule.update = true;
		});	
				
		// Add to config modal
		var data = _.isObject(config.saved_config['data-tree']) ? config.saved_config['data-tree'] : {};
		
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
