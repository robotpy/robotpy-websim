import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index"; 
import throttle from "redux-throttle";


const pauseResumeSimMiddleware = store => next => action => {
  if (action.type === 'PAUSE_SIM') {
    window.sim.socket.pauseSim();
  } 
  else if (action.type === 'RESUME_SIM') {
    window.sim.socket.resumeSim();
  }
  else if (action.type === 'STEP_TIME') {
    window.sim.socket.stepTime(action.payload.time);
  }
  next(action);
};

const throttleMiddleware = throttle(300, {
  leading: true,
  trailing: true
});

const middleware = applyMiddleware(pauseResumeSimMiddleware, throttleMiddleware);
const store = createStore(rootReducer, middleware);

export default store;