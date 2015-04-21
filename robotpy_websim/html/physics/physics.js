function Physics_Module() {
	
	// The fields needed to represent the robot
	this.robot = {};
	
	// Function that's called to initialize the physics module
	this.init = function() {};
	
	// Called periodically to update the physics module
	this.update = function(data_from_server, time_elapsed) {};
	
	/**
	 * Use this to get change in x, y, and angle
     * 
     * @param speed:           Speed of robot in ft/s
     * @param rotation_speed:  Clockwise rotational speed in radians/s
     * @param elapsed_time:    Amount of time speed was traveled (this is the 
     *                         same value that was passed to update_sim)
	 */
	 this.drive = function(speed, rotation_speed, elapsed_time) {
		 
        var distance = speed * elapsed_time; 
        var angle = rotation_speed * elapsed_time;
        
        var x = distance * Math.cos(angle);
        var y = distance * Math.sin(angle);
        
        return { 'x' : x, 'y' : y, 'angle' : angle};
	 }
	 
	 /**
	  * Use this to get change in x, y, and angle.
	  * 
	  * This moves the robot using a vector relative to the robot
	  * instead of by speed/rotation speed.
	  *    
	  * @param vx: 				Speed in x direction relative to robot in ft/s
	  * @param vy: 				Speed in y direction relative to robot in ft/s
	  * @param vw: 				Clockwise rotational speed in rad/s
	  * @param elapsed_time:	Amount of time speed was traveled
	  */
	 this.vector_drive = function(vx, vy, vw, elapsed_time) {
	        
		 var angle = vw * elapsed_time;
		 vx = (vx * elapsed_time);
		 vy = (vy * elapsed_time);

		 var x = vx * Math.sin(angle) + vy * Math.cos(angle);
		 var y = vx * Math.cos(angle) + vy * Math.sin(angle);
        
		 return { 'x' : x, 'y' : y, 'angle' : angle};
	 }
	 
	 // Gets the motor speed of a CAN device
	 this.get_can_value = function(device_number) {
		 
		 var device = sim.data_from_server.CAN[device_number];
		 
		 if(device) {
			 return device.value;
		 }
		 
		 return 0;
	 };
	 
	 // Gets a PWM motor speed
	 this.get_pwm_value = function(channel) {
		 
		 var pwm = sim.data_from_sever.pwn[channel];
		 
		 if(pwm) {
			 return pwm.value;
		 }
		 
		 return 0;
	 };
	 
}