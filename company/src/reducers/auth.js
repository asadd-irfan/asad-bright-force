// types
import {
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    USER_LOADED,
    AUTH_ERROR,
    LOGOUT_USER,
    CLEAR_USER_ERRORS,
    AUTH_LOADING_TRUE,
    APP_CONFIGS_LOADED,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    RESET_NOTIFICATION_SETTING,
    CURRENT_SETTINGS_NAVBAR_BUTTON,
    CURRENT_HIRE_NAVBAR_BUTTON,

} from '../actions/types';

// initial state
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    authBtnLoading: false,
    user: null,
    userErrors: null,
    appConfigs: null,
    apiResponse: null,
    showSuccessNotification: false,
    showFailureNotification: false,
    currentSettingNavbarButton: '',
    currentHireNavbarButton: '',

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
                authBtnLoading: false,
                user: payload
            };
        case CLEAR_USER_ERRORS:
            return {
                ...state,
                userErrors: null
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            localStorage.setItem('userType', 'company');
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                authBtnLoading: false,
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                authBtnLoading: false,
                userErrors: payload
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                authBtnLoading: false,
                userErrors: payload
            };
        case LOGOUT_USER:
            return {
                ...state,
                token: localStorage.removeItem('token'),
                isAuthenticated: null,
                loading: false,
                authBtnLoading: false,
                user: null,
                userErrors: null,
                appConfigs: null,
            };
        case AUTH_ERROR:
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                authBtnLoading: false,
            };
        case AUTH_LOADING_TRUE:
            return {
                ...state,
                authBtnLoading: true
            };
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
                authBtnLoading: false,
                userErrors: null,
                showSuccessNotification: true,
            }
        }
        case UPDATE_FAILURE: {
            return {
                ...state,
                authBtnLoading: false,
                apiResponse: null,
                userErrors: payload,
                showFailureNotification: true,
            }
        }
        case RESET_NOTIFICATION_SETTING: {
            return {
                ...state,
                btnLoading: false,
                apiResponse: null,
                showFailureNotification: false,
                showSuccessNotification: false,
                showSidebarFailureNotification: false,
                showSidebarSuccessNotification: false,
            }
        }
        case CURRENT_SETTINGS_NAVBAR_BUTTON: {
            return {
                ...state,
                currentSettingNavbarButton: payload,
            }
        }
        case CURRENT_HIRE_NAVBAR_BUTTON: {
            return {
                ...state,
                currentHireNavbarButton: payload,
            }
        }
        default:
            return state;
    }
}
