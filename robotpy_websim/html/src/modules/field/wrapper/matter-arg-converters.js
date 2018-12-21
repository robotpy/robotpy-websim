
export function addArgConverters(wrapper, pxPerFt, updatesPerSec) {

  wrapper.addArgConverter('toPx', (ft) => {
    return ft * pxPerFt;
  });
  
  wrapper.addArgConverter('toPxVector', (ftVector) => {
    return {
      x: ftVector.x * pxPerFt,
      y: ftVector.y * pxPerFt
    };
  });
  
  wrapper.addArgConverter('toRadPerUpdate', (radPerSec) => {
    return radPerSec / updatesPerSec;
  });
  
  wrapper.addArgConverter('toPxPerUpdateVector', (ftVectorPerTimeStep) => {
    return {
      x: ftVectorPerTimeStep.x / updatesPerSec * pxPerFt,
      y: ftVectorPerTimeStep.y / updatesPerSec * pxPerFt
    };
  });
  
  wrapper.addArgConverter('toPxVertices', (ftVertices) => {
    return ftVertices.map(ftVertex => {
      return {
        x: ftVertex.x * pxPerFt,
        y: ftVertex.y * pxPerFt
      }
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
        x: options.position.x * pxPerFt,
        y: options.position.y * pxPerFt
      };
    }
  
    if (options.render && options.render.lineWidth) {
      newOptions.render.lineWidth = options.render.lineWidth * pxPerFt;
    }
  
    if (options.vertices) {
      newOptions.vertices = options.vertices.map((vertex) => {
        return {
          x: vertex.x * pxPerFt,
          y: vertex.y * pxPerFt
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
        x: options.pointA.x * pxPerFt,
        y: options.pointA.y * pxPerFt
      };
    }

    if (options.pointB) {
      newOptions.pointB = {
        x: options.pointB.x * pxPerFt,
        y: options.pointB.y * pxPerFt
      };
    }    

    if (options.render && options.render.lineWidth) {
      newOptions.render.lineWidth = options.render.lineWidth * pxPerFt;
    }

    return newOptions;
  });

  wrapper.addArgConverter('gridOptionsConverter', (options) => {
    
    let newOptions = {

    };

    if (options.bucketHeight) {
      newOptions.bucketHeight = options.bucketHeight * pxPerFt;
    }

    if (options.bucketWidth) {
      newOptions.bucketWidth = options.bucketWidth * pxPerFt;
    }

    return newOptions;
  });

  wrapper.addArgConverter('renderLookAtObjectConverter', (objects) => {
    
    return objects.map(object => {

      let newObject = {};

      if (object.position) {
        newObject.position.x = object.position.x * pxPerFt;
        newObject.position.y = object.position.y * pxPerFt;
      }
  
      if (object.min) {
        newObject.min = object.min * pxPerFt;
      }
  
      if (object.max) {
        newObject.max = object.max * pxPerFt;
      }
  
      if (object.x) {
        newObject.x = object.x * pxPerFt;
      }
  
      if (object.y) {
        newObject.y = object.y * pxPerFt;
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
        newOptions.options.height = options.options.height * pxPerFt;
      }

      if (options.options.width) {
        newOptions.options.width = options.options.width * pxPerFt;
      }
    }
    
    return newOptions;
  });
}