import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { loadApi, setCurrentNavbarButton } from './common';
// types

import {
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT_USER,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    USER_LOADED,
    // AUTH_ERROR,
    AUTH_LOADING_TRUE,
    CLEAR_SERVER_ERRORS,
    APP_CONFIGS_ERROR,
    APP_CONFIGS_LOADED,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
} from './types';

// load user
export const loadUser = () => async dispatch => {
    //set header
    if (localStorage.token) {
        setAuthToken(localStorage.token);

        try {
            //get talent user
            await axios.get('/api/talent/me').then(result => {
                if (result.data.role) {
                    dispatch({
                        type: USER_LOADED,
                        payload: result.data
                    });
                } else throw new Error('Unauthorized role');
            });
        } catch (error) {
            // dispatch({ type: AUTH_ERROR, payload: error.response.data });
        }
    }
};

// clear user errors
export const clearServerErrors = () => async dispatch => {
    dispatch({
        type: CLEAR_SERVER_ERRORS,
    });
};
export const registerUser = ({ name, email, password, role }) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    //set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //set body
    const body = JSON.stringify({ name, email, password, role });
    try {
        //post user
        const res = await axios.post(`/api/talent/register`, body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        setTimeout(() => {
            dispatch({
                type: AUTH_LOADING_TRUE
            });
            dispatch(loadUser());
            dispatch(setCurrentNavbarButton('profile'))
        }, 1000);
    } catch (error) {
        dispatch({ type: REGISTER_FAILURE, payload: error.response.data });
    }
};

// login user
export const loginUser = ({ email, password }) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    // set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // set body
    const body = JSON.stringify({ email, password });

    try {
        // login user
        const res = await axios.post(`/api/talent/login`, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
        dispatch(setCurrentNavbarButton('profile'))

    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error.response.data });
    }
};

export const logoutUser = () => async dispatch => {
    // set header
    setAuthToken();
    dispatch({
        type: LOGOUT_USER,
    });

};

export const changePassword = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/updateMyPassword`, 'patch', values));
};
export const changeTimeZoneCurrency = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/timezone`, 'patch', values));
};

export const loadAppConfigs = () => async dispatch => {
    try {
        const res = await axios.get('/api/admin/app-configs');
        dispatch({
            type: APP_CONFIGS_LOADED,
            payload: res.data.result
        });
    } catch (error) {
        dispatch({ type: APP_CONFIGS_ERROR, payload: error });
    }
};

export const forgetPassword = (value) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    // set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // set body
    const body = JSON.stringify(value);

    try {
        // login user
        const res = await axios.post(`/api/talent/forgot-password`, body, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        return res.data.result;
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};
export const resetPassword = (value, token) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    // set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // set body
    const body = JSON.stringify(value);

    try {
        // login user
        const res = await axios.patch(`/api/talent/reset-password/${token}`, body, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        return res.data;

    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};
