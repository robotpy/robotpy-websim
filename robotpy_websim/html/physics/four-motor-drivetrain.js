/**
 *  Four motors, each side chained together. The motion equations are
 *  as follows:
 *
 *      FWD = (L+R)/2
 *      RCW = (L-R)/W
 *  
 *   	L is forward speed of the left wheel(s), all in sync
 *   	R is forward speed of the right wheel(s), all in sync
 *  	W is wheelbase in feet
 *  
 *  If you called "SetInvertedMotor" on any of your motors in RobotDrive,
 *  then you will need to multiply that motor's value by -1.
 *  
 *  .. note: WPILib RobotDrive assumes that to make the robot go forward,
 *            the left motors must be set to -1, and the right to +1
 *  
 *  @param lr_motor:   Left rear motor value (-1 to 1); -1 is forward
 *  @param rr_motor:   Right rear motor value (-1 to 1); 1 is forward
 *  @param lf_motor:   Left front motor value (-1 to 1); -1 is forward
 *  @param rf_motor:   Right front motor value (-1 to 1); 1 is forward
 *  @param x_wheelbase: The distance in feet between right and left wheels.
 *  @param speed:      Speed of robot in feet per second (see above)
 *  
 *  @returns: speed of robot (ft/s), clockwise rotation of robot (radians/s)
 */
	
function Four_Motor_Drivetrain() {
	
	this.update = function(robot, elapsed_time) {
		 
	    var l = -(lf_motor + lr_motor) * 0.5 * speed;
	    var r = (rf_motor + rr_motor) * 0.5 * speed;
	    
	    //Motion equations
	    var fwd = (l + r) * 0.5;
	    var rcw = (l - r) / float(x_wheelbase);
	        
	    return this.drive(fwd, rcw, elapsed_time);
	};
}

Four_Motor_Drivetrain.prototype = new Physics_Module();

sim.add_physics_module('four-motor-drivetrain', new Four_Motor_Drivetrain());	
