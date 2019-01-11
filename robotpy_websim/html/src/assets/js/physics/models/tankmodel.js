/**
 * The equations used in our :class:`TankModel` is derived from
 * `Noah Gleason and Eli Barnett's motor characterization whitepaper
 * <https://www.chiefdelphi.com/media/papers/3402>`_. It is
 * recommended that users of this model read the paper so they can
 * more fully understand how this works.
 *   
 * In the interest of making progress, this API may receive
 * backwards-incompatible changes before the start of the 2019
 * FRC season.
 */

const math = require('mathjs');
require('../units');


// default parameters for a kitbot
const _bumperLength = math.unit(3.25, 'in');

let _kitbotWheelbase = math.unit(21, 'in');
let _kitbotWidth = math.add(_kitbotWheelbase, math.multiply(_bumperLength, 2));
let _kitbotLength = math.add(math.unit(30, 'in'), math.multiply(_bumperLength, 2));



/**
 * Motor model used by the :class:`TankModel`. You should not need to create
 * this object if you're using the :class:`TankModel` class.
 */
class MotorModel {

  /**
   * 
   * @param {Object} motorConfig - The specification data for your motor
   * @param {tm_kv} kv - Computed ``kv`` for your robot
   * @param {tm_ka} ka - Computed ``ka`` for your robot
   * @param {volt} vintercept - The minimum voltage required to generate enough
   *                         torque to overcome steady-state friction (see the
   *                         paper for more details)
   */

  
  constructor(motorConfig, kv, ka, vintercept) {

    // Current computed acceleration (in ft/s^2)
    this.acceleration = 0;

    // Current computed velocity (in ft/s)
    this.velocity = 0;

    // Current computed position (in ft)
    this.position = 0;

    this._nominalVoltage = motorConfig.nominalVoltage.toNumber('volt');
    this._vintercept = vintercept.toNumber('volt');
    this._kv = kv.toNumber('tmkv');
    this._ka = ka.toNumber('tmka');
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
 * .. note:: You can use whatever units you would like to specify the input
 *           parameter for your robot, the websim will convert them all
 *           to the correct units for computation.
 *                 
 *           Output units for velocity and acceleration are in ft/s and
 *           ft/s^2
 *  
 * Example usage for a 40kg robot with 2 CIM motors on each side with 6 inch
 * wheels:
 *
 * .. code:: javascript
 *
 *  class MyUserPhysics extends UserPhysics {
 *
 *    createRobotModel(robotConfig) {
 *      let math = this.Math;
 *
 *      let model = this.Models.TankModel.theory(
 *        this.Models.MotorConfigs.MOTOR_CFG_CIM,
 *        math.unit(40, 'kg'),     
 *        10.71,
 *        2,
 *        math.unit(2, 'ft'),
 *        math.unit(6, 'inch')
 *      );
 *
 *      return model;
 *    }
 *
 *    updateSim(halData, dt) {
 *
 *      const dataOut = halData.out;
 *      const pwm = dataOut.pwm;
 *
 *      let lrMotor = pwm[1].value;
 *      let rrMotor = pwm[2].value;
 *      
 *      let {rcw, fwd} = this.model.getVector(lrMotor, rrMotor, dt);
 *
 *      let xSpeed = fwd * Math.cos(this.robot.angle);
 *      let ySpeed = fwd * Math.sin(this.robot.angle);
 *    
 *      this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
 *      this.Matter.Body.setAngularVelocity(this.robot, rcw);
 *    }
 *  }
 */
class TankModel {


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
   * @param {Object} motorConfig - Motor specification
   * @param {Quantity} robotMass - Mass of robot
   * @param {Quantity} xWheelbase - Wheelbase of the robot
   * @param {Quantity} robotWidth - Width of the robot
   * @param {Quantity} robotLength - Length of the robot
   * @param {Quantity} lKv - Left side ``kv``
   * @param {Quantity} lKa - Left side ``ka``
   * @param {volt} lVi - Left side ``Vintercept``
   * @param {Quantity} rKv - Right side ``kv``
   * @param {Quantity} rKa - Right side ``ka``
   * @param {Quantity} rVi - Right side ``Vintercept``
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
    rVi
  ) {

    this._lmotor = new MotorModel(motorConfig, lKv, lKa, lVi);
    this._rmotor = new MotorModel(motorConfig, rKv, rKa, rVi);

    this.inertia = math.multiply(
      (1 / 12.0),
      robotMass,
      math.add(math.pow(robotLength, 2), math.pow(robotWidth, 2))
    );

    // This is used to compute the rotational velocity
    this._bm = math.multiply(math.divide(xWheelbase, 2.0), robotMass).toNumber('bm');
  }

  /**
   * The velocity of the left side (in ft/s)
   */
  get lVelocity() {
    return this._lmotor.velocity;
  }
  
  /**
   * The velocity of the left side (in ft/s)
   */
  get rVelocity() {
    return this._rmotor.velocity;
  }

  /**
   * The linear position of the left side wheel (in feet)
   */
  get lPosition() {
    return this._lmotor.position;
  }

  /**
   * The linear position of the right side wheel (in feet)
   */
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
    return math.unit(this._inertia, 'inertia');
  }

  set inertia(value) {
    this._inertia = value.toNumber('inertia');
  }


  /**
   * Given motor values and the amount of time elapsed since this was last
   * called, retrieves the velocity and anglular velocity of the robot.
   * 
   * To update your encoders, use the ``lPosition`` and ``rPosition``
   * attributes of this object.
   * 
   * .. note:: If you are using more than 2 motors, it is assumed that
   *           all motors on each side are set to the same speed. Only
   *           pass in one of the values from each side
   *
   * @param {Number} lMotor - Left motor value (-1 to 1); -1 is forward
   * @param {Number} rMotor - Right motor value (-1 to 1); 1 is forward
   * @param {Number} tmDiff - Elapsed time since last call to this function
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
 * 
 * Computation of ``kv`` and ``ka`` are done as follows:
 * 
 * * :math:`\omega_{free}` is the free speed of the motor
 * * :math:`\tau_{stall}` is the stall torque of the motor
 * * :math:`n` is the number of drive motors
 * * :math:`m_{robot}` is the mass of the robot
 * * :math:`d_{wheels}` is the diameter of the robot's wheels
 * * :math:`r_{gearing}` is the total gear reduction between the motors and the wheels
 * * :math:`V_{max}` is the nominal max voltage of the motor
 * 
 * .. math::
 * 
 *    velocity_{max} = \frac{\omega_{free} \cdot \pi \cdot d_{wheels} }{r_{gearing}}
 *    
 *    acceleration_{max} = \frac{2 \cdot n \cdot \tau_{stall} \cdot r_{gearing} }{d_{wheels} \cdot m_{robot}}
 *    
 *    k_{v} = \frac{V_{max}}{velocity_{max}}
 * 
 *    k_{a} = \frac{V_{max}}{acceleration_{max}}
 * 
 * @param {Object} motorConfig - Specifications for your motor
 * @param {Quantity} robotMass - Mass of the robot
 * @param {Number} gearing - Gear ratio .. so for a 10.74:1 ratio, you would pass 10.74
 * @param {Number} nmotors - Number of motors per side
 * @param {Quantity} xWheelbase - Wheelbase of the robot
 * @param {Quantity} robotWidth - Width of the robot
 * @param {Quantity} robotLength - Length of the robot
 * @param {Quantity}wheelDiameter - Diameter of the wheel
 * @param {Volt} vintercept - The minimum voltage required to generate enough
 *                     torque to overcome steady-state friction (see the
 *                     paper for more details)
 * 
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
  wheelDiameter = math.unit(6, 'inch'),
  vintercept = math.unit(1.3, 'volt')
) {

  let maxVelocity = math.multiply(motorConfig.freeSpeed, Math.PI, wheelDiameter, 1 / gearing);
  
  let maxAcceleration = math.divide(
    math.multiply(2.0, nmotors, motorConfig.stallTorque, gearing),
    math.multiply(wheelDiameter, robotMass)
  );

  let kv = math.divide(motorConfig.nominalVoltage, maxVelocity);
  let ka = math.divide(motorConfig.nominalVoltage, maxAcceleration);

  return new TankModel(motorConfig,
             robotMass, xWheelbase,
             robotWidth, robotLength,
             kv, ka, vintercept,
             kv, ka, vintercept)
}



module.exports = {
  MotorModel,
  TankModel
};