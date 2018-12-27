
/**
 * Real motors won't actually move unless you give them some minimum amount
 * of input. This computes an output speed for a motor and causes it to
 * 'not move' if the input isn't high enough. Additionally, the output is
 * adjusted linearly to compensate.
 * 
 * Example: For a deadzone of 0.2:
 * 
 *  Input of 0.0 will result in 0.0
 *  Input of 0.2 will result in 0.0
 *  Input of 0.3 will result in ~0.12
 *  Input of 1.0 will result in 1.0
 * 
 * This returns a function that computes the deadzone. You should pass the
 * returned function to one of the drivetrain simulation functions as the
 * ``deadzone`` parameter.
 *       
 * @param {*} deadzone 
 */
export const linearDeadzone = (deadzone) => {
  if (deadzone <= 0 || deadzone >= 1) {
    throw new Error('deadzone must be a value between 0 and 1');
  }
  let scaleParam = 1.0 - deadzone;

  return (motorInput) => {
    let absMotorInput = Math.abs(motorInput);

    if (absMotorInput < deadzone) {
      return 0.0;
    }
    else {
      let sign = motorInput >= 0 ? 1 : -1;
      return (absMotorInput - deadzone) / scaleParam * sign;
    }
  };
}


/**
 * Two center-mounted motors with a simple drivetrain. The
 * motion equations are as follows:
 *   
 *  FWD = (L+R)/2
 *  RCW = (L-R)/W
 *       
 *    L is forward speed of the left wheel(s), all in sync
 *    R is forward speed of the right wheel(s), all in sync
 *    W is wheelbase in feet
 *       
 *  If you called "SetInvertedMotor" on any of your motors in RobotDrive,
 *  then you will need to multiply that motor's value by -1.
 *       
 *  @note: WPILib RobotDrive assumes that to make the robot go forward,
 *  the left motor must be set to -1, and the right to +1
 */
export class TwoMotor {

  /**
   * 
   * @param {*} xWheelbase - The distance in feet between right and left wheels.
   * @param {*} speed - Speed of robot in feet per second (see above)
   * @param {*} deadzone - A function that adjusts the output of the motor (see :func:`linear_deadzone`)
   */
  constructor(xWheelbase = 2, speed = 5, deadzone = null) {
    this.xWheelbase = xWheelbase;
    this.speed = speed;
    this.deadzone = deadzone;

    // Use these to compute encoder data after calling getVector
    this.lSpeed = 0
    this.rSpeed = 0
  }

  /**
   * Given motor values, retrieves the vector of (distance, speed) for your robot
   * 
   * @param {*} lMotor - Left motor value (-1 to 1); -1 is forward
   * @param {*} rMotor - Right motor value (-1 to 1); 1 is forward
   */
  getVector(lMotor, rMotor) {

    if (this.deadzone) {
      lMotor = this.deadzone(lMotor);
      rMotor = this.deadzone(rMotor);
    }

    let l = -lMotor * this.speed;
    let r = rMotor * this.speed;

    // Motion equations
    let fwd = (l + r) * 0.5;
    let rcw = (l - r) / this.xWheelbase;

    this.lSpeed = l;
    this.rSpeed = r;

    return {
      fwd,
      rcw
    };
  }
}


/**
 * Four motors, each side chained together. The motion equations are
 * as follows:
 *   
 *  FWD = (L+R)/2
 *  RCW = (L-R)/W
 *       
 *    L is forward speed of the left wheel(s), all in sync
 *    R is forward speed of the right wheel(s), all in sync
 *    W is wheelbase in feet
 *       
 *  If you called "SetInvertedMotor" on any of your motors in RobotDrive,
 *  then you will need to multiply that motor's value by -1.
 *       
 *  @note: WPILib RobotDrive assumes that to make the robot go forward,
 *  the left motors must be set to -1, and the right to +1
 *       
 */
  
export class FourMotorDrivetrain {
  
  /**
   * 
   * @param {*} xWheelbase - The distance in feet between right and left wheels.
   * @param {*} speed - Speed of robot in feet per second (see above)
   * @param {*} deadzone - A function that adjusts the output of the motor (see :func:`linear_deadzone`)
   */
  constructor(xWheelbase = 2, speed = 5, deadzone = null) {
    this.xWheelbase = xWheelbase;
    this.speed = speed;
    this.deadzone = deadzone;

      // Use these to compute encoder data after calling getVector
      this.lSpeed = 0
      this.rSpeed = 0
  }

  /**
   * 
   * @param {*} lrMotor - Left rear motor value (-1 to 1); -1 is forward
   * @param {*} rrMotor - Right rear motor value (-1 to 1); 1 is forward
   * @param {*} lfMotor - Left front motor value (-1 to 1); -1 is forward
   * @param {*} rfMotor - Right front motor value (-1 to 1); 1 is forward
   * 
   * @returns {Object} - speed of robot (ft/s), clockwise rotation of robot (radians/s)
   */
  getVector(lrMotor, rrMotor, lfMotor, rfMotor) {

    if (this.deadzone) {
      lfMotor = this.deadzone(lfMotor);
      lrMotor = this.deadzone(lrMotor);
      rfMotor = this.deadzone(rfMotor);
      rrMotor = this.deadzone(rrMotor);
    }

    let l = -(lfMotor + lrMotor) * 0.5 * this.speed;
    let r = (rfMotor + rrMotor) * 0.5 * this.speed;

    // Motion equations
    let fwd = (l + r) * 0.5;
    let rcw = (l - r) / self.xWheelbase;

    this.lSpeed = l;
    this.rSpeed = r;
  
    return {
      fwd, 
      rcw
    };
  }
}


/**
 * Four motors, each with a mechanum wheel attached to it.
 *      
 * If you called "SetInvertedMotor" on any of your motors in RobotDrive,
 * then you will need to multiply that motor's value by -1.
 *       
 * @note: WPILib RobotDrive assumes that to make the robot go forward,
 * all motors are set to +1
 */
export class MecanumDrivetrain {

  /**
   * 
   * @param {*} xWheelbase - The distance in feet between right and left wheels.
   * @param {*} yWheelbase - The distance in feet between forward and rear wheels.
   * @param {*} speed - Speed of robot in feet per second (see above)
   * @param {*} deadzone - A function that adjusts the output of the motor (see :func:`linear_deadzone`)
   */
  constructor(xWheelbase = 2, yWheelbase = 3, speed = 5, deadzone = null) {
      this.xWheelbase = xWheelbase;
      this.yWheelbase = yWheelbase;
      this.speed = speed;
      this.deadzone = deadzone;

      // Use this to compute encoder data after get_vector is called
      this.lrSpeed = 0;
      this.rrSpeed = 0;
      this.lfSpeed = 0;
      this.rfSpeed = 0;
  }

  /**
   * Given motor values, retrieves the vector of (distance, speed) for your robot
   * 
   * @param {*} lrMotor - Left rear motor value (-1 to 1); 1 is forward
   * @param {*} rrnotor - Right rear motor value (-1 to 1); 1 is forward
   * @param {*} lfNotor - Left front motor value (-1 to 1); 1 is forward
   * @param {*} rfMotor - Right front motor value (-1 to 1); 1 is forward
   * 
   * @returns {Object} - Speed of robot in x (ft/s), Speed of robot in y (ft/s),
                    clockwise rotation of robot (radians/s)
    */
  getVector(lrMotor, rrMotor, lfMotor, rfMotor) {
    /*
     * From http://www.chiefdelphi.com/media/papers/download/2722 pp7-9
     * [F] [omega](r) = [V]
     *
     * F is
     * .25  .25  .25 .25
     * -.25 .25 -.25 .25
     * -.25k -.25k .25k .25k
     *
     * omega is
     * [lf lr rr rf]
     */

    if (this.deadzone) {
      lfMotor = this.deadzone(lfMotor);
      lrMotor = this.deadzone(lrMotor);
      rfMotor = this.deadzone(rfMotor);
      rrMotor = this.deadzone(rrMotor);
    }

    // Calculate speed of each wheel
    let lr = lrMotor * this.speed;
    let rr = rrMotor * this.speed;
    let lf = lfMotor * this.speed;
    let rf = rfMotor * this.speed;

    // Calculate K
    let k = Math.abs(this.xWheelbase / 2.0) + Math.abs(this.yWheelbase / 2.0);

    // Calculate resulting motion
    let Vy = 0.25 * (lf + lr + rr + rf);
    let Vx = 0.25 * (lf + -lr + rr + -rf);
    let Vw = (0.25 / k) * (lf + lr + -rr + -rf);

    this.lrSpeed = lr;
    this.rrSpeed = rr;
    this.lfSpeed = lf;
    this.rfSpeed = rf;

    return {
      Vx,
      Vy, 
      Vw
    };
  }
}



export class FourMotorSwerveDrivetrain {

  /**
   * 
   * @param {*} xWheelbase - The distance in feet between right and left wheels.
   * @param {*} yWheelbase - The distance in feet between forward and rear wheels.
   * @param {*} speed - Speed of robot in feet per second (see above)
   * @param {*} deadzone - A function that adjusts the output of the motor (see :func:`linear_deadzone`)
   */
  constructor(xWheelbase = 2, yWheelbase = 2, speed = 5, deadzone = null) {
    this.xWheelbase = xWheelbase;
    this.yWheelbase = yWheelbase;
    this.speed = speed;
    this.deadzone = deadzone;
  }

  /**
   * Four motors that can be rotated in any direction
   *     
   * If any motors are inverted, then you will need to multiply that motor's
   * value by -1.
   * 
   * @param {*} lrMotor - Left rear motor value (-1 to 1); 1 is forward
   * @param {*} rrMotor - Right rear motor value (-1 to 1); 1 is forward
   * @param {*} lfMotor - Left front motor value (-1 to 1); 1 is forward
   * @param {*} rfMotor - Right front motor value (-1 to 1); 1 is forward
   * @param {*} lrAngle - Left rear motor angle in degrees (0 to 360 measured clockwise from forward position)
   * @param {*} rrAngle - Right rear motor angle in degrees (0 to 360 measured clockwise from forward position)
   * @param {*} lfAngle - Left front motor angle in degrees (0 to 360 measured clockwise from forward position)
   * @param {*} rfAngle - Right front motor angle in degrees (0 to 360 measured clockwise from forward position)
   * 
   * @returns {Object} - Speed of robot in x (ft/s), Speed of robot in y (ft/s),
                  clockwise rotation of robot (radians/s)
   */
  getVector(lrMotor, rrMotor, lfMotor, rfMotor, lrAngle, rrAngle, lfAngle, rfAngle) {
    if (this.deadzone) {
      lfMotor = this.deadzone(lfMotor);
      lrMotor = this.deadzone(lrMotor);
      rfMotor = this.deadzone(rfMotor);
      rrMotor = this.deadzone(rrMotor);
    }

    // Calculate speed of each wheel
    let lr = lrMotor * speed;
    let rr = rrMotor * speed;
    let lf = lfMotor * speed;
    let rf = rfMotor * speed;

    // Calculate angle in radians
    let lrRad = lrAngle * Math.PI / 180;
    let rrRad = rrAngle * Math.PI / 180;
    let lfRad = lfAngle * Math.PI / 180;
    let rfRad = rfAngle * Math.PI / 180;

    // Calculate wheelbase radius
    wheelbaseRadius = Math.hypot(this.xWheelbase / 2.0, this.yWheelbase / 2.0);

    // Calculates the Vx and Vy components
    // Sin an Cos inverted because forward is 0 on swerve wheels
    let Vx = (
      (Math.sin(lrRad) * lr)
      + (Math.sin(rrRad) * rr)
      + (Math.sin(lfRad) * lf)
      + (Math.sin(rfRad) * rf)
    );

    let Vy = (
      (Math.cos(lrRad) * lr)
      + (Math.cos(rrRad) * rr)
      + (Math.cos(lfRad) * lf)
      + (Math.cos(rfRad) * rf)
    );

    // Adjusts the angle corresponding to a diameter that is perpendicular to the radius (add or subtract 45deg)
    lrRad = (lrRad + (Math.PI / 4)) % (2 * Math.PI);
    rrRad = (rrRad - (Math.PI / 4)) % (2 * Math.PI);
    lfRad = (lfRad - (Math.PI / 4)) % (2 * Math.PI);
    rfRad = (rfRad + (Math.PI / 4)) % (2 * Math.PI);

    // Finds the rotational velocity by finding the torque and adding them up
    let Vw = wheelbase_radius * (
      (Math.cos(lrRad) * lr)
      + (Math.cos(rrRad) * -rr)
      + (Math.cos(lfRad) * lf)
      + (Math.cos(rfRad) * -rf)
    );

    Vx *= 0.25;
    Vy *= 0.25;
    Vw *= 0.25;

    return {
      Vx, 
      Vy, 
      Vw
    };
  }
}

