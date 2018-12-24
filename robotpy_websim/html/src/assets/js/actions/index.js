import * as ActionTypes from "../constants/action-types";

export function simStart() {
  return {
    type: ActionTypes.SIM_STARTED
  };
}

export function simStop() {
  return {
    type: ActionTypes.SIM_STOPPED
  };
}

export function simSocketInitialized(simSocket) {
  return {
    type: ActionTypes.INITIALIZE_SIM_SOCKET,
    payload: {
      simSocket
    }
  }
}

export function initializeHalData(dataOut, dataIn) {
  return {
    type: ActionTypes.INITIALIZE_HAL_DATA,
    payload: {
      dataOut,
      dataIn
    }
  };
}

export function updateConfig(config) {
  return {
    type: ActionTypes.UPDATE_CONFIG,
    payload: {
      config
    }
  };
}

export function updateUserConfig(userConfig) {
  return {
    type: ActionTypes.UPDATE_USER_CONFIG,
    payload: {
      userConfig
    }
  };
}

export function pauseSim() {
  return {
    type: ActionTypes.PAUSE_SIM
  };
}

export function resumeSim() {
  return {
    type: ActionTypes.RESUME_SIM
  };
}

export function stepTime(time) {
  return {
    type: ActionTypes.STEP_TIME,
    payload: {
      time
    }
  };
}

export function updateHalDataIn(key, value) {

  let updates = {};

  if (arguments.length == 2) {
    const key = arguments[0];
    const value = arguments[1];
    updates[key] = value;
  }
  else {
    updates = arguments[0];
  }

  return {
    type: ActionTypes.UPDATE_HAL_DATA_IN,
    payload: {
      updates
    },
    meta: {
      debounce: {
        time: 300
      }
    }
  };
}

export function updateRobotMode(mode) {
  return {
    type: ActionTypes.ROBOT_MODE_UPDATE,
    payload: {
      robotMode: mode
    }
  };
}

export function updateGameSpecificMessage(message) {
  return {
    type: ActionTypes.UPDATE_GAME_SPECIFIC_MESSAGE,
    payload: {
      message
    }
  };
}

export function registerWithLayout(tagName, config = {}) {
  config = { 
    label: tagName,
    category: 'Unknown',
    ...config
  };
  return {
    type: ActionTypes.REGISTER_WITH_LAYOUT,
    payload: {
      tagName,
      config
    }
  };
}

export function addedToLayout(tagName) {
  return {
    type: ActionTypes.ADDED_TO_LAYOUT,
    payload: {
      tagName
    }
  };
}

export function removeFromLayout(tagName) {
  return {
    type: ActionTypes.REMOVED_FROM_LAYOUT,
    payload: {
      tagName
    }
  };
}

export function moduleMenuUpdated(menuItems) {
  return {
    type: ActionTypes.MODULE_MENU_UPDATED,
    payload: {
      menuItems
    }
  };
}

export function periodicUpdate(updates) {
  return {
    type: ActionTypes.PERIODIC_UPDATE,
    payload: updates
  }
}

/**
 * NetworkTables actions
 */

export function ntRobotConnectionChanged(connected) {
  return {
    type: ActionTypes.NT_ROBOT_CONNECTION_CHANGED,
    payload: {
      connected
    }
  };
}

export function ntWsConnectionChanged(connected) {
  return {
    type: ActionTypes.NT_WEBSOCKET_CONNECTION_CHANGED,
    payload: {
      connected
    }
  };
}

export function ntValueChanged(key, value) {
  return {
    type: ActionTypes.NT_VALUE_CHANGED,
    payload: {
      key,
      value
    }
  };
}