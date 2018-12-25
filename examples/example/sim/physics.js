


class UserPhysics {

  constructor(Matter, Physics, engine, config) {
    this.Matter = Matter;
    this.engine = engine;
    this.physics = Physics;
    this.config = config;

    let math = Physics.Math;

    let MOTOR_CFG_CIM = {
      name: 'CIM', 
      nominalVoltage: math.unit(12, 'volt'),
      freeSpeed: math.unit(5310, 'cpm'),
      freeCurrent: math.unit(2.7, 'A'),
      stallTorque: math.unit(2.42, 'Nm'),
      stallCurrent: math.unit(133, 'A')
    };

    //let deadzone = Physics.Drivetrains.linearDeadzone(0.2);
    //this.drivetrain = new Physics.Drivetrains.TwoMotor(2, 5, deadzone);
    let bumperWidth = math.unit(3.25, 'inch');

    this.drivetrain = Physics.Tankmodel.TankModel.theory(
      MOTOR_CFG_CIM,
      math.unit(50, 'kg'),     
      10.71,
      2,
      math.unit(22, 'inch'),
      math.add(math.unit(23, 'inch'), math.multiply(bumperWidth, 2)),
      math.add(math.unit(32, 'inch'), math.multiply(bumperWidth, 2)),
      math.unit(6, 'inch')
    );
    
  
    let field = Physics.Field.rectangle(
      config.field.width / 2,
      config.field.height / 2, 
      config.field.width,
      config.field.height
    );

    this.robot = Physics.Robot.simple(
      config.robot.startingX,
      config.robot.startingY,
      config.robot.width, 
      config.robot.height,
    );

    Matter.World.add(engine.world, [this.robot, field]);
    this.createBalls();
  }

  updateSim(halData, updateHalDataIn) {

    const dataOut = halData.out;
    const can = dataOut.CAN;

    let lMotor = can[1].value;
    let rMotor = can[2].value;

    //let { fwd, rcw } = this.drivetrain.getVector(lMotor, rMotor);
    let tmDiff = 1 / 60;
    
    let {rcw, fwd} = this.drivetrain.getVector(lMotor, rMotor, tmDiff);

    let xSpeed = fwd * Math.cos(this.robot.angle);
    let ySpeed = fwd * Math.sin(this.robot.angle);
  
    this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.robot, rcw);
  }

  createBalls() {
    const { Bodies, World } = this.Matter;

    for (let i = 0; i < 10; i++) {
      let ball = Bodies.circle((i + 1) * 1, 5, 1);
      World.add(this.engine.world, ball);
    }
  }
}
