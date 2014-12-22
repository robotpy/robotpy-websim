
(function($) {
	
//Object that holds all the ioModules. Property names are the id 
//names of the IOModules passed to the ioModule jquery functions
var ioModules = new Object();

//module id's sorted by ascending priority
var moduleIDsByPriorityAsc = [];

//True if the simulator is running
var isRunning = false;

//the last data sent from the server
var data = null;
	

/*
 * IOModule class
 */

function IOModule(id, element)	{
	this.id = id;
	this.element = element;
	
	//title is displayed above
	this.title = id;
	
	//the higher the priority, the more likely the data
	//returned in the getData function will be the data 
	//sent to the server
	this.priority = 0;
	
	//Sets the data sent to the server. The most recent
	//data from the server will be passed. The data passed 
	//to this function will reflect modifications made by 
	//the getData functions of other IOModules with lower 
	//priorities.
	this.getData = function(data) {};
	
	//Modifies the content displayed 
	this.setData = function(data) {};
	
	//function that is called after IOModule is created
	this.init = function() {};
}


/*
 * JQuery function that creates an IOModule and then returns it.
 * Will return null if the simulator is currently running or if
 * the id is already associated with another IOModule.
 */
$.fn.ioModule = function(id, options) {
	if(isRunning || ioModules.hasOwnProperty(id)) {
		return null;
	}
	
	
	//create IOModule and add the options to its properties
	var ioModule = new IOModule(id, this);
	for(property in options) {
		ioModule[property] = options[property];
	}
	
	ioModules[id] = ioModule;
	moduleIDsByPriorityAsc.push(id);
	ioModule.init();
	
	return ioModule;
};

/*
 * JQuery function that gets an existing ioModule by id
 */
$.fn.getIOModule = function(id) {
	alert(id);
	return ioModules[id];
};

/*
 * JQuery function to start the simulator
 */

$.startSimulator = function() {
	if(isRunning) {
		return;
	}
	
	//order modules by priority
	var done = false;
	while(!done) {
		done = true;
		for(i = 0; i < Object.keys(moduleIDsByPriorityAsc).length - 1; i++) {
			var module1 = ioModules[moduleIDsByPriorityAsc[i]];
			var module2 = ioModules[moduleIDsByPriorityAsc[i + 1]];
			if(module1.priority <= module2.priority) {
				continue;
			}
			
			moduleIDsByPriorityAsc[i] = module2.id;
			moduleIDsByPriorityAsc[i + 1] = module1.id;
			done = false;
		}
	}
	
	isRunning = true;
	getDataLoop();
};

$.fn.stopSimulator = function() {
	isRunning  = false;
}

function getDataLoop() {
	$.getJSON("/api/hal_data", onData);
	
	//run again with a .1 second pause
	//if the simulator is still running
	if(isRunning) {
		setTimeout(getDataLoop, 100);
	}
}

function onData(d) {
	data = d;
	
	//set data
	for(i = 0; i < moduleIDsByPriorityAsc.length; i++) {
		id = moduleIDsByPriorityAsc[i];
		ioModules[id].setData(data);
	}
	
	//get data
	for(i = 0; i < moduleIDsByPriorityAsc.length; i++) {
		id = moduleIDsByPriorityAsc[i];
		ioModules[id].getData(data);
	}
	

	// actually send the data back!
	// ... there's a race condition here. :(

	$.post('/api/hal_data', {
		'data' : JSON.stringify(data)
	});
}

}(jQuery))
