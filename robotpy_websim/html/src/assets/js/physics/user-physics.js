
import Field from './field';
import Robot from './robot';
import models from './models';
import * as math from 'mathjs';
import { toUnit } from 'assets/js/physics/units';


export default class UserPhysics {

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

    this.gyroKeys = [];

    this.init();

    this.reset();
  }

  addGyro(halKey) {
    this.gyroKeys.push(halKey);
  }

  updateGyros() {
    this.gyroKeys.forEach((key) => {
      const angleDegrees = this.robot.angle * 180 / Math.PI;
      this.updateHalDataIn(key, angleDegrees);
    });
  }

  updateHalDataIn(key, value) {
    self.postMessage({ 
      type: 'halDataInUpdate', 
      key,
      value
    });
  }

  // Override this
  init() {}

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

  // Override this if you want to create a custom field
  createField(fieldConfig) {
    let field = this.Field.rectangle(
      toUnit(fieldConfig.width).toNumber('ft') / 2,
      toUnit(fieldConfig.height).toNumber('ft') / 2,
      fieldConfig.width,
      fieldConfig.height
    );

    return field;
  }

  // Override this if you want to create a custom robot
  createRobot(robotConfig) {
    let robot = this.Robot.simple(
      robotConfig.startingX,
      robotConfig.startingY,
      robotConfig.width,
      robotConfig.height,
    );

    return robot;
  }

  // Override this if you want to create your own model
  createRobotModel(robotConfig) {

  }

  // Override this
  updateSim(halData, dt) {}
}