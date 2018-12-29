import * as math from 'mathjs';
import { once } from 'lodash';
import { toUnit } from 'assets/js/physics/units';

let createUnits = _.once((pxPerFt, updatesPerSec) => {
  let ftPerPx = 1 / pxPerFt;
  let secPerUpdate = 1 / updatesPerSec;
  math.createUnit('px', `${ftPerPx} ft`);
  math.createUnit('update', `${secPerUpdate} second`);
});

export function addArgConverters(wrapper, pxPerFt, updatesPerSec) {

  createUnits(pxPerFt, updatesPerSec);

  wrapper.addArgConverter('toPx', (ft) => {
    return toUnit(ft, 'ft').toNumber('px');
  });
  
  wrapper.addArgConverter('toPxVector', (ftVector) => {
    return {
      x: toUnit(ftVector.x, 'ft').toNumber('px'),
      y: toUnit(ftVector.y, 'ft').toNumber('px')
    }
  });
  
  wrapper.addArgConverter('toRadPerUpdate', (radPerSec) => {
    return toUnit(radPerSec, 'rad / second').toNumber('rad / update');
  });
  
  wrapper.addArgConverter('toPxPerUpdateVector', (ftVectorPerSec) => {
    return {
      x: toUnit(ftVectorPerSec.x, 'ft / second').toNumber('px / update'),
      y: toUnit(ftVectorPerSec.y, 'ft / second').toNumber('px / update')
    }
  });
  
  wrapper.addArgConverter('toPxVertices', (ftVertices) => {
    return ftVertices.map(ftVertex => {
      return {
        x: toUnit(ftVertex.x, 'ft').toNumber('px'),
        y: toUnit(ftVertex.y, 'ft').toNumber('px'),
      };
    });
  });
  
  wrapper.addArgConverter('bodyOptionsConverter', (options) => {
  
    let newOptions = {
      ...options,
      render: {
        ...options.render
      }
    };

    if (options.position) {
      newOptions.position = {
        x: toUnit(options.position.x, 'ft').toNumber('px'),
        y: toUnit(options.position.y, 'ft').toNumber('px')
      };
    }
  
    if (options.render && options.render.lineWidth) {
      newOptions.render.lineWidth = toUnit(options.render.lineWidth, 'ft').toNumber('px');
    }
  
    if (options.vertices) {
      newOptions.vertices = options.vertices.map((vertex) => {
        return {
          x: toUnit(vertex.x, 'ft').toNumber('px'),
          y: toUnit(vertex.y, 'ft').toNumber('px')
        }
      });
    }

    return newOptions;
  });

  wrapper.addArgConverter('constraintOptionsConverter', (options) => {
    
    let newOptions = {
      ...options,
      render: {
        ...options.render
      }
    };

    if (options.pointA) {
      newOptions.pointA = {
        x: toUnit(options.pointA.x, 'ft').toNumber('px'),
        y: toUnit(options.pointA.y, 'ft').toNumber('px'),
      };
    }

    if (options.pointB) {
      newOptions.pointB = {
        x: toUnit(options.pointB.x, 'ft').toNumber('px'),
        y: toUnit(options.pointB.y, 'ft').toNumber('px'),
      };
    }    

    if (options.render && options.render.lineWidth) {
      newOptions.render.lineWidth = toUnit(options.render.lineWidth, 'ft').toNumber('px');
    }

    return newOptions;
  });

  wrapper.addArgConverter('gridOptionsConverter', (options) => {
    
    let newOptions = {

    };

    if (options.bucketHeight) {
      newOptions.bucketHeight = toUnit(options.bucketHeight, 'ft').toNumber('px');
    }

    if (options.bucketWidth) {
      newOptions.bucketWidth = toUnit(options.bucketWidth, 'ft').toNumber('px');
    }

    return newOptions;
  });

  wrapper.addArgConverter('renderLookAtObjectConverter', (objects) => {
    
    return objects.map(object => {

      let newObject = {};

      if (object.position) {
        newObject.position.x = toUnit(object.position.x, 'ft').toNumber('px');
        newObject.position.y = toUnit(object.position.y, 'ft').toNumber('px');
      }
  
      if (object.min) {
        newObject.min = toUnit(object.min, 'ft').toNumber('px');
      }
  
      if (object.max) {
        newObject.max = toUnit(object.max, 'ft').toNumber('px');
      }
  
      if (object.x) {
        newObject.x = toUnit(object.x, 'ft').toNumber('px');
      }
  
      if (object.y) {
        newObject.y = toUnit(object.y, 'ft').toNumber('px');
      }

      return newObject;
    });
  });

  wrapper.addArgConverter('renderOptionsConverter', (options) => {
    
    let newOptions = {
      ...options,
      options: {
        ...options.options
      }
    };
    
    if (options.options) {

      if (options.options.height) {
        newOptions.options.height = toUnit(options.options.height, 'ft').toNumber('px');
      }

      if (options.options.width) {
        newOptions.options.width = toUnit(options.options.width, 'ft').toNumber('px');
      }
    }
    
    return newOptions;
  });
}