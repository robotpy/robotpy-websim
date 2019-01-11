import * as tankmodel from './tankmodel';
import * as drivetrains from './drivetrains';
import * as motorCfgs from './motor-cfgs';

export default {
  MotorModel: tankmodel.MotorModel,
  TankModel: tankmodel.TankModel,
  linearDeadzone: drivetrains.linearDeadzone,
  TwoMotorDrivetrain: drivetrains.TwoMotorDrivetrain,
  FourMotorDrivetrain: drivetrains.FourMotorDrivetrain,
  MecanumDrivetrain: drivetrains.MecanumDrivetrain,
  FourMotorSwerveDrivetrain: drivetrains.FourMotorSwerveDrivetrain,
  MotorConfigs: motorCfgs
};