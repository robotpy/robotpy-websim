"use strict";

function Data_Tree_IOModule() {
	
	var module = this;
	
	this.title = 'Data Tree';
	
	this.init = function() {
		
		update_trees();
		
		this.element.on('click', '.update-btn', update_trees);	
	};
	
	function update_trees() {
		$.getJSON('/api/hal_data', function(data) {
			module.element.find('.out-tree').jsonTree({ 'data' : data.out });
			module.element.find('.in-tree').jsonTree({ 'data' : data.in });
		});
	}
}

Data_Tree_IOModule.prototype = new IOModule();
sim.add_iomodule('data-tree', new Data_Tree_IOModule());