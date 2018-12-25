
MOTOR_CFG_CIM = {
  name: 'CIM', 
  nominalVoltage: 12,
  freeSpeed: 5310,
  freeCurrent: 2.7,
  stallTorque: 2.42,
  stallCurrent: 133
};


class UserPhysics {

  constructor(Matter, Physics, engine, config) {
    this.Matter = Matter;
    this.engine = engine;
    this.physics = Physics;
    this.config = config;
    this.pxPerFt = this.config.field.pxPerFt;

    //let deadzone = Physics.Drivetrains.linearDeadzone(0.2);
    //this.drivetrain = new Physics.Drivetrains.TwoMotor(2, 5, deadzone);
    let bumperWidth = 3.25 / 12;

    this.drivetrain = Physics.Tankmodel.TankModel.theory(
      MOTOR_CFG_CIM,
      110,     
      10.71,
      2,
      22 / 12,
      23 / 12 + bumperWidth * 2,
      32 / 12 + bumperWidth * 2,
      6 / 12
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
    let tmDiff = 1000 / 60;
    
    let {rcw, fwd} = this.drivetrain.getVector(lMotor, rMotor, tmDiff);

    let xSpeed = fwd / 100 * Math.cos(this.robot.angle);
    let ySpeed = fwd / 100 * Math.sin(this.robot.angle);
  
    this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.robot, rcw / 100);
  }

  createBalls() {
    const { Bodies, World } = this.Matter;

    for (let i = 0; i < 10; i++) {
      let ball = Bodies.circle((i + 1) * 1, 5, 1);
      World.add(this.engine.world, ball);
    }
  }
}
