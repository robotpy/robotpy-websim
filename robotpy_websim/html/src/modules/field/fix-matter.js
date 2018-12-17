import * as _ from 'lodash';

export function fixMatter(Matter) {
  const setVelocityOriginal = Matter.Body.setVelocity;
  Matter.Body.setVelocity = (body, vector) => {
    vector.x /= 60;
    vector.y /= 60;
    setVelocityOriginal(body, vector);
  }

  const setAngularVelocityOriginal = Matter.Body.setAngularVelocity;
  Matter.Body.setAngularVelocity = (body, velocity) => {
    velocity /= 60;
    setAngularVelocityOriginal(body, velocity);
  }
}