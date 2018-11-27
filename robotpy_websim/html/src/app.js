import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import "assets/js/tags/app.tag";

window.sim = {
  riot,
  store
};

riotReduxConnect(riot, store);

riot.mount('app');


