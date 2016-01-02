var _ = require('lodash'),
	fs = require("fs");


function isDirectory(path) {

	try {
	    // Query the entry
	    stats = fs.lstatSync(path);

	    // Is it a directory?
	    if (!stats.isDirectory()) {
	       	return false;
	    }
	}
	catch (e) {
	    return false;
	}

	return true;
}

function getModulePaths(simPath) {

	// Get the folders containing the modules
	var moduleParentPaths = ['robotpy_websim/html/modules/'];
	if(isDirectory(simPath + 'modules/')) {
		moduleParentPaths.append(simPath + 'modules/');
	}

	// Get all the module paths
	var modulePaths = {};

	moduleParentPaths.forEach(function(moduleParentPath) {
		var modules = fs.readdirSync(moduleParentPath);
		modules.forEach(function(module) {
			if(isDirectory(moduleParentPath + module)) {
				modulePaths[module] = moduleParentPath + module;
			}
		});
	});

	return modulePaths;
}

module.exports = function(grunt) {

	var simPath = _.trimRight(grunt.option('simPath'), '/') + '/',
		modulePaths = getModulePaths(simPath),
		uglifyFiles = {},
		cssminFiles = {};

		console.log(modulePaths);
	
	uglifyFiles[simPath + 'modules.min.js'] = _.map(modulePaths, function(path) { return path + '/*.js'; });
	cssminFiles[simPath + 'modules.min.css'] = _.map(modulePaths, function(path) { return path + '/*.css'; });


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
		    options: {
		    	mangle: false
		    },
		    my_target: {
		    	files: uglifyFiles
		    }
		},
		cssmin: {
			options: {
		    	shorthandCompacting: false,
		    	roundingPrecision: -1
		  	},
		  	target: {
		    	files: cssminFiles
		  	}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('loadTemplates', 'Generates templates.json from the module html templates', function() {

		// Get all the template content
		var templateContent = {};
		_.forEach(modulePaths, function(path, module) {
			templateContent[module] = {};
			var templates = fs.readdirSync(path);
			templates.forEach(function(template) {

				if(/\.html$/.test(template)) {
					var htmlContent = fs.readFileSync(path + '/' + template).toString('utf8');
					htmlContent = htmlContent.replace(/(\r\n|\n|\r|\t)/gm,"");
					templateContent[module][template] = htmlContent;
				}
			});
		});

		// Save the templates in templates.js
		fs.writeFileSync(simPath + 'templates.js', JSON.stringify(templateContent));


	});
	grunt.registerTask('default',['uglify', 'cssmin', 'loadTemplates']);
}