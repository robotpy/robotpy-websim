
class UserPhysics {

  constructor(Matter, Physics, engine, config) {
    this.Matter = Matter;
    this.engine = engine;
    this.physics = Physics;
    this.config = config;
    this.pxPerFt = this.config.field.pxPerFt;

    let deadzone = Physics.Drivetrains.linearDeadzone(0.2);
    this.drivetrain = new Physics.Drivetrains.TwoMotor(2, 5, deadzone);
  
    let field = Physics.Field.rectangle(
      config.field.width / 2 * this.pxPerFt,
      config.field.height / 2 * this.pxPerFt, 
      config.field.width * this.pxPerFt,
      config.field.height * this.pxPerFt
    );

    this.robot = Physics.Robot.simple(
      config.robot.startingX * this.pxPerFt,
      config.robot.startingY * this.pxPerFt,
      config.robot.width * this.pxPerFt,
      config.robot.height * this.pxPerFt,
    );

    Matter.World.add(engine.world, [this.robot, field]);
    this.createBalls();
  }

  updateSim(halData, updateHalDataIn) {

    const dataOut = halData.out;
    const can = dataOut.CAN;

    let lMotor = can[1].value;
    let rMotor = can[2].value;

    let { fwd, rcw } = this.drivetrain.getVector(lMotor, rMotor);

    let xSpeed = fwd * Math.cos(this.robot.angle) * this.pxPerFt;
    let ySpeed = fwd * Math.sin(this.robot.angle) * this.pxPerFt;
  
    this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.robot, rcw);
  }

  createBalls() {
    const { Bodies, World } = this.Matter;

    for (let i = 0; i < 10; i++) {
      let ball = Bodies.circle((i + 1) * 20, 50, 10);
      World.add(this.engine.world, ball);
    }
  }
}
