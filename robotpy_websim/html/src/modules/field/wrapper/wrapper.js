
export default class Wrapper {

  constructor(originalInterface) {
    this.interface = { ...originalInterface };
    this.argConverters = {};
  }

  addFunctionWrapper(functionName, settings) {

    let that = this;

    const originalFunction = this.interface[functionName];
    this.interface[functionName] = function() {
      const args = [...arguments].map((arg, i) => {
        const argConverterType = settings[i];

        if (argConverterType === undefined) {
          return arg;
        }

        const argConverter = that.argConverters[argConverterType];

        if (argConverter === undefined) {
          throw new Error(`Could not convert value, unknown type ${argConverterType}`);
        }
        else {
          return argConverter(arg);
        }
      });
      
      return originalFunction.apply(null, args);
    };
  }

  addArgConverter(name, converter) {
    this.argConverters[name] = function(value) {
      return converter(value);
    }
  }

  getInterface() {
    return this.interface;
  }
}



