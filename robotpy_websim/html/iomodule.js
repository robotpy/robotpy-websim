
(function($) {
	
//constant that controls the time between updates
var UPDATE_RATE = 100;
	
//Object that holds all the ioModules. Property names are the id 
//names of the IOModules passed to the ioModule jquery functions
var ioModules = new Object();

//module id's sorted by ascending priority
var moduleIDsByPriorityAsc = [];

//True if the simulator is running
var isRunning = false;

//the last data sent from the server
var data = null;

//model of the robot
var robot = null;

//physics modules
var physicsModules = {};

//time of last update
var timeOfLastUpdate = null;

//date object
var date = new Date();

/*
 * JQuery function that creates an IOModule and then returns it.
 * Will return null if the simulator is currently running or if
 * the id is already associated with another IOModule.
 */
$.fn.ioModule = function(id, options) {
	if(isRunning || ioModules.hasOwnProperty(id)) {
		return null;
	}
	
	var element = this;
	
	
	//create IOModule and add the options to its properties
	var ioModule = $.extend({
		id: id,
		element: element,
		//title is displayed above
		title: id,
		//the higher the priority, the more likely the data
		//returned in the getData function will be the data 
		//sent to the server
		priority: 0,
		//Sets the data sent to the server. The most recent
		//data from the server will be passed by reference. 
		//The data passed to this function will reflect modifications 
		//made by the getData functions of other IOModules with lower 
		//priorities. 
		getData: function(data) {},
		//Modifies the content displayed using a copy of the most 
		//recent data from the server.
		setData: function(data) {},
		//function that is called after IOModule is created
		init: function() {},
		//does not send data to the server if false
		updateServer: true,
		//does not send data to IOModule if false
		updateClient: false,
		
		contextMenu: {
			update: {
				type: 'radio',
				buttons: [
	               {label: 'Update Client', value: 'client'},
	               {label: 'Update Server', value: 'server'}
	            ],
	            get: function(module) {
	            	if(module.updateServer) {
	            		return 'server';
	            	} else if(module.updateClient) {
	            		return 'client';
	            	}
	            },
	            set: function(module, value) {
	            	if(value === 'server') {
	            		module.updateServer = true;
	            		module.updateClient = false;
	            	} else if(value === 'client') {
	            		module.updateServer = false;
	            		module.updateClient = true;
	            	}
	            }
			}
		}
	}, options);
	
		
	ioModules[id] = ioModule;
	moduleIDsByPriorityAsc.push(id);
	ioModule.init();
	
	//add iomodule class and iomodule title to element
	$(this).addClass('iomodule');
	$(this).prepend('<h4 class="title">' + ioModule.title + '</h4>');
	
	return ioModule;
};

/*
 * Adds an IOModule from the modules folder. The id must
 * be the name of the folder, and the three files it should
 * contain are [id].html, [id].js, and [id].css (optional)
 */
$.loadIOModule = function(id) {
	var element = $('#' + id);
	var htmlPath = 'modules/' + id + '/' + id + '.html';
	var jsPath = 'modules/' + id + '/' + id + '.js';
	var cssPath = 'modules/' + id + '/' + id + '.css';

	//html and js files are required. css is optional
	//if either html or js isn't found, return false
	var response = false;
	$.ajax({
	   async: false,
	   type: 'GET',
	   url: htmlPath,
	   dataType: 'html',
	   success: function( html ) {
		   //add html to element
		   element.append(html);	
		   //add css
		   var cssContent = '<!-- css for ' + id + ' -->';
		   cssContent += '<link rel="stylesheet" ' + 'href="' + cssPath + '">';
		   $('head').append(cssContent);
		   element.addClass(id);
		   //add js
		   $.ajax({
			   async: false,
			   type: 'GET',
			   url: jsPath,
			   dataType: 'script',
			   success: function( js ) {
				   var jsContent = '<!-- js for IOModule ' + id + ' -->';
				   jsContent += '<script>' + js + '</script>';
				   $('body').append(jsContent);
				   //if module was successfully added return the module
				   response = $.getSimulatorValue('ioModule', id);
			   }
			});
	   }
	});

	return response;
};



/*
 * Adds a physics module. Physics module must contain
 * init(robot) and update(data, elapsedTime) methods. A
 * dictionary with all the necessary robot information
 * must also be passed (motors, sensors, robot weight and
 * dimensions, etc)
 */

$.addPhysicsModule = function(id, module, robot) {
	if(isRunning) {
		return;
	}
	
	
	
	if(physicsModules.hasOwnProperty(id)) {
		return false;
	}
	
	physicsModules[id] = module;
	
	if(typeof(robot) !== 'undefined') {
		module.init(robot);
	}
	
	return true;
};


/*
 * Loads a physics module from the physics folder.
 */
$.loadPhysicsModule = function(id, robot) {
	var physicsModule = null;
	$.ajax({
	   async: false,
	   type: 'GET',
	   url: 'physics/' + id + '.js',
	   dataType: 'script',
	   success: function( js ) {
		   var jsContent = '<!-- js for physics module ' + id + ' -->';
		   jsContent += '<script>' + js + '</script>';
		   $('body').append(jsContent);
		   //if module was successfully added return the module
		   physicsModule = $.getSimulatorValue('physicsModule', id);
	   },  
	   error: function(jqXHR, textStatus, errorThrown) {
	        console.log('Unable to load physics module ' + id + '.js, ' + errorThrown);
	    }
	});
	
	if(physicsModule) {
		physicsModule.init(robot);
		return physicsModule;
	}
	
	return false;
}


$.getSimulatorValue = function(property, key) {
	switch(property) {
	
		case 'UPDATE_RATE':
			return UPDATE_RATE
			
		case 'ioModule':
			if(ioModules.hasOwnProperty(key) === false) {
				return false;
			}
			return ioModules[key];
		
		case 'ioModules':
			return ioModules;
			
		case 'physicsModule':
			if(physicsModules.hasOwnProperty(key) === false) {
				return false;
			}
			
			return physicsModules[key];
			
		case 'physicsModules':
			return physicsModules;
		
	}
	
	return null;
}


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
};

function getDataLoop() {
	$.getJSON("/api/hal_data", onData);
	
	//run again with a .1 second pause
	//if the simulator is still running
	if(isRunning) {
		setTimeout(getDataLoop, UPDATE_RATE);
	}
}

function onData(newData) {
	var elapsedTime = 0;
	var currentTime =  Date.now();
	if(timeOfLastUpdate !== null) {
		elapsedTime = currentTime - timeOfLastUpdate;
	}
	
	timeOfLastUpdate = currentTime;
	
	//physics
	for(var id in physicsModules) {
		physicsModules[id].update(newData, elapsedTime / 1000);
	}
	
	//update interface
	if(data !== null) {
		for(i = 0; i < moduleIDsByPriorityAsc.length; i++) {
			id = moduleIDsByPriorityAsc[i];
			ioModules[id].setData($.extend(true, {}, newData));
		}
	}
	
	//prepare data to be sent to the server
	var dataToServer = $.extend(true, {}, newData);
	
	for(var i = 0; i < moduleIDsByPriorityAsc.length; i++) {
		id = moduleIDsByPriorityAsc[i];
		ioModules[id].getData(dataToServer);
	}

	// actually send the data back!
	// ... there's a race condition here. :(

	$.post('/api/hal_data', {
		'data' : JSON.stringify(dataToServer)
	});
	
	data = $.extend(true, {}, newData);
}

}(jQuery))
