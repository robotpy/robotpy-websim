
/*
 * Templates
 */
(function(sim) {

	sim.templates = {};
	sim.compileTemplate = {
		handlebars : function(templateContent, data) {
			var template = Handlebars.compile(templateContent);
			return template(data);
		},
		lodash : function(templateContent, data) {
			var template = _.template(templateContent)
			return template(data);
		}
	};


})(window.sim = window.sim || {});