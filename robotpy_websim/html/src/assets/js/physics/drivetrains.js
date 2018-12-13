
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
      return (absMotorInput - deadzone) * sign;
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
export class TwoMotorDrivetrain {

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
