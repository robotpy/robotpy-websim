"use strict";

$(function() {
	
	function create_iomodule() {
		
		return sim.add_iomodule('data-tree', new function() {
			
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
			
		});
		
	}
	
	
	// Load content
	$.get('modules/data-tree/data-tree.html', function(content) {
		
		// Add the content
		$('<div id="data-tree">' + content + '</div>').appendTo('body');
		
		// Create the module. Do nothing if it wasn't properly added
		var iomodule = create_iomodule();
		
		if(!iomodule) {
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
		var form = {};
		
		form.visible = {
			"type" : "radio-group",
			"label" : "Visible:",
			"inline" : true,
			"value" : "y",
			"radios" : [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			],
			"rules" : {},
			"messages" : {}
		};
		
		config_modal.add_category('data-tree', 'Data Tree', form, 1);
		config_modal.add_update_listener('data-tree', true, function(data_tree) {
				
			var visible = data_tree[0].visible;
			
			if(visible === 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}
			
		});
	});
	
	
});
