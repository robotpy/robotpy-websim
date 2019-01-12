import * as OriginalMatter from 'matter-js';
import { wrapMatter } from './wrapper/matter-wrapper';
import Render from '../../assets/js/physics/render';
import UserPhysics from '../../assets/js/physics/user-physics';
import configDefaults from '../../assets/js/physics/config-defaults.json';
import axios from 'axios';
import { defaultsDeep } from 'lodash';

global.UserPhysics = UserPhysics;

let Matter = null;

// create an engine
let engine = null;
let time = null;
let nextUpdate = null;
let userPhysics = null;
let halData = {};
let robotMode = 'disabled';

self.onmessage = function(e) {
  const type = e.data.type;

  if (type === 'init') {
    const config = defaultsDeep(e.data.config, configDefaults);
    const canvas = e.data.canvas;
    canvas.style = {};
    OriginalMatter.Render = Render;
    Matter = wrapMatter(OriginalMatter, config.field.px_per_ft, 60);
    initialize(canvas, config); 
  }
  else if (type === 'data') {
    if (!userPhysics) {
      return;
    }
    time = e.data.time.total;
    halData = e.data.halData;
    robotMode = e.data.robotMode;

  }
  else if (type === 'reset') {
    userPhysics.reset();
  }
};


function initialize(canvas, config) {
  
  engine = Matter.Engine.create();

  // set gravity
  engine.world.gravity.y = 0;

  // run the engine
  setInterval(function() {
    if (time === null) {
      return;
    }
    // If time and nextUpdate are not close to each other, it's likely we switched
    // modes. Let's sync them.
    else if (nextUpdate === null || Math.abs(time - nextUpdate) > .5) {
      nextUpdate = time + 1 / 60;
    }
    else if (time > nextUpdate) {
      userPhysics.halData = halData;

      if (robotMode !== 'disabled') {
        userPhysics.updateSim(halData, 1/60);
      }
      else {
        userPhysics.disableRobot(halData, 1/60);
      }
      userPhysics.updateGyros();
      Matter.Engine.update(engine, 1000 / 60);
      nextUpdate += 1 / 60;
    }
    
  }, 1000 / 100);

  let MyUserPhysics = loadPhysics();
  userPhysics = new MyUserPhysics(Matter, engine, canvas, config);
}

function loadPhysics() {
  try {
    self.importScripts('http://localhost:8000/user/physics.js');
    if (MyUserPhysics.prototype instanceof UserPhysics) {
      return MyUserPhysics;
    }
    else {
      return UserPhysics;
    }
  }
  catch(e) {
    return UserPhysics;
  }
}

