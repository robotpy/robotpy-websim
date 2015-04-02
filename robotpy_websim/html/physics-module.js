"use strict";

function Physics_Module() {
	
	// The fields needed to represent the robot
	this.robot = {};
	
	// Function that's called to initialize the physics module
	this.init = function() {};
	
	// Called periodically to update the physics module
	this.update = function(data_from_server, time_elapsed) {};
}