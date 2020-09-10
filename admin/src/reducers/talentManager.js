// types
import {
  TALENT_MANAGERS_LOADED,
  ACCOUNT_MANAGERS_LOADED,
  ALL_ACCOUNT_MANAGERS,
  ACCOUNT_MANAGER,

} from '../actions/types';


// initial state
const initialState = {
  allTalentManagers: null,
  allAccountManagers: null,
  allTalentManagersCount: 0,
  allAdmins: null,
  allAdminsCount: 0,
  btnLoading: false,
  accountManager: null
};

// handle actions
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TALENT_MANAGERS_LOADED:
      return {
        ...state,
        allTalentManagers: payload.data.result,
        allTalentManagersCount: payload.data.length ? payload.data.length : 0,
        btnLoading: false,
      };
    case ALL_ACCOUNT_MANAGERS:
      return {
        ...state,
        allAccountManagers: payload.data.result,
        // allTalentManagersCount: payload.data.length ? payload.data.length : 0,
        btnLoading: false,
      };
    case ACCOUNT_MANAGER:
      return {
        ...state,
        accountManager: payload,
      };
    case ACCOUNT_MANAGERS_LOADED:
      return {
        ...state,
        allAdmins: payload.data.result,
        allAdminsCount: payload.data.length ? payload.data.length : 0,
        btnLoading: false,
      };
    default:
      return state;
  }
}
