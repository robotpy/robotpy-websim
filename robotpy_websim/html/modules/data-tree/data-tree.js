"use strict";

function Data_Tree_IOModule() {
	
	var module = this;
	
	this.title = 'Data Tree';
	
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

Data_Tree_IOModule.prototype = new IOModule();
sim.add_iomodule('data-tree', new Data_Tree_IOModule());