import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import SimSocket from './assets/js/sim-socket';
import "assets/js/tags/app.tag";
import * as actions from  'assets/js/actions';

window.sim = {
  riot,
  store,
  actions,
  registerToLayout: function(tagName) {
    store.dispatch(actions.registerToLayout(tagName));
  }
};

riotReduxConnect(riot, store);
const simSocket = new SimSocket(store);

riot.mount('app');


