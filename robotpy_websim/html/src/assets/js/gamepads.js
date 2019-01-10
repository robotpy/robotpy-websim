import * as actions from './actions';

export default class Gamepads {

  constructor(store) {
    window.sim.periodicUpdater.addListener((updates) => {
      return {
        ...updates,
        gamepads: [...window.navigator.getGamepads()]
      }
    });
  }
} 
