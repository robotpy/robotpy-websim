import { toUnit } from 'assets/js/physics/units';

export default class Robot {

  constructor(Matter, config) {
    this.Matter = Matter;
    this.config = config;
  }

  simple(x, y, width=2, height=3, wheelRadius=.25, wheelPadding=.25, options={}) {

    const { Body, Bodies } = this.Matter;


    x = toUnit(x, 'ft').toNumber('ft');
    y = toUnit(y, 'ft').toNumber('ft');
    width = toUnit(width, 'ft').toNumber('ft');
    height = toUnit(height, 'ft').toNumber('ft');
    wheelRadius = toUnit(wheelRadius, 'ft').toNumber('ft');
    wheelPadding = toUnit(wheelPadding, 'ft').toNumber('ft');

    let defaultOptions = {
      render: {
        'fillStyle': '#ccc',
        strokeStyle: 'gray',
        lineWidth: 1/5,
      }
    };

    options = { ...defaultOptions, ...options };
    
    let wheelWidth = 1/6;
    let wheelHeight = wheelRadius * 2;

    let topWheelsX = x - height / 2 + wheelHeight / 2 + wheelPadding;
    let bottomWheelsX = x + height / 2 - wheelHeight / 2 - wheelPadding;
    let leftWheelsY = y - width / 2;
    let rightWheelsY = y + width / 2;
    
    let body = Bodies.rectangle(x, y, height, width, options);
    let tlWheel = Bodies.rectangle(topWheelsX, leftWheelsY, wheelHeight, wheelWidth, options);
    let trWheel = Bodies.rectangle(topWheelsX, rightWheelsY ,wheelHeight, wheelWidth, options);
    let blWheel = Bodies.rectangle(bottomWheelsX, leftWheelsY, wheelHeight, wheelWidth, options);
    let brWheel = Bodies.rectangle(bottomWheelsX, rightWheelsY, wheelHeight, wheelWidth, options);
    
    let robot = Body.create({
      parts: [body, tlWheel, trWheel, blWheel, brWheel],
      frictionAir: 0,
      options: options
    });
    
    return robot;
  }

}