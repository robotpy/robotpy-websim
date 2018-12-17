import { Bodies, Body } from 'matter-js';

export function rectangle(x, y, width, height, thickness = 5, options = {}) {

  let defaultOptions = {
    isStatic: true,
    render: {
      fillStyle: 'gray',
      strokeStyle: 'gray',
      lineWidth: 1,
    }
  };

  options = { ...defaultOptions, ...options };

  let thicknessMiddle = thickness % 2 === 0 ? thickness / 2 : (thickness + 1) / 2;

  let top = Bodies.rectangle(x, thicknessMiddle, width, thickness, options);
  let bottom = Bodies.rectangle(x, y + height / 2 - thicknessMiddle, width, thickness, options);
  let left = Bodies.rectangle(thicknessMiddle, y, thickness, height, options);
  let right = Bodies.rectangle(x + width / 2 - thicknessMiddle, y, thickness, height, options);
  
  let bounds = Body.create({
    parts: [top, bottom, left, right],
    isStatic: true
  });

  return bounds;
}