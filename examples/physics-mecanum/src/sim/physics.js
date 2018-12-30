

class MyUserPhysics extends UserPhysics {

  init() {
    this.addGyro('analog_gyro[0].angle');
  }

  createRobotModel(robotConfig) {
    return new this.Models.MecanumDrivetrain();
  }

  updateSim(halData, dt) {

    const dataOut = halData.out;
    const pwm = dataOut.pwm;

    // Simulate the drivetrain
    let lrMotor = pwm[3].value;
    let rrMotor = pwm[0].value;
    let lfMotor = pwm[2].value;
    let rfMotor = pwm[1].value;

    let { vx, vy, vw } = this.model.getVector(
      lrMotor, rrMotor, lfMotor, rfMotor
    );

    let angle = this.robot.angle;

    let xSpeed = vx * Math.cos(angle - Math.PI / 2) + vy * Math.cos(angle);
    let ySpeed = vx * Math.sin(angle - Math.PI / 2) + vy * Math.sin(angle);
    
    this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
    this.Matter.Body.setAngularVelocity(this.robot, vw);
  }
}
