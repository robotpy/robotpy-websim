

/*
 *	Draggable
 */
(function(sim) {



	// Contains a list of draggable elements. The keys are unique id's that represent the modules
	var draggables = {};


	function Draggable($el, settings) {
		this.$el = $el,
		settings = settings || {},
		this.order = settings.order || 0,
		this.position = settings.position,
		this.id = _.uniqueId();

		$el.attr('data-draggable-id', this.id);
	}

	Draggable.prototype.setPosition = function(x, y) {
		this.$el.css({
			left : x,
			top : y
		});
	};

	Draggable.prototype.setOrder = function(x, y) {

	};


	// Draggable currently being dragged
	var beingDragged = null;

	$('[data-draggable-id]').on('mousedown', function(e) {
		var $el = $(this),
			id = $el.data('draggable-id'),
			draggable = draggables[id];

		beingDragged = {
			id : id,
			draggable : draggable,
			draggableX : draggable.$el.offset().left,
			draggableY : draggable.$el.offset().top,
			startX : e.pageX,
			startY : e.pageY
		};
	});

	$(window).on('mousemove', function(e) {
		if(beingDragged === null) {
			return;
		}

		var draggable = beingDragged.draggable,
			dx = e.pageX - beingDragged.startX,
			dy = e.pageY - beingDragged.startY,
			newX = beingDragged.draggableX + dx,
			newY = beingDragged.draggableY + dy;


		if(!sim.animation.inQueue('dragModule')) {
			if(sim.userConfig.data.layout == 'absolute') {
				sim.animation.queue('dragModule', function() {
					draggable.setPosition(newX, newY);
				});
			} else {
				sim.animation.queue('dragModule', function() {
					draggable.setOrder(newX, newY);
				});
			}
		}
		
	}).on('mouseup', function(e) {
		beingDragged = null;
	});

	sim.draggable = {
		init : function($el, settings) {
			var draggable = new Draggable($el, settings);
			draggables[draggable.id] = draggable;
		}
	};

})(window.sim = window.sim || {});