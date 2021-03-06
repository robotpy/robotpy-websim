import * as actions from './actions';

export default class SimSocket {

  constructor(store) {
    this.store = store;
    this.socket = null;
    this.setupSocket();
    this.robotMode = 'disabled';
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
        this.store.dispatch(actions.updateConfig(data.config));
        this.store.dispatch(actions.updateUserConfig(data.user_config));
        this.store.dispatch(actions.initializeHalData(data.out, data.in));
      } 
      else {
        window.sim.periodicUpdater.addUpdates((updates) => {
          return {
            ...updates,
            halDataOut: data.hal_data,
            time: {
              total: data.total_time,
              mode: data.mode_time,
              paused: data.paused
            }
          };
        });
      }

      this.sendHalData();
    };

    this.store.dispatch(actions.simSocketInitialized(this));

    this.store.subscribe(() => {
      const { robotMode, gameSpecificMessage } = this.store.getState();
      if (this.robotMode === robotMode) {
        return;
      }

      if (robotMode === 'disabled') {
        this.sendRobotMode('teleop', false)
      }
      else if (robotMode === 'auto') {
        this.setAutonomous(gameSpecificMessage);
      }
      else {
        this.sendRobotMode(robotMode, true);
      }
    });
  }

  addDeviceGyroChannel(angleKey) {
    const msg = {
      msgtype: 'add_device_gyro_channel',
      angle_key: angleKey
    };
    this.socket.send(JSON.stringify(msg));
  }

  updateGyros(da) {
    const msg = {
      msgtype: 'update_gyros',
      da
    };
    this.socket.send(JSON.stringify(msg));
  }

  sendHalData() {
    let halDataIn = { ...this.store.getState().halData.in };
    delete halDataIn['analog_gyro'];
    const msg = {
      msgtype: 'input',
      data: halDataIn
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

  setAutonomous(gameSpecificMessage) {
    const msg = {
      msgtype: 'set_autonomous',
      game_specific_message: gameSpecificMessage
    };
    this.socket.send(JSON.stringify(msg));
  }

  pauseSim() {
    const msg = {
      msgtype: 'pause_sim'
    };
    this.socket.send(JSON.stringify(msg));
  }

  resumeSim() {
    const msg = {
      msgtype: 'resume_sim'
    };
    this.socket.send(JSON.stringify(msg));
  }
  
  stepTime(time) {
    const msg = {
      msgtype: 'step_time',
      time
    };
    this.socket.send(JSON.stringify(msg));
  }
}