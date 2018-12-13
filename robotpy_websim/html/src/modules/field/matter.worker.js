import * as Matter from 'matter-js';
import * as drivetrains from '../../assets/js/physics/drivetrains';


let physics = {
  drivetrains
};

// create an engine
let engine = null;
let userPhysics = null;


self.onmessage = function(e) {
  const type = e.data.type;

  if (type === 'init') {
    initialize(e.data.canvas);
  }
  else if (type === 'halUpdate') {
    if (!userPhysics) {
      return;
    }
    userPhysics.updateSim(e.data.halData);
  }
};

function initialize(canvas) {
  
  engine = Matter.Engine.create();
        
  // create a renderer
  var render = Matter.Render.create({
    element: null,
    canvas: canvas,
    engine: engine,
    width: 300,
    height: 300,
    options: {
      showAngleIndicator: true,
      width: 400,
      height: 400,
      wireframes: false
    }
  });

  // set gravity
  engine.world.gravity.y = 0;

  // run the engine
  setInterval(function() {
    Matter.Engine.update(engine, 1000 / 60);
  }, 1000 / 60);

  // run the renderer
  Matter.Render.run(render);

  let UserPhysics = loadPhysics();
  userPhysics = new UserPhysics(Matter, engine, physics);
}

function loadPhysics() {
  self.importScripts('http://localhost:8000/user/physics.js');
  return UserPhysics;
}

