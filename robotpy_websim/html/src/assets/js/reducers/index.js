import * as ActionTypes from "../constants/action-types";
import { set } from 'lodash';

const initialState = {
  halData: {
    initialized: false,
    out: {},
    in: {}
  },
  networktables: {
    values: {},
    rawValues: {},
    wsConnected: false,
    robotConnected: false
  },
  robotMode: null,
  isRunning: false,
  simSocket: null,
  layout: {
    registered: [],
    added: [],
    menuItems: []
  }
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
    case ActionTypes.ADDED_TO_LAYOUT:
      return {
        ...state,
        layout: {
          ...state.layout,
          added: [...state.layout.added, action.payload.tagName]
        }
      };
    case ActionTypes.REMOVED_FROM_LAYOUT:
      let added = [...state.layout.added];
      var index = added.indexOf(action.payload.tagName);
      if (index !== -1) 
        added.splice(index, 1);

      return {
        ...state,
        layout: {
          ...state.layout,
          added
        }
      };
    case ActionTypes.REGISTER_WITH_LAYOUT:
      return {
        ...state,
        layout: {
          ...state.layout,
          registered: [...state.layout.registered, action.payload.tagName]
        }
      };
    case ActionTypes.MODULE_MENU_UPDATED:
      return {
        ...state,
        layout: {
          ...state.layout,
          menuItems: action.payload.menuItems
        }
      };
    case ActionTypes.NT_ROBOT_CONNECTION_CHANGED:
      return {
        ...state,
        networktables: {
          ...state.networktables,
          robotConnected: action.payload.connected
        }
      };
    case ActionTypes.NT_WEBSOCKET_CONNECTION_CHANGED:
      return {
        ...state,
        networktables: {
          ...state.networktables,
          wsConnected: action.payload.connected
        }
      };
    case ActionTypes.NT_VALUE_CHANGED:

      let values = { ...state.networktables.values };
      
      let path = action.payload.key.split('/')
        .filter(segment => {
          return segment !== '';
        })
        .map(segment => {
          return `['${segment}']`;
        })
        .join('');

      set(values, path, action.payload.value);

      return {
        ...state,
        networktables: {
          ...state.networktables,
          values,
          rawValues: {
            ...state.networktables.rawValues,
            [action.payload.key]: action.payload.value
          }
        }
      };
    default:
      return state;
  }
}

export default rootReducer;