const math = require('mathjs');
require('../units');

/**
 * 
 * Configuration parameters useful for simulating a motor. Typically these
 * parameters can be obtained from the manufacturer via a data sheet or other
 * specification.
 * The websim contains config objects for many motors that are commonly
 * used in FRC. If you find that we're missing a motor you care about, please
 * file a bug report and let us know!
 */

 

/**
 * Motor configuration for CIM
 * 
 * * *Name*: CIM
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 5310 RPM
 * * *Free Current*: 2.7 Amps
 * * *Stall Torque*: 2.42 N-m
 * * *Stall Current*: 133 Amps
 */
const MOTOR_CFG_CIM = {
  name: 'CIM', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(5310, 'cpm'),
  freeCurrent: math.unit(2.7, 'A'),
  stallTorque: math.unit(2.42, 'Nm'),
  stallCurrent: math.unit(133, 'A')
};

/**
 * Motor configuration for Mini CIM
 * 
 * * *Name*: MiniCIM
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 5840 RPM
 * * *Free Current*: 3.0 Amps
 * * *Stall Torque*: 1.41 N-m
 * * *Stall Current*: 89.0 Amps
 */
const MOTOR_CFG_MINI_CIM = {
  name: 'MiniCIM', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(5840, 'cpm'),
  freeCurrent: math.unit(3.0, 'A'),
  stallTorque: math.unit(1.41, 'Nm'),
  stallCurrent: math.unit(89.0, 'A')
};

/**
 * Motor configuration for Bag Motor
 * 
 * * *Name*: Bag
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 13180 RPM
 * * *Free Current*: 1.8 Amps
 * * *Stall Torque*: 0.43 N-m
 * * *Stall Current*: 53.0 Amps
 */
const MOTOR_CFG_BAG = {
  name: 'Bag', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(13180, 'cpm'),
  freeCurrent: math.unit(1.8, 'A'),
  stallTorque: math.unit(0.43, 'Nm'),
  stallCurrent: math.unit(53.0, 'A')
};

/**
 * Motor configuration for 775 Pro
 * 
 * * *Name*: 775Pro
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 18730 RPM
 * * *Free Current*: 0.7 Amps
 * * *Stall Torque*: 0.71 N-m
 * * *Stall Current*: 134 Amps
 */
const MOTOR_CFG_775PRO = {
  name: '775Pro', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(18730, 'cpm'),
  freeCurrent: math.unit(0.7, 'A'),
  stallTorque: math.unit(0.71, 'Nm'),
  stallCurrent: math.unit(134, 'A')
};

/**
 * Motor configuration for Andymark RS 775-125
 * 
 * * *Name*: RS775-125
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 5800 RPM
 * * *Free Current*: 1.6 Amps
 * * *Stall Torque*: 0.28 N-m
 * * *Stall Current*: 18.0 Amps
 */
const MOTOR_CFG_775_125 = {
  name: 'RS775-125', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(5800, 'cpm'),
  freeCurrent: math.unit(1.6, 'A'),
  stallTorque: math.unit(0.28, 'Nm'),
  stallCurrent: math.unit(18.0, 'A')
};

/**
 * Motor configuration for Banebots RS 775
 * 
 * * *Name*: RS775
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 13050 RPM
 * * *Free Current*: 2.7 Amps
 * * *Stall Torque*: 0.72 N-m
 * * *Stall Current*: 97.0 Amps
 */
const MOTOR_CFG_BB_RS775 = {
  name: 'RS775', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(13050, 'cpm'),
  freeCurrent: math.unit(2.7, 'A'),
  stallTorque: math.unit(0.72, 'Nm'),
  stallCurrent: math.unit(97.0, 'A')
};

/**
 * Motor configuration for Andymark 9015
 * 
 * * *Name*: AM-9015
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 14270 RPM
 * * *Free Current*: 3.7 Amps
 * * *Stall Torque*: 0.36 N-m
 * * *Stall Current*: 71.0 Amps
 */
const MOTOR_CFG_AM_9015 = {
  name: 'AM-9015', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(14270, 'cpm'),
  freeCurrent: math.unit(3.7, 'A'),
  stallTorque: math.unit(0.36, 'Nm'),
  stallCurrent: math.unit(71.0, 'A')
};

/**
 * Motor configuration for Banebots RS 550
 * 
 * * *Name*: RS550
 * * *Nominal Voltage*: 12 Volts
 * * *Free Speed*: 19000 RPM
 * * *Free Current*: 0.4 Amps
 * * *Stall Torque*: 0.38 N-m
 * * *Stall Current*: 84.0 Amps
 */
const MOTOR_CFG_BB_RS550 = {
  name: 'RS550', 
  nominalVoltage: math.unit(12, 'volt'),
  freeSpeed: math.unit(19000, 'cpm'),
  freeCurrent: math.unit(0.4, 'A'),
  stallTorque: math.unit(0.38, 'Nm'),
  stallCurrent: math.unit(84.0, 'A')
};


module.exports = {
  MOTOR_CFG_CIM,
  MOTOR_CFG_MINI_CIM,
  MOTOR_CFG_BAG,
  MOTOR_CFG_775PRO,
  MOTOR_CFG_775_125,
  MOTOR_CFG_BB_RS775,
  MOTOR_CFG_AM_9015,
  MOTOR_CFG_BB_RS550
};