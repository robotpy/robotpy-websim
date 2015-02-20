var simpleRobotModule = $('#simple-robot').ioModule('simple-robot', {
	title : 'Simple Robot',
	fieldWidth: 27,
	fieldLength: 27,
	robotWidth: 2,
	robotLength: 3,
	wheelbase: 2,
	wheelWidth: .3,
	wheelLength: .7,
	pixelsPerFoot: 13,
	init : function() {
		var module = this;
		this.physics = $.loadPhysicsModule('two_motor_drivetrain', {
			wheelbase: 2,
			x: module.fieldWidth / 2,
			y: 3
		});
		

		//create field for robot to move around in
		var field = d3.select('#simple-robot .field')
			.attr('width', module.fieldWidth * module.pixelsPerFoot)
			.attr('height', module.fieldLength * module.pixelsPerFoot);
		
		
		//create robot
		var data = [this.physics.robot];
		var robot = field.selectAll('.robot').data(data);
		robot.enter().append('g')
			.attr('class', 'robot')
			.attr('transform', function(d) {
				var x = d.x * module.pixelsPerFoot;
				var y = (module.fieldLength - d.y) * module.pixelsPerFoot;
				var transformation = 'translate(' + x + ',' + y + ')';
				
				//rotate robot based on starting angle
				var dA = 90 - d.angle * (180 / Math.PI);
				transformation += ' rotate(' + dA + ')';
				return transformation;
			});
			
		//add robot base centered on the origin
		robot.append('rect')
			.attr('class', 'base')
			.attr('width', module.robotWidth * module.pixelsPerFoot)
			.attr('height', module.robotLength * module.pixelsPerFoot)
			.attr('x', -1 * (module.robotWidth * module.pixelsPerFoot) / 2)
			.attr('y', -1 * (module.robotLength * module.pixelsPerFoot) / 2);
		
		robot.append('rect')
			.attr('class', 'base')
			.attr('width', module.robotWidth * module.pixelsPerFoot)
			.attr('height', 3)
			.attr('x', -1 * (module.robotWidth * module.pixelsPerFoot) / 2)
			.attr('y', -1 * (module.robotLength * module.pixelsPerFoot) / 2)
			.style('fill', 'green');
		
		
		//add wheels
		var wheels = {
			top_left: {x: -module.wheelbase / 2, y: -module.wheelbase / 2},
			top_right: {x: module.wheelbase / 2, y: -module.wheelbase / 2},
			bottom_left: {x: -module.wheelbase / 2, y: module.wheelbase / 2},
			bottom_right: {x: module.wheelbase / 2, y: module.wheelbase / 2}
		};
		
		for(pos in wheels) {
			var wheel = wheels[pos];
			robot.append('rect')
				.attr('class', 'wheel')
				.attr('x', (wheel.x - module.wheelWidth / 2) * module.pixelsPerFoot)
				.attr('y', (wheel.y - module.wheelLength / 2) * module.pixelsPerFoot)
				.attr('width', module.wheelWidth * module.pixelsPerFoot)
				.attr('height', module.wheelLength * module.pixelsPerFoot);
		}
		
		
	},
	
	getData : function(data) {

	},
	
	setData : function(data) {
		var module = this;
		var data = [this.physics.robot];
		//update robot angle and position by creating a transition
		var field = d3.select('#simple-robot .field');
		var robot = field.selectAll('.robot').data(data);
		var duration = $.getSimulatorValue('UPDATE_RATE');
		robot.transition()
			.duration(duration)
			.ease('linear')
			.attr('transform', function(d) {
				var x = d.x * module.pixelsPerFoot;
				var y = (module.fieldLength - d.y) * module.pixelsPerFoot;
				var transformation = 'translate(' + x + ',' + y + ')';
				
				//rotate robot based on starting angle
				var dA = 90 - d.angle * (180 / Math.PI);
				transformation += ' rotate(' + dA + ')';
				return transformation;
			});
	}
	
});
