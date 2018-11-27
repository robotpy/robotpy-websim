import * as actions from './actions/main';

export default class SimSocket {

  constructor(store) {
    this.store = store;
    this.socket = null;
    this.setupSocket();
    this.robotMode = null;
  }

  setupSocket() {
    let l = window.location;
    let port = process.env.socket_port || l.port;
    let url = "ws://" + l.hostname + ":" + port + "/api";

    this.socket = new WebSocket(url);
    this.socket.onopen = () => this.store.dispatch(actions.simStart());
    this.socket.onclose = () => this.store.dispatch(actions.simStop());
    this.socket.onmessage = (msg) => {
      const state = this.store.getState();
      const data = JSON.parse(msg.data);
      
      // first message is in/out data, all other messages are just out data
      // -> TODO: support message types
      if (!state.halData.initialized) {
        this.store.dispatch(actions.initializeHalData(data.out, data.in));
      } 
      else {
        this.store.dispatch(actions.updateHalDataOut(data));
      }
    };

    this.store.dispatch(actions.simSocketInitialized(this));

    this.store.subscribe(() => {
      const { robotMode } = this.store.getState();
      if (this.robotMode !== robotMode) {
        this.robotMode = robotMode;
        const mode = robotMode === 'disabled' ? 'teleop' : robotMode;
        const enabled = robotMode !== 'disabled';
        this.sendRobotMode(mode, enabled);
      }
    });
  }

  sendHalData() {
    const msg = {
      msgtype: 'input',
      data: this.store.getState().halData.in
    };
    this.socket.send(JSON.stringify(msg));
  }

  sendRobotMode(mode, enabled) {
    const msg = {
      msgtype: 'mode',
      mode,
      enabled
    };
    this.socket.send(JSON.stringify(msg));
  }
}