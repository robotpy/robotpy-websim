

class MyUserPhysics extends UserPhysics {

  createRobotModel(robotConfig) {
    let math = this.Math;

    let MOTOR_CFG_CIM = {
      name: 'CIM', 
      nominalVoltage: math.unit(12, 'volt'),
      freeSpeed: math.unit(5310, 'cpm'),
      freeCurrent: math.unit(2.7, 'A'),
      stallTorque: math.unit(2.42, 'Nm'),
      stallCurrent: math.unit(133, 'A')
    };
    
    let bumperWidth = math.unit(3.25, 'inch');

    let model = this.Models.TankModel.theory(
      MOTOR_CFG_CIM,
      math.unit(50, 'kg'),     
      10.71,
      2,
      math.unit(22, 'inch'),
      math.add(math.unit(23, 'inch'), math.multiply(bumperWidth, 2)),
      math.add(math.unit(32, 'inch'), math.multiply(bumperWidth, 2)),
      math.unit(6, 'inch')
    );

    // Precompute the encoder constant
    // -> encoder counts per revolution / wheel circumference
    this.kEncoder = 360 / (0.5 * Math.PI);

    this.lDistance = 0;
    this.rDistance = 0;

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

    // Update encoders
    this.lDistance += this.model.lVelocity * dt;
    this.rDistance += this.model.rVelocity * dt;

    //console.log('encoder:', parseInt(this.rDistance * this.kEncoder));
    this.updateHalDataIn('encoder[0].count', parseInt(this.lDistance * this.kEncoder));
    this.updateHalDataIn('encoder[1].count', parseInt(this.rDistance * this.kEncoder));
  }
}
