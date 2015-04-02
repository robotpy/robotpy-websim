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

	
function Two_Motor_Drivetrain() {
	
	this.robot = {
    	l_motor_channel: 1,
    	r_motor_channel: 2,
    	wheelbase: 2,
    	speed: 5,
    	x: 0,
    	y: 0,
    	angle: Math.PI / 2,
    	fwd: 0.0,
    	rccw: 0.0
    };
	
	this.update = function(data, time_elapsed) {
		
		//motors
		var l_motor = data.pwm[sim.robot.l_motor_channel];
		var r_motor = data.pwm[sim.robot.r_motor_channel];	
		
		/*
		 * update position angle of robot using an equation
		 * that I derived and I have no idea if it is right
		 */
		
		if(Math.abs(sim.robot.rccw) < .00000001) {
			sim.robot.rccw = .00000001;
		}
		
		//the change in angle
		var da = time_elapsed * this.robot.rccw;
		
	
		
		
		//the distance traveled
		var distance = 2 * (this.robot.fwd / this.robot.rccw) * Math.sin(da / 2);
		//update x and y positions. If speed if right wheels > speed of left wheels, invert it
		this.robot.y += distance * Math.sin((Math.PI - da) / 2 + this.robot.angle - Math.PI / 2);
		var dx = distance * Math.cos((Math.PI - da) / 2 + this.robot.angle - Math.PI / 2);
		sim.robot.x += dx;
		//update angle
		
		sim.robot.angle += da;
		
		
		/*
		 * Set speed and rotation
		 */
			
		var l = -l_motor.value * this.robot.speed;
	    var r = r_motor.value * this.robot.speed;
	    

	    //Motion equations
	    sim.robot.fwd = (l + r) * 0.5;
	    sim.robot.rccw = (r - l) / this.robot.wheelbase;	    
	}
}

Two_Motor_Drivetrain.prototype = new Physics_Module();

sim.add_physics_module('two-motor-drivetrain', new Two_Motor_Drivetrain());	
