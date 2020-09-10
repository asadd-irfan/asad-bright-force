// types
import {
  FILTER_APP_CONFIGS,
  SET_APP_CONFIG_KEYS,
  COEFFICIENT_CONFIGS,

} from '../actions/types';


// initial state
const initialState = {
  filterAppConfigs: [],
  appConfigKeys: [],
  coefficientConfigs: null,

};

// handle actions
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FILTER_APP_CONFIGS:
      return {
        ...state,
        filterAppConfigs: payload,
      };
      case SET_APP_CONFIG_KEYS:
        return {
          ...state,
          appConfigKeys: payload,
        };
      case COEFFICIENT_CONFIGS:
        return {
          ...state,
          coefficientConfigs: payload,
        };
      
    default:
      return state;
  }
}
