


class MyUserPhysics extends UserPhysics {

  init() {

    let math = this.Math;

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

    this.drivetrain = this.Models.TankModel.theory(
      MOTOR_CFG_CIM,
      math.unit(50, 'kg'),     
      10.71,
      2,
      math.unit(22, 'inch'),
      math.add(math.unit(23, 'inch'), math.multiply(bumperWidth, 2)),
      math.add(math.unit(32, 'inch'), math.multiply(bumperWidth, 2)),
      math.unit(6, 'inch')
    );
    
  
    let field = this.Field.rectangle(
      this.config.field.width / 2,
      this.config.field.height / 2, 
      this.config.field.width,
      this.config.field.height
    );

    this.robot = this.Robot.simple(
      this.config.robot.startingX,
      this.config.robot.startingY,
      this.config.robot.width, 
      this.config.robot.height,
    );

    let grid = this.createGrid(0, 0, this.config.field.width, this.config.field.height, 1, 1);

    this.Matter.World.add(this.engine.world, [this.robot, field, grid]);
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

  createGrid(left, top, width, height, unitWidth, unitHeight) {


    console.log("GRID:", arguments);

    const { Bodies, Body } = this.Matter;

    let parts = [];
    
    // draw vertical lines
    let verticalLineCount = Math.ceil(width / unitWidth);

    for (let i = 0; i < verticalLineCount; i++) {
      let x = i * unitWidth;
      let y = top + height / 2;
      let w = 1 / this.config.pxPerFt;
      let h = height;

      parts.push(Bodies.rectangle(x, y, w, h, {
        render: {
          strokeStyle: 'white',
          fillStyle: 'white',
          opacity: .5
        }
      }))
    }
    

    // draw horizontal lines
    let horizontalLineCount = Math.ceil(height / unitHeight);

    for (let i = 0; i < horizontalLineCount; i++) {
      let x = left + width / 2;
      let y = i * unitHeight;
      let w = width;
      let h = 1 / this.config.pxPerFt;
      parts.push(Bodies.rectangle(x, y, w, h, {
        render: {
          strokeStyle: 'white',
          fillStyle: 'white',
          opacity: .5
        }
      }))
    }

    return Body.create({
      parts,
      isStatic: true,
      render: {
        zIndex: -1,
        hideAxes: true
      },
      collisionFilter: {
        mask: 0
      },
    });
  }

  createBalls() {
    const { Bodies, World } = this.Matter;

    for (let i = 0; i < 10; i++) {
      let ball = Bodies.circle((i + 1) * 1, 5, 1);
      World.add(this.engine.world, ball);
    }
  }
}
