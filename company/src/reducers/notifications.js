// types
import {
    COMPANY_NOTIFICATIONS_LOADED,
    POSITION_NOTIFICATIONS_LOADED,
    LOGOUT_USER,

} from '../actions/types';


// initial state
const initialState = {
    allCompanyNotifications: null,
    allPositionNotifications: null,
};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        
        case COMPANY_NOTIFICATIONS_LOADED:
            return {
                ...state,
                allCompanyNotifications: payload.data.result,
            }
        case POSITION_NOTIFICATIONS_LOADED:
            return {
                ...state,
                allPositionNotifications: payload.data.result,
            }
            case LOGOUT_USER:
              return initialState;

        default:
            return state;
    }
}
