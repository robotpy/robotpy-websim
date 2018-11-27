import * as ActionTypes from "../constants/action-types";

const initialState = {
  halData: {
    initialized: false,
    out: {},
    in: {}
  },
  robotMode: null,
  isRunning: false,
  simSocket: null
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.INITIALIZE_SIM_SOCKET:
      return {
        ...state,
        simSocket: action.payload.simSocket
      };
    case ActionTypes.INITIALIZE_HAL_DATA:
      return {
        ...state,
        halData: {
          out: action.payload.dataOut,
          in: action.payload.dataIn,
          initialized: true
        }
      };
    case ActionTypes.UPDATE_HAL_DATA_OUT:
      return { 
        ...state, 
        halData: {
          ...state.halData,
          out: {
            ...state.halData.out,
            ...action.payload
          }
        }
      };
    case ActionTypes.UPDATE_HAL_DATA_IN:
      let dataIn = { ...state.halData.in };
      _.forEach(action.payload.updates, (value, key) => {
        set(dataIn, key, value);
      });
      return { 
        ...state, 
        halData: {
          ...state.halData,
          in: dataIn
        }
      };
    case ActionTypes.ROBOT_MODE_UPDATE:
      return { ...state, robotMode: action.payload.robotMode };
    case ActionTypes.SIM_STOPPED:
      return { 
        ...state, 
        isRunning: false 
      };
    case ActionTypes.SIM_STARTED:
      return { 
        ...state, 
        isRunning: true,
        halData: {
          out: {},
          in: {},
          initialized: false
        }
      };
    default:
      return state;
  }
}

export default rootReducer;