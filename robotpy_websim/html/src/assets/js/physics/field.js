

export default class Field {

  constructor(Matter) {
    this.Matter = Matter;
  }

  rectangle(x, y, width, height, thickness = .25, options = {}) {

    const { Bodies, Body } = this.Matter;

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

}