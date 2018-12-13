import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import SimSocket from './assets/js/sim-socket';
import PeriodicUpdater from './assets/js/periodic-updater';
import NetworkTablesWrapper from './assets/js/networktables';
import Gamepads from './assets/js/gamepads';
import * as drivetrains from './assets/js/physics/drivetrains';
import "assets/js/tags/app.tag";
import * as actions from  'assets/js/actions';
import 'assets/scss/app.scss';



window.sim = {
  periodicUpdater: new PeriodicUpdater(store),
  store,
  actions,
  physics: {
    drivetrains
  },
  registerWithLayout: function(tagName) {
    store.dispatch(actions.registerWithLayout(tagName));
  }
};

riotReduxConnect(riot, store);
const simSocket = window.sim.socket = new SimSocket(store);
const ntWrapper = new NetworkTablesWrapper(store);
const gamepads = new Gamepads(store);

riot.mount('app');


