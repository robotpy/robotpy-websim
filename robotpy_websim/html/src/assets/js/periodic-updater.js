import * as actions from './actions';

export default class PeriodicUpdater {

  constructor(store) {

    this.updates = {};
    this.listeners = [];
    
    const update = () => {
      this.listeners.forEach((listener) => {
        this.updates = listener(this.updates);
      });
      store.dispatch(actions.periodicUpdate(this.updates));
      this.updates = {}; 
      window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  addUpdates(callback) {
    this.updates = callback(this.updates);
  }
} 