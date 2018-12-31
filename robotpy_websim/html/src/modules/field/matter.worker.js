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

self.onmessage = function(e) {
  const type = e.data.type;

  if (type === 'init') {
    getConfig().then((config) => {
      let canvas = e.data.canvas;
      canvas.style = {};
      OriginalMatter.Render = Render;
      Matter = wrapMatter(OriginalMatter, config.pxPerFt, 60);
      initialize(canvas, config);
    }); 
  }
  else if (type === 'data') {
    if (!userPhysics) {
      return;
    }
    time = e.data.time.total;
    halData = e.data.halData;


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
    else if (nextUpdate === null) {
      nextUpdate = time + 1 / 60;
    }
    else if (time > nextUpdate) {
      userPhysics.halData = halData;
      userPhysics.updateSim(halData, 1/60);
      userPhysics.updateGyros();
      Matter.Engine.update(engine, 1000 / 60);
      nextUpdate += 1 / 60;
    }
    
  }, 1000 / 100);

  let MyUserPhysics = loadPhysics();
  userPhysics = new MyUserPhysics(Matter, engine, canvas, config);
}

function loadPhysics() {
  self.importScripts('http://localhost:8000/user/physics.js');
  return MyUserPhysics;
}

function getConfig() {
  let l = window.location;
  let port = process.env.socket_port || l.port;
  let url = "http://" + l.hostname + ":" + port + "/user/config.json";
  return axios.get(url)
    .then(function(response) {
      return defaultsDeep(response.data.websim, configDefaults);
    })
    .catch(function(error) {
      return {};
    });
}

