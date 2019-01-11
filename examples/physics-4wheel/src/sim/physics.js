

class MyUserPhysics extends UserPhysics {

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
    const pwm = dataOut.pwm;

    let lrMotor = pwm[1].value;
    let rrMotor = pwm[2].value;

    // Not needed because front and rear should be in sync
    // lfMotor = pwm[3].value;
    // rfMotor = pwm[4].value;
    
    let {rcw, fwd} = this.model.getVector(lrMotor, rrMotor, dt);

    let xSpeed = fwd * Math.cos(this.robot.angle);
    let ySpeed = fwd * Math.sin(this.robot.angle);
  
    this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.robot, rcw);
  }
}
