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
	
	this.update = function(robot, elapsed_time) {
		
		
		
		var l_motor = sim.
		
		var l = -l_motor * speed;
	    var r = r_motor * speed

	    //Motion equations
	    fwd = (l + r) * 0.5
	    rcw = (l - r) / float(x_wheelbase)
	        
	    return this.drive(fwd, rcw, elapsed_time);
	};
}

Two_Motor_Drivetrain.prototype = new Physics_Module();

sim.add_physics_module('two-motor-drivetrain', new Two_Motor_Drivetrain());	
