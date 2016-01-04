

/*
 * Animation
 */
(function(sim) {

	var animationQueue = {};
		lastTime = 0;

	function animate(timestamp) {

		requestAnimationFrame(animate);
		
		// Update interface and perform animation
		var dt = timestamp - lastTime;
		lastTime = timestamp;
		sim.events.trigger('interfaceUpdate', [dt/1000, timestamp]);

		var queueCopy = _.assign(animationQueue);
		animationQueue = {};
		_.forEach(queueCopy, function(callback) {
			callback();
		});
	}

	requestAnimationFrame(animate);



	sim.animation = {
		queue : function(id, callback) {
			animationQueue[id] = callback;
		},
		inQueue : function(id) {
			return id in animationQueue;
		}
	};


})(window.sim = window.sim || {});