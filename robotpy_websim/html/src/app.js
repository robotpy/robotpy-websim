import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import SimSocket from './assets/js/sim-socket';
import "assets/js/tags/app.tag";

window.sim = {
  riot,
  store
};

riotReduxConnect(riot, store);
const simSocket = new SimSocket(store);

riot.mount('app');


