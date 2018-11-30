import * as actions from './actions';

export default class NetworkTablesWrapper {

  constructor(store) {
    this.store = store;

    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener((connected) => {
      this.store.dispatch(actions.ntRobotConnectionChanged(connected));
    }, true);
    
    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener((connected) => {
      this.store.dispatch(actions.ntWsConnectionChanged(connected));
    }, true);
    
    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener((key, value, isNew) => {
      this.store.dispatch(actions.ntValueChanged(key, value));
    }, true);
  }
} 