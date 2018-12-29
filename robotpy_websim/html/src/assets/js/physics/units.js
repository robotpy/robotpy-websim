import * as math from 'mathjs';

math.createUnit('inertia', '1 ft * ft * lb');
math.createUnit('bm', '1 ft * lb');

math.createUnit('tmkv', '1 volt / (foot / second)');
math.createUnit('tmka', '1 volt / (foot / second^2)');
math.createUnit('count', '1');
math.createUnit('cpm', '1 count / minute');
math.createUnit('Nm', '1 newton * meter');

export function toUnit(value, defaultUnit) {
  if (typeof value === 'string') {
    return math.unit(value);
  }
  else if (typeof value === 'number') {
    return math.unit(value, defaultUnit);
  }
  else {
    return value;
  }
}