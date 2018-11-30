import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import SimSocket from './assets/js/sim-socket';
import "assets/js/tags/app.tag";
import * as actions from  'assets/js/actions';
import 'assets/scss/app.scss';

window.sim = {
  store,
  actions,
  registerWithLayout: function(tagName) {
    store.dispatch(actions.registerWithLayout(tagName));
  }
};

riotReduxConnect(riot, store);
const simSocket = new SimSocket(store);

riot.mount('app');


