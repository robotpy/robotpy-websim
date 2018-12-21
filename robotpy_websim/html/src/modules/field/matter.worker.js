import * as OriginalMatter from 'matter-js';
import { wrapMatter } from './wrapper/matter-wrapper';
import * as Physics from '../../assets/js/physics';
import axios from 'axios';
import { defaultsDeep } from 'lodash';

let Matter = null;

// create an engine
let engine = null;
let time = null;
let nextUpdate = null;
let userPhysics = null;

self.onmessage = function(e) {
  const type = e.data.type;

  if (type === 'init') {
    getConfig().then((config) => {
      Matter = wrapMatter(OriginalMatter, config.field.pxPerFt, 60);
      Physics.setMatterWrapper(Matter);
      initialize(e.data.canvas, config);
    }); 
  }
  else if (type === 'data') {
    if (!userPhysics) {
      return;
    }
    time = e.data.time.total;
    userPhysics.updateSim(e.data.halData);
  }
};


function initialize(canvas, config) {
  
  engine = Matter.Engine.create();

  console.log('engine:', engine);
        
  // create a renderer
  var render = Matter.Render.create({
    element: null,
    canvas: canvas,
    engine: engine,
    options: {
      showAngleIndicator: true,
      width: config.field.width,
      height: config.field.height,
      wireframes: false
    }
  });

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
      Matter.Engine.update(engine, 1000 / 60);
      nextUpdate += 1 / 60;
    }
  }, 1000 / 100);

  // run the renderer
  Matter.Render.run(render);

  let UserPhysics = loadPhysics();
  userPhysics = new UserPhysics(Matter, Physics, engine, config);
}

function loadPhysics() {
  self.importScripts('http://localhost:8000/user/physics.js');
  return UserPhysics;
}

function getConfig() {
  let l = window.location;
  let port = process.env.socket_port || l.port;
  let url = "http://" + l.hostname + ":" + port + "/user/config.json";
  return axios.get(url)
    .then(function(response) {
      return defaultsDeep(response.data.websim, Physics.ConfigDefaults);
    })
    .catch(function(error) {
      return {};
    });
}

