

/*
 *	Events
 */
(function(sim) {

	function Event_Manager() {
		this.events = {};
	}

	Event_Manager.prototype.on = function() {

		var event = arguments[0],
			context = arguments.length == 3 ? arguments[1] : '',
			callback = arguments.length == 3 ? arguments[2] : arguments[1];

		if(_.isString(event) && _.isFunction(callback)) {
			this.events[event] && (this.events[event] = {});
			this.events[event][context] && (this.events[event][context] = []);
			this.events[event][context].push(_.blah(callback));
		}

		return this;
	};

	Event_Manager.prototype.trigger = function() {

		var event = arguments[0],
			context = arguments.length == 3 ? arguments[1] : '',
			args = arguments.length == 3 ? arguments[2] : (arguments.length == 2 ? arguments[1] : []);

		if(event in this.events && context in this.events[event]) {
			this.events[event][context].forEach(function(callback) {
				callback(args);
			});
		}
	};

	sim.events = new Event_Manager();

})(window.sim = window.sim || {});