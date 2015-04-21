/**
 *
 *	Four motors, each with a mechanum wheel attached to it.
 *      
 *  If you called "SetInvertedMotor" on any of your motors in RobotDrive,
 *  then you will need to multiply that motor's value by -1.
 *      
 *  .. note: WPILib RobotDrive assumes that to make the robot go forward,
 *                all motors are set to +1
 *      
 *  @param lr_motor:   Left rear motor value (-1 to 1); 1 is forward
 *  @param rr_motor:   Right rear motor value (-1 to 1); 1 is forward
 *  @param lf_motor:   Left front motor value (-1 to 1); 1 is forward
 *  @param rf_motor:   Right front motor value (-1 to 1); 1 is forward
 *  @param x_wheelbase: The distance in feet between right and left wheels.
 *  @param y_wheelbase: The distance in feet between forward and rear wheels.
 *  @param speed:      Speed of robot in feet per second (see above)
 *      
 *  @returns: Speed of robot in x (ft/s), Speed of robot in y (ft/s), 
 *                clockwise rotation of robot (radians/s)
 */ 
	
function Mecanum_Drivetrain() {
	
	this.update = function(robot, elapsed_time) {
		 
		//
	    // From http://www.chiefdelphi.com/media/papers/download/2722 pp7-9
		// [F] [omega](r) = [V]
	    //
	    // F is
	    // .25  .25  .25 .25
	    // -.25 .25 -.25 .25
	    // -.25k -.25k .25k .25k
	    //
	    // omega is
	    // [lf lr rr rf]

	    // Calculate speed of each wheel
	    var lr = lr_motor * speed;
	    var rr = rr_motor * speed;
	    var lf = lf_motor * speed;
	    var rf = rf_motor * speed;

	    // Calculate K
	    var k = Math.abs(x_wheelbase/2) + Math.abs(y_wheelbase/2);

	    // Calculate resulting motion
	    var Vy = .25 * (lf + lr + rr + rf);
	    var Vx = .25 * (lf + -lr + rr + -rf);
	    var Vw = (.25/k) * (lf + lr + -rr + -rf);
	    
	    return this.vector_drive(Vx, Vy, Vw, elapsed_time);
	};
}

Mecanum_Drivetrain.prototype = new Physics_Module();

sim.add_physics_module('mecanum-drivetrain', new Mecanum_Drivetrain());	