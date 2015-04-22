"use strict";


$(function() {
	
	function Field() {
			
		var module = this;
		
		this.title = 'Field';
		
		this.properties = {
			field_width: 27,
			field_length: 27,
			robot_width: 2,
			robot_length: 3,
			wheelbase: 2,
			wheel_width: .3,
			wheel_length: .7,
			pixels_per_foot: 13,
		};
		
		this.init = function() {

			var properties = this.properties;

			sim.robot.wheelbase = 2;
			sim.robot.x = properties.field_width / 2;
			sim.robot.y = 3;
			sim.add_js('physics/two-motor-drivetrain.js');
			this.physics = sim.physics_modules['two-motor-drivetrain'];

			//create field for robot to move around in
			var field = d3.select('#' + this.element.attr('id') + ' .field')
				.attr('width', properties.field_width * properties.pixels_per_foot)
				.attr('height', properties.field_length * properties.pixels_per_foot);
			
			//create robot
			var data = [sim.robot];
			var robot = field.selectAll('.robot').data(data);
			robot.enter().append('g')
				.attr('class', 'robot')
				.attr('transform', function(d) {
					var x = d.x * properties.pixels_per_foot;
					var y = (properties.field_length - d.y) * properties.pixels_per_foot;
					var transformation = 'translate(' + x + ',' + y + ')';
					
					//rotate robot based on starting angle
					var da = 90 - d.angle * (180 / Math.PI);
					transformation += ' rotate(' + da + ')';
					return transformation;
				});
				
			//add robot base centered on the origin
			robot.append('rect')
				.attr('class', 'base')
				.attr('width', properties.robot_width * properties.pixels_per_foot)
				.attr('height', properties.robot_length * properties.pixels_per_foot)
				.attr('x', -1 * (properties.robot_width * properties.pixels_per_foot) / 2)
				.attr('y', -1 * (properties.robot_length * properties.pixels_per_foot) / 2);
			
			robot.append('rect')
				.attr('class', 'base')
				.attr('width', properties.robot_width * properties.pixels_per_foot)
				.attr('height', 3)
				.attr('x', -1 * (properties.robot_width * properties.pixels_per_foot) / 2)
				.attr('y', -1 * (properties.robot_length * properties.pixels_per_foot) / 2)
				.style('fill', 'green');
			
			
			//add wheels
			var wheels = {
				top_left: {x: -properties.wheelbase / 2, y: -properties.wheelbase / 2},
				top_right: {x: properties.wheelbase / 2, y: -properties.wheelbase / 2},
				bottom_left: {x: -properties.wheelbase / 2, y: properties.wheelbase / 2},
				bottom_right: {x: properties.wheelbase / 2, y: properties.wheelbase / 2}
			};
			
			for(var pos in wheels) {
				var wheel = wheels[pos];
				robot.append('rect')
					.attr('class', 'wheel')
					.attr('x', (wheel.x - properties.wheel_width / 2) * properties.pixels_per_foot)
					.attr('y', (wheel.y - properties.wheel_length / 2) * properties.pixels_per_foot)
					.attr('width', properties.wheel_width * properties.pixels_per_foot)
					.attr('height', properties.wheel_length * properties.pixels_per_foot);
			}
			
			
		};
		
		this.set_data = function(data) {
			
			var data = [this.physics.robot];
			//update robot angle and position by creating a transition
			var field = d3.select('#' + this.element.attr('id') + ' .field');
			var robot = field.selectAll('.robot').data(data);
			var duration = sim.UPDATE_RATE;
			robot.transition()
				.duration(duration)
				.ease('linear')
				.attr('transform', function(d) {
					var x = d.x * properties.pixels_per_foot;
					var y = (properties.field_length - d.y) * properties.pixels_per_foot;
					var transformation = 'translate(' + x + ',' + y + ')';
					
					//rotate robot based on starting angle
					var dA = 90 - d.angle * (180 / Math.PI);
					transformation += ' rotate(' + dA + ')';
					return transformation;
				});
		}
		
	}

	sim.add_iomodule('field', Field, function(iomodule) {
		
		// Initialize the sliders
		iomodule.init();
		
		// Add to config modal

		var data = _.isObject(config.saved_config.field) ? config.saved_config.field : {};
		
		if(data.visible != 'y' && data.visible != 'n') {
			data.visible = 'y';
		}
		
		apply_config(data);
		
		// config form
		var html = config_modal.get_radio_group('Visible:', 'visible', true, [
	            { "label" : "Yes", "value" : "y" },
	            { "label" : "No", "value" : "n" }
			]);
		
		// Add category
		config_modal.add_category('field', {
			html: html,
			title : 'Field',
			onselect : function(form, data) {
				form.find('input[name=visible][value=' + data.visible + ']').prop('checked', true);
			},
			onsubmit : function(form, data) {
				
				data.visible = form.find('input[name=visible]:checked').val();

				apply_config(data);
			}
		}, data);
		
		function apply_config(data) {
			
			if(data.visible == 'y') {
				iomodule.element.removeClass('hidden');
			} else {
				iomodule.element.addClass('hidden');
			}			
		}
	});
	
	
	
});
	