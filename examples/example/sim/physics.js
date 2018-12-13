


class UserPhysics {

  constructor(Matter, engine, physics) {
    this.Matter = Matter;
    this.engine = engine;
    this.physics = physics;

    let drivetrains = physics.drivetrains;
    this.deadzone = drivetrains.linearDeadzone(0.2);
    this.drivetrain = new drivetrains.TwoMotorDrivetrain(2, 5, this.deadzone);
  
    this.createBalls();
    this.bounds = this.createBounds();
    this.car = this.createCar(200, 200, 40, 65);

    Matter.World.add(engine.world, [this.car, this.bounds]);
  }

  updateSim(halData, updateHalDataIn) {

    const dataOut = halData.out;
    const can = dataOut.CAN;

    let lMotor = can[1].value;
    let rMotor = can[2].value;

    let { fwd, rcw } = this.drivetrain.getVector(lMotor, rMotor);

    let xSpeed = fwd * Math.cos(this.car.angle);
    let ySpeed = fwd * Math.sin(this.car.angle);
  
    this.Matter.Body.setVelocity(this.car, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.car, rcw / 60);
  }

  createCar(x, y, w, h) {
    const { Bodies, Body } = this.Matter;

    let options = {
      render: {
        'fillStyle': 'none',
        strokeStyle: 'white',
        lineWidth: 1,
      }
    };
    
    let wheelWidth = w / 6;
    let wheelHeight = h / 5;
    
    let topWheelsX = x - h / 2 + wheelHeight / 2 + 10;
    let bottomWheelsX = x + h / 2 - wheelHeight / 2 - 10;
    let leftWheelsY = y - w / 2;
    let rightWheelsY = y + w / 2;
    
    let body = Bodies.rectangle(x, y, h, w, options);
    let tlWheel = Bodies.rectangle(topWheelsX, leftWheelsY, wheelHeight, wheelWidth, options);
    let trWheel = Bodies.rectangle(topWheelsX, rightWheelsY ,wheelHeight, wheelWidth, options);
    let blWheel = Bodies.rectangle(bottomWheelsX, leftWheelsY, wheelHeight, wheelWidth, options);
    let brWheel = Bodies.rectangle(bottomWheelsX, rightWheelsY, wheelHeight, wheelWidth, options);
    
    let car = Body.create({
      parts: [body, tlWheel, trWheel, blWheel, brWheel],
      options: options
    });
  
    // Adding this to the options doesn't work for some reason for Bodies with parts
    Body.setAngle(car, Math.PI / 2);
    
    return car;
  }

  createBalls() {
    const { Bodies, World } = this.Matter;

    for (let i = 0; i < 10; i++) {
      let ball = Bodies.circle((i + 1) * 20, 50, 20);
      World.add(this.engine.world, ball);
    }
  }
  
  createBounds() {

    const { Bodies, Body } = this.Matter;
  
    let wallOptions = {
      isStatic: true,
      render: {
        fillStyle: 'gray',
        strokeStyle: 'gray',
        lineWidth: 1,
      }
    };
  
    let top = Bodies.rectangle(200, 3, 400, 5, wallOptions);
    let bottom = Bodies.rectangle(200, 397, 400, 5, wallOptions);
    let left = Bodies.rectangle(3, 200, 5, 400, wallOptions);
    let right = Bodies.rectangle(397, 200, 5, 400, wallOptions);
  
  
    let bounds = Body.create({
      parts: [top, bottom, left, right],
      isStatic: true,
    });
  
    return bounds;
  }
}
