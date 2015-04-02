"use strict";

function IOModule() {
	
	// The DOM element of the IOModule
	this.element = null;
	
	// The title displayed for the module
	this.title = 'Just Another IOModule';
	
	
	// Modifies the data sent to the server. The most recent
	// data from the server will be passed by reference. 
	// The data passed to this function will reflect modifications 
	// made by IOModules' modify_data_to_server functions
	this.modify_data_to_server = function(data_to_server) {};
	
	// Modifies the content displayed using a copy of the most 
	// recent data from the server.
	this.update_interface = function(data_from_server) {};
	
	// function that is called after IOModule is created
	this.init = function() {};
	
}