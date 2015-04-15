"use strict";

var animation = new function() {
	
	this.get_angle = function(x, y) {
		
		var angle = Math.atan(y / x);
		
		if(x < 0) {
			angle += Math.PI;
		}
		
		return angle;
	};
	
	this.get_distance = function(x1, y1, x2, y2) {
		return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	};
	
	
	
	// Moves an element along a straight path
	this.linear_motion = function(selector, x, y, duration) {
		
		d3.select(selector).transition()
			.duration(duration)
			.ease('linear')
			.style('left', x + 'px')
			.style('top', y + 'px');
		
	};
	
	// Moves an element along a circular path
	this.circular_motion = function(selector, center_x, center_y, rotate, duration) {
		
		// Convert to radians
		rotate = rotate / (180 / Math.PI);
		
		var $element = $(selector);
		var x = $element.position().left;
		var y = $element.position().top;
		
		var radius = this.get_distance(center_x, center_y, x, y);
		var angle = this.get_angle(x - center_x, center_y - y);

		function x_axis(center_x, radius, start_angle, target_angle) {
			
			return function(t) {		
				// calculate current angle
				var angle = start_angle + t * (target_angle - start_angle);			
				var x = center_x + radius * Math.cos(angle);
				return x + 'px';
			}
		}
		
		function y_axis(center_y, radius, start_angle, target_angle) {
			
			return function(t) {
				
				// calculate current angle
				var angle = start_angle + t * (target_angle - start_angle);			
				var y = center_y - radius * Math.sin(angle);
				return y + 'px';
			}
		}
		
		d3.select(selector).transition()
			.duration(duration)
			.ease('linear')
			.styleTween('left', function() { return x_axis(center_x, radius, angle, angle + rotate) } )
			.styleTween('top', function() { return y_axis(center_y, radius, angle, angle + rotate) } );
		
	};
	
	this.rotate = function(selector, rotate, duration) {
		
		var current_angle = get_transform_rotate_angle(selector);

		var new_angle = current_angle - rotate;
		
		function rotate_angle(start_angle, end_angle) {
			return function(t) {
				var angle = start_angle + t * (end_angle - start_angle);
				return 'rotate(' + angle + 'deg' + ')';
			}
		}
		
		d3.select(selector).transition()
			.duration(duration)
			.ease('linear')
			.styleTween('transform', function() { return rotate_angle(current_angle, new_angle) } );
		
	};
	
	function get_transform_rotate_angle(selector) {
		
		var $obj = $(selector);
	    var matrix = $obj.css("-webkit-transform") ||
	    $obj.css("-moz-transform")    ||
	    $obj.css("-ms-transform")     ||
	    $obj.css("-o-transform")      ||
	    $obj.css("transform");
	    if(matrix !== 'none') {
	        var values = matrix.split('(')[1].split(')')[0].split(',');
	        var a = values[0];
	        var b = values[1];
	        var angle = Math.atan2(b, a);
	    } else { 
	    	var angle = 0; 
	    }
	    
	    if(angle < 0) {
	    	angle += Math.PI * 2;
	    }
	    
	    return angle * 180 / Math.PI;
	}

	
}

