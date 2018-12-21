import config from './matter-wrapper-config';
import { addArgConverters } from './matter-arg-converters';
import Wrapper from './wrapper';
import * as _ from 'lodash';


export function wrapMatter(Matter, pxPerFt, updatesPerSec) {

  let MatterWrapper = {};

  _.forEach(config, (moduleConfig, moduleName) => {
    let moduleWrapper = new Wrapper(Matter[moduleName]);
    addArgConverters(moduleWrapper, pxPerFt, updatesPerSec);

    _.forEach(moduleConfig, (functionConfig, functionName) => {
      moduleWrapper.addFunctionWrapper(functionName, functionConfig);
    });    

    MatterWrapper[moduleName] = moduleWrapper.getInterface();
  });

  return MatterWrapper;
}