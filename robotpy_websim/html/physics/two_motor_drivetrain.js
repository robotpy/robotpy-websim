/**
 * Two center-mounted motors with a simple drivetrain. The 
 *      motion equations are as follows::
 *   
 *          FWD = (L+R)/2
 *          RCCW = (R-L)/W
 *       
 *      * L is forward speed of the left wheel(s), all in sync
 *      * R is forward speed of the right wheel(s), all in sync
 *      * W is wheelbase in feet
 *      
 *      If you called "SetInvertedMotor" on any of your motors in RobotDrive,
 *      then you will need to multiply that motor's value by -1.
 *      
 *      .. note:: WPILib RobotDrive assumes that to make the robot go forward,
 *                the left motor must be set to -1, and the right to +1 
 *      
 *      @param l_motor    Left motor value (-1 to 1); -1 is forward
 *      @param r_motor    Right motor value (-1 to 1); 1 is forward
 *      @param wheelbase  Distance between wheels, in feet
 *      @param speed      Speed of robot in feet per second (see above)
 *      
 *      @returns speed of robot (ft/s), counter-clockwise rotation of robot (radians/s)
 */

$.addPhysicsModule('two_motor_drivetrain', {
	
	init: function(robot) {
	    this.robot = $.extend({
	    	l_motorChannel: 1,
	    	r_motorChannel: 2,
	    	wheelbase: 2,
	    	speed: 5,
	    	x: 0,
	    	y: 0,
	    	angle: Math.PI / 2,
	    	fwd: 0.0,
	    	rccw: 0.0
	    }, robot);
	},
	
	update: function(data, elapsedTime) {
		
		//motors
		var l_motor = data.pwm[this.robot.l_motorChannel];
		var r_motor = data.pwm[this.robot.r_motorChannel];	
		
		/*
		 * update position angle of robot using an equation
		 * that I derived and I have no idea if it is right
		 */
		
		if(Math.abs(this.robot.rccw) < .00000001) {
			this.robot.rccw = .00000001;
		}
		
		//the change in angle
		var deltaA = elapsedTime * this.robot.rccw;
		
	
		
		
		//the distance traveled
		var distance = 2 * (this.robot.fwd / this.robot.rccw) * Math.sin(deltaA / 2);
		//update x and y positions. If speed if right wheels > speed of left wheels, invert it
		this.robot.y += distance * Math.sin((Math.PI - deltaA) / 2 + this.robot.angle - Math.PI / 2);
		var dx = distance * Math.cos((Math.PI - deltaA) / 2 + this.robot.angle - Math.PI / 2);
		this.robot.x += dx;
		//update angle
		
		this.robot.angle += deltaA;
		
		
		/*
		 * Set speed and rotation
		 */
			
		var l = -l_motor.value * this.robot.speed;
	    var r = r_motor.value * this.robot.speed;
	    

	    //Motion equations
	    this.robot.fwd = (l + r) * 0.5;
	    this.robot.rccw = (r - l) / this.robot.wheelbase;	    
	}
}); 

		