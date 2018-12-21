import * as OriginalMatter from 'matter-js';

let Matter = OriginalMatter;

export function setMatterWrapper(wrapper) {
  Matter = wrapper;
}  
export function rectangle(x, y, width, height, thickness = .25, options = {}) {

  const { Bodies, Body } = Matter;

  let defaultOptions = {
    isStatic: true,
    render: {
      fillStyle: 'gray',
      strokeStyle: 'gray',
      lineWidth: 1/24,
    }
  };

  options = { ...defaultOptions, ...options };

  let top = Bodies.rectangle(x, y - (height + thickness) / 2, width, thickness, options);
  let bottom = Bodies.rectangle(x, y + (height + thickness) / 2, width, thickness, options);
  let left = Bodies.rectangle(x - (width + thickness) / 2, y, thickness, height, options);
  let right = Bodies.rectangle(x + (width + thickness) / 2, y, thickness, height, options);
  
  let bounds = Body.create({
    parts: [top, bottom, left, right],
    isStatic: true
  });

  return bounds;
}