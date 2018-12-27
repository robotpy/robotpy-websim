
import Field from './field';
import Robot from './robot';
import models from './models';
import configDefaults from './config-defaults.json';
import * as math from 'mathjs';
import { defaultsDeep } from 'lodash';

export default class UserPhysics {

  constructor(Matter, engine, config) {
    this.Matter = Matter;
    this.engine = engine;
    this.config = config;

    this.Field = new Field(Matter);
    this.Robot = new Robot(Matter);
    this.Math = math;
    this.Models = models;

    this.init();
  }

  // Override this
  init() {}

  // Override this
  updateSim(halData, updateHalDataIn) {}
}