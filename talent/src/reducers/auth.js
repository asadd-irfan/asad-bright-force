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
    UPDATE_SIDEBAR_SUCCESS,
    UPDATE_SIDEBAR_FAILURE,
    AUTH_LOADING_FALSE,
    CURRENT_NAVBAR_BUTTON,


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
    serverErrorsSidebar: null,
    showSuccessNotification: false,
    showFailureNotification: false,
    showSidebarSuccessNotification: false,
    showSidebarFailureNotification: false,
    apiResponse: null,
    evaluationDetails: null,
    MeetingCalendarDetail: null,
    currentNavbarButton: '',

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
        case AUTH_LOADING_FALSE:
            return {
                ...state,
                btnLoading: false
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
                appConfigs: null,
                showSidebarSuccessNotification: false,
                showSidebarFailureNotification: false,
                apiResponse: null,
                evaluationDetails: null,
                MeetingCalendarDetail: null,
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
        case UPDATE_SIDEBAR_SUCCESS:
            return {
                ...state,
                user: payload.data,
                btnLoading: false,
                showSidebarSuccessNotification: true,
            }
        case UPDATE_SIDEBAR_FAILURE:
            return {
                ...state,
                serverErrorsSidebar: payload,
                btnLoading: false,
                showSidebarFailureNotification: true,
                showSidebarSuccessNotification: false,
            }
        case RESET_NOTIFICATION_SETTING: {
            return {
                ...state,
                btnLoading: false,
                showFailureNotification: false,
                showSuccessNotification: false,
                showSidebarFailureNotification: false,
                showSidebarSuccessNotification: false,
            }
        }
        case APP_CONFIGS_LOADED: {
            return {
                ...state,
                appConfigs: payload
            }
        }
        case UPDATE_SUCCESS: {
            return {
                ...state,
                apiResponse: payload,
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
                MeetingCalendarDetail: payload
            }
        }
        case CURRENT_NAVBAR_BUTTON: {
            return {
                ...state,
                currentNavbarButton: payload
            }
        }
        default:
            return state;
    }
}
