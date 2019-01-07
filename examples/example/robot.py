#!/usr/bin/env python3
"""
    This is a good foundation to build your robot code on
"""

import wpilib
import ctre


class MyRobot(wpilib.TimedRobot):

    def robotInit(self):
        """
        This function is called upon program startup and
        should be used for any initialization code.
        """

        '''
        self.br_motor = ctre.wpi_talonsrx.WPI_TalonSRX(1)
        self.bl_motor = ctre.wpi_talonsrx.WPI_TalonSRX(2)
        self.fl_motor = ctre.wpi_talonsrx.WPI_TalonSRX(5)
        self.fr_motor = ctre.wpi_talonsrx.WPI_TalonSRX(7)
        self.fr_motor.setInverted(True)
        self.br_motor.setInverted(True)

        self.robot_drive = wpilib.RobotDrive(self.fl_motor, self.bl_motor, self.fr_motor, self.br_motor)
        '''

        self.left_motor = ctre.wpi_talonsrx.WPI_TalonSRX(1)
        self.right_motor = ctre.wpi_talonsrx.WPI_TalonSRX(2)

        self.robot_drive = wpilib.RobotDrive(self.left_motor, self.right_motor)

        self.joystick = wpilib.Joystick(0)

        self.gyro = wpilib.AnalogGyro(0)
        #self.analogOutput = wpilib.AnalogOutput(1)
        self.analogTrigger = wpilib.AnalogTrigger(2)

        self.double_solenoid = wpilib.DoubleSolenoid(0, 4)

        # digital
        self.pwm = wpilib.PWMTalonSRX(0)

        self.dio0 = wpilib.DigitalInput(0)
        self.dio1 = wpilib.DigitalOutput(1)

        self.relay = wpilib.Relay(0)

    def autonomousInit(self):
        """This function is run once each time the robot enters autonomous mode."""
        pass

    def autonomousPeriodic(self):
        """This function is called periodically during autonomous."""
        self.robot_drive.arcadeDrive(.5, .5)
        self.double_solenoid.set(wpilib.DoubleSolenoid.Value.kOff)

        self.relay.set(wpilib.Relay.Value.kReverse)
    
    def teleopPeriodic(self):
        """This function is called periodically during operator control."""
        self.robot_drive.arcadeDrive(self.joystick.getY(), self.joystick.getX())

        self.double_solenoid.set(wpilib.DoubleSolenoid.Value.kForward)
        # fwd = green, rev = red, gray otherwise
        self.relay.set(wpilib.Relay.Value.kForward)


if __name__ == "__main__":
    wpilib.run(MyRobot)