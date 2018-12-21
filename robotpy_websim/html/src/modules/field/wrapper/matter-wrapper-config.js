export default {
  Axes: {},
  Bodies: {
    circle: {
      0: 'toPx',
      1: 'toPx',
      2: 'toPx',
      3: 'bodyOptionsConverter'
    },
    fromVertices: {
      0: 'toPx',
      1: 'toPx',
      2: 'toPxVertices',
      3: 'bodyOptionsConverter',
      6: 'toPx'
    },
    polygon: {
      0: 'toPx',
      1: 'toPx',
      3: 'toPx',
      4: 'bodyOptionsConverter'
    },
    rectangle: {
      0: 'toPx',
      1: 'toPx',
      2: 'toPx',
      3: 'toPx',
      4: 'bodyOptionsConverter'
    },
    trapezoid: {
      0: 'toPx',
      1: 'toPx',
      2: 'toPx',
      3: 'toPx',
      5: 'bodyOptionsConverter'
    }
  },
  Body: {
    scale: {
      3: 'toPxVector'
    },
    setAngularVelocity: {
      1: 'toRadPerUpdate'
    },
    setPosition: {
      1: 'toPxVector'
    },
    setVelocity: {
      1: 'toPxPerUpdateVector'
    },
    setVertices: {
      1: 'toPxVertices'
    },
    translate: {
      1: 'toPxVector'
    }
  },
  Bounds: {
    contains: {
      1: 'toPxVector'
    },
    create: {
      0: 'toPxVertices'
    },
    shift: {
      1: 'toPxVector'
    },
    translate: {
      1: 'toPxVector'
    },
    update: {
      1: 'toPxVertices',
      2: 'toPxVector'
    }
  },
  Common: {},
  Composite: {
    rotate: {
      2: 'toPxVector'
    },
    scale: {
      3: 'toPxVector'
    },
    translate: {
      1: 'toPxVector'
    }
  },
  Composites: {
    car: {
      0: 'toPx',
      1: 'toPx',
      2: 'toPx',
      3: 'toPx',
      4: 'toPx'
    },
    chain: {
      1: 'toPx',
      2: 'toPx',
      3: 'toPx',
      4: 'toPx',
      5: 'bodyOptionsConverter'
    },
    mesh: {
      4: 'bodyOptionsConverter'
    },
    newtonsCradle: {
      0: 'toPx',
      1: 'toPx',
      3: 'toPx',
      4: 'toPx'
    },
    pyramid: {
      0: 'toPx',
      1: 'toPx',
      4: 'toPx',
      5: 'toPx'
    },
    softBody: {
      0: 'toPx',
      1: 'toPx',
      4: 'toPx',
      5: 'toPx',
      7: 'toPx',
      8: 'bodyOptionsConverter',
      9: 'constraintOptionsConverter'
    },
    stack: {
      0: 'toPx',
      1: 'toPx',
      4: 'toPx',
      5: 'toPx'
    }
  },
  Constraint: {
    create: {
      0: 'constraintOptionsConverter'
    }
  },
  Contact: {},
  Detector: {},
  Engine: {},
  Events: {},
  Grid: {
    create: {
      0: 'gridOptionsConverter'
    }
  },
  Mouse: {},
  MouseConstraint: {},
  Pair: {},
  Pairs: {},
  Plugin: {},
  Query: {
    point: {
      1: 'toPxVector'
    },
    ray: {
      1: 'toPxVector',
      2: 'toPxVector',
      3: 'toPx'
    }
  },
  Render: {
    create: {
      0: 'renderOptionsConverter'
    },
    lookAt: {
      1: 'renderLookAtObjectConverter',
      2: 'toPxVector'
    }
  },
  RenderPixi: {},
  Resolver: {},
  Runner: {},
  SAT: {},
  Sleeping: {},
  Svg: {},
  Vector: {},
  Vertices: {},
  World: {
    rotate: {
      2: 'toPxVector'
    },
    scale: {
      3: 'toPxVector'
    },
    translate: {
      1: 'toPxVector'
    }
  }
};