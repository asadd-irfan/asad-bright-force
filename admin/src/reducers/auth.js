// types
import {
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT_USER,
    CLEAR_SERVER_ERRORS,
    AUTH_LOADING_TRUE,
    SAVE_TALENT_PROFILE_SUCCESS,
    SAVE_TALENT_PROFILE_FAILURE,
    RESET_NOTIFICATION_SETTING,
    APP_CONFIGS_LOADED,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    UPDATE_EVALUATION_SUCCESS,
    UPDATE_EVALUATION_FAILURE,
    TM_LOADED,
    INVITE_USER_SUCCESS,
    SET_SIDEBAR_KEY,
    CURRENT_STAFF_NAVBAR_BUTTON,

} from '../actions/types';
import jwtDecode from 'jwt-decode'


// initial state
const initialState = {
    token: localStorage.getItem('token'),
    decodedToken: null,
    isAuthenticated: null,
    loading: true,
    btnLoading: false,
    user: null,
    appConfigs: null,
    serverErrors: null,
    showSuccessNotification: false,
    showFailureNotification: false,
    apiResponse: null,
    evaluationDetails: null,
    TMManagersCalendarDetail: null,
    inviteMailToken: null,
    sidebarKey: '1',
    currentStaffNavbarButton: '',

};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                btnLoading: false,
                user: payload
            };
        case CLEAR_SERVER_ERRORS:
            return {
                ...state,
                serverErrors: null
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            const decodedToken = jwtDecode(payload.token);
            localStorage.setItem('token', payload.token);
            localStorage.setItem('userType', decodedToken.user.app);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                decodedToken: decodedToken,
                btnLoading: false,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                btnLoading: false,
                serverErrors: payload
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                btnLoading: false,
                serverErrors: payload
            };
        case LOGOUT_USER:
            return {
                ...state,
                token: localStorage.removeItem('token'),
                isAuthenticated: null,
                loading: false,
                btnLoading: false,
                user: null,
                serverErrors: null,
                showSuccessNotification: false,
                showFailureNotification: false,
            };
        case AUTH_ERROR:
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                btnLoading: false,
            };
        case AUTH_LOADING_TRUE:
            return {
                ...state,
                btnLoading: true
            }
        case SAVE_TALENT_PROFILE_SUCCESS:
            return {
                ...state,
                user: payload.data,
                btnLoading: false,
                showSuccessNotification: true,
            }
        case SAVE_TALENT_PROFILE_FAILURE:
            return {
                ...state,
                serverErrors: payload,
                btnLoading: false,
                showFailureNotification: true,
                showSuccessNotification: false,
            }
        case RESET_NOTIFICATION_SETTING: {
            return {
                ...state,
                btnLoading: false,
                showFailureNotification: false,
                showSuccessNotification: false,
            }
        }
        case APP_CONFIGS_LOADED: {
            return {
                ...state,
                appConfigs: payload
            }
        }
        case UPDATE_SUCCESS: {
            let response = ''
            if (payload.data && payload.data.message !== undefined && payload.data.message !== null) {
                response = payload.data.message
            }
            else {
                response = payload
            }
            return {
                ...state,
                apiResponse: response,
                btnLoading: false,
                showSuccessNotification: true,
            }
        }
        case UPDATE_FAILURE: {
            return {
                ...state,
                btnLoading: false,
                serverErrors: payload,
                showFailureNotification: true,
            }
        }
        case INVITE_USER_SUCCESS:
            return {
                ...state,
                btnLoading: false,
                inviteMailToken: payload.data.URL
            }
        case UPDATE_EVALUATION_SUCCESS: {
            return {
                ...state,
                evaluationDetails: payload
            }
        }
        case UPDATE_EVALUATION_FAILURE: {
            return {
                ...state,
                evaluationDetails: payload
            }
        }

        case TM_LOADED: {
            return {
                ...state,
                TMManagersCalendarDetail: payload
            }
        }
        case SET_SIDEBAR_KEY: {
            return {
                ...state,
                sidebarKey: payload
            }
        }
        case CURRENT_STAFF_NAVBAR_BUTTON: {
            return {
                ...state,
                currentStaffNavbarButton: payload
            }
        }
        default:
            return state;
    }
}
