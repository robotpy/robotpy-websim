

class MyUserPhysics extends UserPhysics {

  createField(fieldConfig) {
    let field = super.createField(fieldConfig);
    return [field].concat(this.createBalls());
  }

  createRobotModel(robotConfig) {
    let math = this.Math;

    let bumperWidth = math.unit(3.25, 'inch');

    let model = this.Models.TankModel.theory(
      this.Models.MotorConfigs.MOTOR_CFG_CIM,
      math.unit(50, 'kg'),     
      10.71,
      2,
      math.unit(22, 'inch'),
      math.add(math.unit(23, 'inch'), math.multiply(bumperWidth, 2)),
      math.add(math.unit(32, 'inch'), math.multiply(bumperWidth, 2)),
      math.unit(6, 'inch')
    );

    return model;
  }

  updateSim(halData, dt) {

    const dataOut = halData.out;
    const can = dataOut.CAN;

    let lMotor = can[1].value;
    let rMotor = can[2].value;
    
    let {rcw, fwd} = this.model.getVector(lMotor, rMotor, dt);

    let xSpeed = fwd * Math.cos(this.robot.angle);
    let ySpeed = fwd * Math.sin(this.robot.angle);
  
    this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.robot, rcw);
  }

  createBalls() {
    const { Bodies } = this.Matter;

    let balls = [];

    for (let i = 0; i < 10; i++) {
      balls.push(Bodies.circle((i + 1) * 1, 5, 1));
    }

    return balls;
  }
}
