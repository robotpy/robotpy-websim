Drivetrain Support
==================

.. warning:: These drivetrain models are not particularly realistic, and
             if you are using a tank drive style drivetrain you should use
             the class `.TankModel` instead.

Based on input from various drive motors, these helper functions
simulate moving the robot in various ways. Many thanks to
`Ether <http://www.chiefdelphi.com/forums/member.php?u=34863>`_
for assistance with the motion equations.
  
When specifying the robot speed to the below functions, the following
may help you determine the approximate speed of your robot:
* Slow: 4ft/s
* Typical: 5 to 7ft/s
* Fast: 8 to 12ft/s
    
Obviously, to get the best simulation results, you should try to
estimate the speed of your robot accurately.
Here's an example usage of the drivetrains::

  class MyUserPhysics extends UserPhysics {
      
    createRobotModel(robotConfig) {
      return new this.Models.TwoMotor();
    }
        
    updateSim(halData, dt) {
      const dataOut = halData.out;
      const can = dataOut.CAN;

      let lMotor = can[1].value;
      let rMotor = can[2].value;
      
      let {rcw, fwd} = this.model.getVector(lMotor, rMotor);

      let xSpeed = fwd * Math.cos(this.robot.angle);
      let ySpeed = fwd * Math.sin(this.robot.angle);
    
      this.Matter.Body.setVelocity(this.robot, { x: xSpeed, y: ySpeed });
      this.Matter.Body.setAngularVelocity(this.robot, rcw);
    }
  }

.. js:autofunction:: linearDeadzone

.. js:autoclass:: TwoMotorDrivetrain
   :members:

.. js:autoclass:: FourMotorDrivetrain
   :members:

.. js:autoclass:: MecanumDrivetrain
   :members:

.. js:autoclass:: FourMotorSwerveDrivetrain
   :members:
