

export default class Field {

  constructor(Matter, config) {
    this.Matter = Matter;
    this.config = config;
  }

  rectangle(x, y, width, height, thickness = .25, options = {}) {

    const { Bodies, Body, Composite } = this.Matter;

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
    let grid = this.createGrid(x - width / 2, y - height / 2, width, height, 1, 1);

    let bounds = Body.create({
      parts: [top, bottom, left, right],
      isStatic: true
    });

    return Composite.create({
      bodies: [bounds, grid]
    });
  }

  createGrid(left, top, width, height, unitWidth, unitHeight) {


    const { Bodies, Body } = this.Matter;

    let parts = [];
    
    // draw vertical lines
    let verticalLineCount = Math.ceil(width / unitWidth);

    for (let i = 0; i < verticalLineCount; i++) {
      let x = i * unitWidth;
      let y = top + height / 2;
      let w = 1 / this.config.pxPerFt;
      let h = height;

      parts.push(Bodies.rectangle(x, y, w, h, {
        render: {
          strokeStyle: 'white',
          fillStyle: 'white',
          opacity: .5
        }
      }))
    }
    

    // draw horizontal lines
    let horizontalLineCount = Math.ceil(height / unitHeight);

    for (let i = 0; i < horizontalLineCount; i++) {
      let x = left + width / 2;
      let y = i * unitHeight;
      let w = width;
      let h = 1 / this.config.pxPerFt;
      parts.push(Bodies.rectangle(x, y, w, h, {
        render: {
          strokeStyle: 'white',
          fillStyle: 'white',
          opacity: .5
        }
      }))
    }

    return Body.create({
      parts,
      isStatic: true,
      render: {
        zIndex: -1,
        hideAxes: true
      },
      collisionFilter: {
        mask: 0
      },
    });
  }

}