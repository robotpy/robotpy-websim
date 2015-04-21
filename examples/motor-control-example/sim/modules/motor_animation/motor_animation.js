"use strict";

$(function() {
	
	function MotorAnimation() {
		
		var module = this;
		this.motor_pos = null;
		this.title = "Motor Animation";
		
		var svg_line = $('#motor_svg line');
		
		
		this.modify_data_to_server = function(data_to_server, enabled) {
			if (enabled)
				data_to_server.encoder[0].count = module.motor_pos;
		};
		
		this.update_interface = function(data_from_server){
			
			// TODO: this needs to survive a page refresh
			
			// TODO: make the motor/encoder values configurable
			if (module.motor_pos == null)
				module.motor_pos = data_from_server.encoder[0].count;
			
			module.motor_pos += (data_from_server.pwm[0].value*30); 
			
			// update the animation here
			var encoder_val = data_from_server.encoder[0].count/4; 
			
			svg_line.attr('transform', "rotate(" + (encoder_val % 360) + " 100, 100)")
			$('#encoder_value').text(encoder_val);
		};
	}
	
	MotorAnimation.prototype = new IOModule();
	
	
	// Load content -- TODO: this is mostly boilerplate, make it simpler!
	$.get('user/modules/motor_animation/motor_animation.html', function(content) {
		
		// Add the content
		$('<div id="motor_animation">' + content + '</div>').appendTo('body');
		
		var iomodule = new MotorAnimation();

		if(!sim.add_iomodule('motor_animation', iomodule)) {
			return;
		}
		
		// Add css
		sim.add_css('user/modules/motor_animation/motor_animation.css');
	});
	
});