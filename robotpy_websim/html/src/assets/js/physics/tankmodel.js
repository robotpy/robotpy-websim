
// default parameters for a kitbot
const _bumperLength = 3.25 / 12;

let _kitbotWheelbase = 21 / 12;
let _kitbotWidth = _kitbotWheelbase + _bumperLength * 2;
let _kitbotLength = 30 / 12 + _bumperLength * 2;



/**
 * Motor model used by the :class:`TankModel`. You should not need to create
 * this object if you're using the :class:`TankModel` class.
 */
export class MotorModel {

  /**
   * 
   * @param {*} motorConfig - The specification data for your motor
   * @param {*} kv - Computed ``kv`` for your robot
   * @param {*} ka - Computed ``ka`` for your robot
   * @param {*} vintercept - The minimum voltage required to generate enough
   *                         torque to overcome steady-state friction (see the
   *                         paper for more details)
   */

  // @units.wraps(None, (None, None, "tm_kv", "tm_ka", "volts"))
  constructor(motorConfig, kv, ka, vintercept) {
    // Current computed acceleration (in ft/s^2)
    this.acceleration = 0;

    // Current computed velocity (in ft/s)
    this.velocity = 0;

    // Current computed position (in ft)
    this.position = 0;

    this._nominalVoltage = motorConfig.nominalVoltage;
    this._vintercept = vintercept;
    this._kv = kv;
    this._ka = ka;
  }

  /**
   * 
   * @param {*} motorPct - Percentage of power for motor in range [1..-1]
   * @param {*} tmDiff - Time elapsed since this function was last called
   */
  compute(motorPct, tmDiff) {
    let appliedVoltage = this._nominalVoltage * motorPct;
    let appliedVoltageSign = appliedVoltage >= 0 ? 1 : -1;
    appliedVoltage = Math.max(Math.abs(appliedVoltage) - this._vintercept, 0) * appliedVoltageSign; 

    // Heun's method (taken from Ether's drivetrain calculator)
    // -> yn+1 = yn + (h/2) (f(xn, yn) + f(xn + h, yn +  h f(xn, yn)))
    let a0 = this.acceleration;
    let v0 = this.velocity;

    // initial estimate for next velocity/acceleration
    let v1 = v0 + a0 * tmDiff;
    let a1 = (appliedVoltage - this._kv * v1) / this._ka;

    // corrected trapezoidal estimate
    v1 = v0 + (a0 + a1) * 0.5 * tmDiff;
    a1 = (appliedVoltage - this._kv * v1) / this._ka;
    this.position += (v0 + v1) * 0.5 * tmDiff;

    this.velocity = v1;
    this.acceleration = a1;

    return this.velocity;
  }
}


/**
 * This is a model of a FRC tankdrive-style drivetrain that will provide
 * vaguely realistic motion for the simulator.
 *   
 * This drivetrain model makes a number of assumptions:
 *       
 * - N motors per side
 * - Constant gearing
 * - Motors are geared together
 * - Wheels do not 'slip' on the ground
 * - Each side of the robot moves in unison
 *   
 * There are two ways to construct this model. You can use the theoretical
 * model via :func:`TankModel.theory` and provide robot parameters
 * such as gearing, total mass, etc.
 *       
 * Alternatively, if you measure ``kv``, ``ka``, and ``vintercept`` as
 * detailed in the paper mentioned above, you can plug those values in
 * directly instead using the :class:`TankModel` constructor instead. For
 * more information about measuring your own values, see the paper and
 * `this thread on ChiefDelphi <https://www.chiefdelphi.com/forums/showthread.php?t=161539>`_.
 *       
 * @note: You must specify the You can use whatever units you would like to specify the input
 *        parameter for your robot, RobotPy will convert them all
 *        to the correct units for computation.
 *                 
 *        Output units for velocity and acceleration are in ft/s and
 *        ft/s^2
 *
 *
 * Example usage for a 90lb robot with 2 CIM motors on each side with 6 inch
 * wheels:
 * 
 */
export class TankModel {


  /**
   * Use the constructor if you have measured ``kv``, ``ka``, and
   * ``Vintercept`` for your robot. Use the :func:`.theory` function
   * if you haven't.
   * 
   * ``Vintercept`` is the minimum voltage required to generate enough
   * torque to overcome steady-state friction (see the paper for more
   * details).
   * 
   * The robot width/length is used to compute the moment of inertia of
   * the robot. Don't forget about bumpers!
   * 
   * @param {*} motorConfig - Motor specification
   * @param {*} robotMass - Mass of robot
   * @param {*} xWheelbase - Wheelbase of the robot
   * @param {*} robotWidth - Width of the robot
   * @param {*} robotLength - Length of the robot
   * @param {*} lKv - Left side ``kv``
   * @param {*} lKa - Left side ``ka``
   * @param {*} lVi - Left side ``Vintercept``
   * @param {*} rKv - Right side ``kv``
   * @param {*} rKa - Right side ``ka``
   * @param {*} rVi - Right side ``Vintercept``
   * @param {*} timestep - Model computation timestep
   */
  constructor(
    motorConfig,
    robotMass,
    xWheelbase,
    robotWidth,
    robotLength,
    lKv,
    lKa,
    lVi,
    rKv,
    rKa,
    rVi,
    timestep = 5,
  ) {

    this._lmotor = new MotorModel(motorConfig, lKv, lKa, lVi)
    this._rmotor = new MotorModel(motorConfig, rKv, rKa, rVi)

    this.inertia = (1 / 12.0) * robotMass * (Math.pow(robotLength, 2) + Math.pow(robotWidth, 2));

    // This is used to compute the rotational velocity
    this._bm = (xWheelbase / 2.0) * robotMass;

    this._timestep = timestep * 100
  }

  // The velocity of the left side (in ft/s)
  get lVelocity() {
    return this._lmotor.velocity;
  }
  
  // The velocity of the right side (in ft/s)
  get rVelocity() {
    return this._rmotor.velocity;
  }

  // The linear position of the left side wheel (in feet)
  get lPosition() {
    return this._lmotor.position;
  }

  // The linear position of the right side wheel (in feet)
  get rPosition() {
    return this._rmotor.position;
  }

  /**
   * The model computes a moment of inertia for your robot based on the
   * given mass and robot width/length. If you wish to use a different
   * moment of inertia, set this property after constructing the object
   * 
   * Units are ``[mass] * [length] ** 2``
   */
  get inertia() {
    return this._inertia;
  }

  set inertia(value) {
    this._inertia = value;
  }


  /**
   * 
   * @param {*} lMotor - Left motor value (-1 to 1); -1 is forward
   * @param {*} rMotor - Right motor value (-1 to 1); 1 is forward
   * @param {*} tmDiff - Elapsed time since last call to this function
   * 
   * @note: If you are using more than 2 motors, it is assumed that
   *        all motors on each side are set to the same speed. Only
   *        pass in one of the values from each side
   */
  getVector(lMotor, rMotor, tmDiff) {

    let l = this._lmotor.compute(-lMotor, tmDiff)
    let r = this._rmotor.compute(rMotor, tmDiff)

    // Tank drive motion equations
    let fwd = (l + r) * 0.5;

    // Thanks to Tyler Veness for fixing the rotation equation, via conservation
    // of angular momentum equations
    // -> omega = b * m * (l - r) / J
    let rcw = this._bm * (l - r) / this._inertia;

    return {
      fwd,
      rcw
    };
  }
}

/**
 * Use this to create the drivetrain model when you haven't measured
 * ``kv`` and ``ka`` for your robot.
 * @param motorConfig - Specifications for your motor
 * @param robotMass - Mass of the robot
 * @param gearing - Gear ratio .. so for a 10.74:1 ratio, you would pass 10.74
 * @param nmotors - Number of motors per side
 * @param xWheelbase - Wheelbase of the robot
 * @param robotWidth - Width of the robot
 * @param robotLength - Length of the robot
 * @param wheelDiameter - Diameter of the wheel
 * @param vintercept - The minimum voltage required to generate enough
 *                     torque to overcome steady-state friction (see the
 *                     paper for more details)
 * @param timestep - Model computation timestep
 * 
 * :math:`\omega_{free}` is the free speed of the motor
 * :math:`\tau_{stall}` is the stall torque of the motor
 * :math:`n` is the number of drive motors
 * :math:`m_{robot}` is the mass of the robot
 * :math:`d_{wheels}` is the diameter of the robot's wheels
 * :math:`r_{gearing}` is the total gear reduction between the motors and the wheels
 * :math:`V_{max}` is the nominal max voltage of the motor
 * .. math::
 *   velocity_{max} = \frac{\omega_{free} \cdot \pi \cdot d_{wheels} }{r_{gearing}}
 * 
 *   acceleration_{max} = \frac{2 \cdot n \cdot \tau_{stall} \cdot r_{gearing} }{d_{wheels} \cdot m_{robot}}
 * 
 *   k_{v} = \frac{V_{max}}{velocity_{max}}
 * 
 *   k_{a} = \frac{V_{max}}{acceleration_{max}}
 * 
 */
TankModel.theory = function(
  motorConfig,
  robotMass,
  gearing,
  nmotors = 1,
  xWheelbase = _kitbotWheelbase,
  robotWidth = _kitbotWidth,
  robotLength = _kitbotLength,
  wheelDiameter = 6 / 12,
  vintercept = 1.3,
  timestep = 5
) {
  let maxVelocity = (motorConfig.freeSpeed * Math.PI * wheelDiameter) / gearing;
  let maxAcceleration = (2.0 * nmotors * motorConfig.stallTorque * gearing) / (wheelDiameter * robotMass);
  
  let kv = motorConfig.nominalVoltage / maxVelocity;
  let ka = motorConfig.nominalVoltage / maxAcceleration;

  return new TankModel(motorConfig,
             robotMass, xWheelbase,
             robotWidth, robotLength,
             kv, ka, vintercept,
             kv, ka, vintercept,
             timestep)
}

