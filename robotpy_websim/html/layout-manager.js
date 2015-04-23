"use strict";

var layout_manager = new function() {
	
	/**
	 * Sets the position in the DOM of a particular module in a flow layout.
	 * 
	 * 		@param id: The id of the iomodule
	 * 		@param x, y: If this position is above and to the left of another
	 * 		module, then this module will be placed before it.
	 */
	this.set_order = function(id, x, y) {
		
		var ordered_module_ids = this.get_ordered_module_ids();
		
		var index = ordered_module_ids.indexOf(id);
		
		for(var i = 0; i < ordered_module_ids.length; i++) {
			
			if(ordered_module_ids[i] == id)
				continue;
			
			var module = sim.iomodules[ordered_module_ids[i]];
			
			var top = module.element.offset().top;
			var bottom = top + module.element.outerHeight();
			var left = module.element.offset().left;
			var right = left + module.element.outerWidth();
			
			if(index > i) {
				if(y < top || (y < bottom && x < left)) {
					this.set_index(id, i, ordered_module_ids, index);
					return;
				}
				
			} else {

				if(y > bottom || y > top && x > right) {
					this.set_index(id, i, ordered_module_ids, index);
					return;
				}
			}
		}
	}
	
	/**
	 * Sets the index of the module in the module holder's DOM element
	 * 
	 * 		@param id: The id of the iomodule that's being repositioned
	 * 		@param ordered_module_ids: The list of all the iomodules ordered
	 * 		by their position in the DOM
	 * 		@param current_index: The current position of the module being
	 * 		moved in the DOM
	 * 		@param new_index: The module's new position in the DOM
	 */ 
	this.set_index = function(id, new_index, ordered_module_ids, current_index) {
		
		if(ordered_module_ids === undefined) {
			ordered_module_ids = this.get_ordered_module_ids();
			current_index = ordered_module_ids.indexOf(id);
		}
		
		var module = sim.iomodules[id];
		
		if(current_index > new_index) {
			if(new_index < 0)
				new_index = 0;
			
			sim.iomodules[ ordered_module_ids[new_index] ].element.before(module.element);
		} else {
			if(new_index >= ordered_module_ids.length - 1) {
				new_index = ordered_module_ids.length - 1;
			}
			
			sim.iomodules[ ordered_module_ids[new_index] ].element.after(module.element);
		}
		
	};
	
	/**
	 * Returns a list of module ids ordered by their position in the DOM
	 */
	this.get_ordered_module_ids = function() {
		var module_ids = [];
		
		$('.iomodule').each(function() {
			module_ids.push($(this).attr('id'));
		});
		
		return module_ids;
	}
	
	/**
	 * Add to config modal
	 */
	this.add_to_config_modal = function() {
		var data = _.isObject(config.saved_config['websim-layout']) ? config.saved_config['websim-layout'] : {};
		
		if(data.layout_type != 'flow' && data.layout_type != 'absolute') {
			data.layout_type = 'flow';
		}
		
		config.config_data['websim-layout'] = data;
		
		apply_config(data);
		
		// config form
		var html = config_modal.get_radio_group('Layout Type:', 'layout-type', true, [
	            { "label" : "Flow", "value" : "flow" },
	            { "label" : "Absolute", "value" : "absolute" }
			]);
		
		// Add category
		config_modal.add_category('websim-layout', {
			html: html,
			title : 'Websim Layout',
			onselect : function(form, data) {
				form.find('input[name=layout-type][value=' + data.layout_type + ']').prop('checked', true);
			},
			onsubmit : function(form, data) {		
				data.layout_type = form.find('input[name=layout-type]:checked').val();			
				apply_config(data);
			}
		}, data);
		
		function apply_config(data) {
			
			if(data.layout_type == 'flow') {
				$('#iomodules').removeClass('absolute-layout');
				$('#iomodules').addClass('flow-layout');
				
				// Set DOM order
				layout_manager.set_dom_order();
				
				for(var id in sim.iomodules) {
					sim.iomodules[id].element.css({
						left : 0,
						top : 0
					});
				}
				
				
			} else {				
				var module_position_unset = false;
				
				for(var id in sim.iomodules) {
					
					if(config.user_config_data[id].position.set) {
						var x = config.user_config_data[id].position.x;
						var y = config.user_config_data[id].position.y;
					} else {
						var x = sim.iomodules[id].element.offset().left;
						var y = sim.iomodules[id].element.offset().top;
						config.user_config_data[id].position.x = x;
						config.user_config_data[id].position.y = y;
						config.user_config_data[id].position.set = true;
						module_position_unset = true;
					}
					
					if(id == 'analog') {
						console.log('x: ' + x + ', y: ' + y);
					}
					
					var position = layout_manager.offset_to_position(x, y);
					
					sim.iomodules[id].element.css({
						left : position.x,
						top : position.y
					});
					
					
					
				}
				
				$('#iomodules').addClass('absolute-layout');
				$('#iomodules').removeClass('flow-layout');
				
				if(module_position_unset) {
					config.save_user_config();
				}
			}				
		}
	};
	
	/**
	 * Converts a point relative to the top left corner of the page
	 * to its point in the iomodules container
	 */
	var $iomodules = $('#iomodules');
	var iomodule_offset = {
		x : $iomodules.offset().left + ($iomodules.outerWidth() - $iomodules.width()) / 2,
		y : $iomodules.offset().top + ($iomodules.outerHeight() - $iomodules.height()) / 2
	};
	
	this.offset_to_position = function(x, y) {
		return {x : x - iomodule_offset.x, y : y - iomodule_offset.y};
	};
	
	/**
	 * Sets the order of the iomodules in the DOM based on their order value
	 * in the config in ASC order.
	 */
	this.set_dom_order = function() {
		// Set DOM order
		var module_unordered_list = [];
		
		for(var id in config.user_config_data) {
			
			var module = {
				id : id,
				order : config.user_config_data[id].position.order
			};
			
			module_unordered_list.push(module);
		}

		var module_ordered_list = _.sortBy(module_unordered_list, 'order');
		
		for(var i = 0; i < module_ordered_list.length; i++) {
			
			layout_manager.set_index(module_ordered_list[i].id, i);
		}
	}
	
	
	
	
	// Move the modules
	$(function() {
		
		var iomodule = null;
		var iomodule_id = null;
		var click_position = null;
		var iomodule_start_position = null;
		
		function set_module(e) {
			var $iomodule = $(this).closest('.iomodule');
			
			if( $iomodule.length === 0) {
				return;
			}
			
			iomodule_id = $iomodule.attr('id');
			
			iomodule = sim.iomodules[iomodule_id];
			
			if(!iomodule) {
				return;
			}
			
			
	    	click_position = { 'x' : e.pageX, 'y' : e.pageY };
	    	iomodule_start_position = { 'x' : iomodule.element.offset().left, 'y' : iomodule.element.offset().top };
	    	$('body').addClass('noselect');
		}
		
		function unset_module(e) {
			
			if(!iomodule) {
				return;
			}
			
			if(config.config_data['websim-layout'].layout_type == 'absolute') {
				_.assign(config.user_config_data[iomodule_id].position, {
					x : iomodule.element.offset().left,
					y : iomodule.element.offset().top,
					set : true
				});

			} else {
				
				// Set order for all modules
				var ordered_module_ids = layout_manager.get_ordered_module_ids();
				
				for(var i = 0; i < ordered_module_ids.length; i++) {
					
					config.user_config_data[ ordered_module_ids[i] ].position.order = i;
				}
				
			}
			
			
			config.save_user_config();
			iomodule = null;
			iomodule_id = null;
			$('body').removeClass('noselect');
		}
		
		$('body').on('mousedown', '.cursor-grab', set_module);
		
		$(window)
			.mouseup(unset_module)
			.mousemove(function(e) {
				
				if(!iomodule) {
		    		return;
		    	}
		    	
				
				if(config.config_data['websim-layout'].layout_type == 'absolute') {

			    	var dx = e.pageX - click_position.x;
			    	var dy = e.pageY - click_position.y;
			    	
			    	var x = iomodule_start_position.x + dx;
			    	var y = iomodule_start_position.y + dy;
			    	
			    	var position = layout_manager.offset_to_position(x, y);
			    	
			    	iomodule.element.css({
			    		left : position.x,
			    		top : position.y
			    	});
			    	
			    	iomodule.element.removeClass('flow-layout');
			    	iomodule.element.addClass('absolute-layout');
			    	
				} else {
					var x = e.pageX;
					var y = e.pageY;
					
					layout_manager.set_order(iomodule_id, x, y);
					
				}
				
	    	
	    });
		
	});
	
};