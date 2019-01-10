
import Field from './field';
import Robot from './robot';
import models from './models';
import * as math from 'mathjs';
import { toUnit } from 'assets/js/physics/units';

/**
 * You must create a ``physics.js`` file in your 'sim' directory and create a 
 * ``MyUserPhysics`` class that extends ``UserPhysics``. The ``UserPhysics`` 
 * class has several methods you can override to customize your simulation:
 *    
 *   .. code:: javascript
 * 
 *    class MyUserPhysics extends UserPhysics {
 *      ...
 *      ...
 *      ...
 *    }
 * 
 * .. note:: Do **NOT** call the ``constructor`` function yourself. This is
 *    automatically called by the websim. If you need to do any custom initialization
 *    override the ``init`` function.
 */
class UserPhysics {

  constructor(Matter, engine, canvas, config) {
    this.Matter = Matter;
    this.engine = engine;
    this.canvas = canvas;
    this.config = config;
    this.render = null;
    
    this.Field = new Field(Matter, config);
    this.Robot = new Robot(Matter, config);
    this.Math = math;
    this.Models = models;

    this.field = null;
    this.robot = null;

    this.deviceGyroChannels = [];
    this.halData = {};

    this.prevAngle = null;

    this.init();

    this.reset();
  }

  /**
   * Override this function if you need to perform custom initialization steps
   * in your simulation.
   */
  init() {}

  /**
   * Call this in the ``init`` function if you need to add a non-analog gyro
   * device to the hal data.
   * @param {String} angleKey - The name of the angle key in ``halData.robot``
   */
  addDeviceGyroChannel(angleKey) {
    self.postMessage({
      type: 'addDeviceGyroChannel',
      angleKey
    });
  }

  /**
   * This function is called automatically. It updates the gyros in the hal data
   * based on the angle of the robot in the simulation.
   */
  updateGyros() {
    let currentAngle = this.robot.angle * 180 / Math.PI;
    let da = this.prevAngle === null ? 0 : (currentAngle - this.prevAngle);
    this.prevAngle = currentAngle;

    self.postMessage({
      type: 'gyroUpdate',
      da: da
    });
  }

  /**
   * Use this to update the hal data. Usually this is called in the ``updateSim``
   * function.
   * 
   * @param {String} key - The path to the value you want to update in halData.
   * @param {String|Number|Boolean|Array} value - The new value.
   */
  updateHalDataIn(key, value) {
    self.postMessage({ 
      type: 'halDataInUpdate', 
      key,
      value
    });
  }


  /**
   * Resets the simulation. Calls the ``createField``, ``createRobot``,
   * and ``createRobotModel`` functions. If you need to add some custom
   * behavior to the reset function, override it and call ``super.reset``::
   * 
   *   reset() {
   *     // Some custom behavior goes here:
   *     ...
   *     ...
   *     ...
   * 
   *     super.reset();
   *   }
   */
  reset() {

    // Stop renderer and remove everything from the world
    this.Matter.Engine.clear(this.engine);
    this.Matter.World.clear(this.engine.world);

    if (this.render) {
      this.Matter.Render.stop(this.render);
    }

    // create a renderer
    this.render = this.Matter.Render.create({
      element: null,
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: this.config.field.width,
        height: this.config.field.height,
        wireframes: false,
        showAngleIndicator: true
      }
    });

    // run the renderer
    this.Matter.Render.run(this.render);

    // create field
    this.field = this.createField(this.config.field);
    this.Matter.World.add(this.engine.world, this.field);

    // create robot
    this.robot = this.createRobot(this.config.robot);
    this.Matter.World.add(this.engine.world, this.robot);

    // create model
    this.model = this.createRobotModel(this.config.robot);
  }

  /**
   * Override this function if you want to create a custom field. By default
   * it creates a rectangular field using the dimensions provided in the
   * ``config.json`` file.
   * @param {Object} fieldConfig - The config JSON from the ``config.json`` file.
   */
  createField(fieldConfig) {
    let field = this.Field.rectangle(
      toUnit(fieldConfig.width).toNumber('ft') / 2,
      toUnit(fieldConfig.height).toNumber('ft') / 2,
      fieldConfig.width,
      fieldConfig.height
    );

    return field;
  }

  /**
   * Override this function if you want to create a custom robot. By default
   * it creates a rectangular robot using the dimensions provided in the
   * ``config.json`` file.
   * @param {Object} robotConfig - The config JSON from the ``config.json`` file.
   */
  createRobot(robotConfig) {
    let robot = this.Robot.simple(
      robotConfig.startingX,
      robotConfig.startingY,
      robotConfig.width,
      robotConfig.height,
    );

    return robot;
  }

  /**
   * Override this if you want to create a custom robot model. Robot models are used to
   * help simulate the movement of different types of drivetrains. They have a ``getVector``
   * method which are used to update the robot's velocity and angular velocity in the 
   * ``updateSim`` method.
   * 
   * @param {*} robotConfig - The config JSON from the ``config.json`` file.
   */
  createRobotModel(robotConfig) {

  }

  /**
   * Override this if you want to customize the physics for disabling the robot. By
   * default the robot is stopped instantaneously.
   * @param {Object} halData - A giant dictionary that has all data about the robot. 
   *                      See ``hal-sim/hal_impl/data.py`` in robotpy-wpilib’s 
   *                      repository for more information on the contents of 
   *                      this dictionary.
   * @param {Number} dt - The time that has passed since the last update.
   */
  disableRobot(halData, dt) {
    this.Matter.Body.setVelocity(this.robot, { x: 0, y: 0 });
    this.Matter.Body.setAngularVelocity(this.robot, 0);
  }

  /**
   * Called when the simulation parameters for the program need to be updated.
   * This is called approximately 60 times per second. Override this to update the
   * velocity and angular velocity of the robot, as well as any other custom
   * objects created in the Matter.js world that the robot can interact with.
   * Also use this function to update the hal data if anything like sensor values
   * change using the ``updateHalDataIn`` method.
   * 
   * @param {Object} halData - A giant dictionary that has all data about the robot. 
   *                      See ``hal-sim/hal_impl/data.py`` in robotpy-wpilib’s 
   *                      repository for more information on the contents of 
   *                      this dictionary.
   * @param {Number} dt - The time that has passed since the last update.
   */
  updateSim(halData, dt) {}
}


export default UserPhysics;