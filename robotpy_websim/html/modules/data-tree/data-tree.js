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
	
	this.update_interface = function(data_from_server) {
		if(this.update) {
			this.element.find('.tree').jsonTree(data_from_server);
			this.update = false;
		}
	};
	
}

Data_Tree_IOModule.prototype = new IOModule();
sim.add_iomodule('data-tree', new Data_Tree_IOModule());