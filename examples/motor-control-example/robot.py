#!/usr/bin/env python3

import wpilib

class MyRobot(wpilib.IterativeRobot):
    
    def robotInit(self):
        
        self.stick = wpilib.Joystick(0)
        self.motor = wpilib.Jaguar(0)

        self.encoder = wpilib.Encoder(0, 1)
    
    def teleopInit(self):
        pass
    
    def teleopPeriodic(self):

        v = self.stick.getX()
        encoder_value = self.encoder.get()

        # limit the motor to only travel between 0 and 180
        if encoder_value < 0:
            v = max(0, v)
        elif encoder_value > 180:
            v = min(0, v)
        
        self.motor.set(v)

if __name__ == '__main__':
    wpilib.run(MyRobot)