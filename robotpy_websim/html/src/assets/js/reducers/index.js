import * as ActionTypes from "../constants/action-types";
import { set } from 'lodash';

const initialState = {
  halData: {
    initialized: false,
    out: {},
    in: {}
  },
  time: {
    mode: 0,
    total: 0,
    paused: false
  },
  networktables: {
    values: {},
    rawValues: {},
    wsConnected: false,
    robotConnected: false
  },
  gamepads: [],
  robotMode: 'disabled',
  gameSpecificMessage: '',
  isRunning: false,
  simSocket: null,
  layout: {
    categories: ['Unknown'],
    registered: {},
    added: [],
    menuItems: []
  },
  config: {},
  userConfig: {}
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
    case ActionTypes.UPDATE_CONFIG:
      return {
        ...state,
        config: action.payload.config
      };
    case ActionTypes.UPDATE_USER_CONFIG:
      return {
        ...state,
        userConfig: action.payload.userConfig
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
    case ActionTypes.UPDATE_GAME_SPECIFIC_MESSAGE:
      return { ...state, gameSpecificMessage: action.payload.message}
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

      var added = [...state.layout.added];

      if (added.indexOf(action.payload.tagName) === -1) {
        added.push(action.payload.tagName);
      }

      return {
        ...state,
        layout: {
          ...state.layout,
          added
        }
      };
    case ActionTypes.REMOVED_FROM_LAYOUT:

      var added = [...state.layout.added];
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

      let categories = state.layout.categories;
      let category = action.payload.config.category;

      if (categories.indexOf(category) < 0) {
        categories.push(category);
      }

      return {
        ...state,
        layout: {
          ...state.layout,
          categories,
          registered: {
            ...state.layout.registered,
            [action.payload.tagName]: action.payload.config
          }
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
    case ActionTypes.PERIODIC_UPDATE:
      const newState = { ...state };

      if (action.payload.gamepads) {
        newState.gamepads = action.payload.gamepads;
      }

      if (action.payload.halDataOut) {
        newState.halData.out = {
          ...newState.halData.out,
          ...action.payload.halDataOut
        }
      }

      if (action.payload.time) {
        newState.time = action.payload.time;
      }

      return newState;
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
      
      let segments = action.payload.key.split('/')
        .filter(segment => {
          return segment !== '';
        });

      if (segments.length > 0 && !action.payload.key.endsWith('/')) {
        segments[segments.length - 1] += '/';
      }

      let path = segments
        .map(segment => {
          return `['${segment}']`;
        })
        .join('');

      if (action.payload.key.endsWith('/')) {
        path += "['/']";
      }

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