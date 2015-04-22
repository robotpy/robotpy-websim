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
					set_index(id, ordered_module_ids, index, i);
					return;
				}
				
			} else {

				if(y > bottom || y > top && x > right) {
					set_index(id, ordered_module_ids, index, i);
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
	function set_index(id, ordered_module_ids, current_index, new_index) {
		
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
	
	
	
	// Move the modules
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
};