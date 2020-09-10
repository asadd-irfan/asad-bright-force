import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { loadApi } from './common';
import { getTalentsData, getAllTalentsCount, getTalentsCount } from './talent';
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
} from './types';
import { PAGE_LIMIT } from '../common/constants'
// load user
export const loadUser = () => async dispatch => {
    //set header
    if (localStorage.token) {
        setAuthToken(localStorage.token);

        try {
            //get talent user
            await axios.get('/api/admin/me').then(result => {
                if (result.data.role === 'admin') {
                    dispatch({
                        type: USER_LOADED,
                        payload: result.data
                    });
                    let params = `?page=1&limit=${PAGE_LIMIT}`
                    dispatch(getTalentsData(params));
                    dispatch(getAllTalentsCount());
                    dispatch(getTalentsCount());
                    dispatch(loadAppConfigs());
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

export const registerUser = ({ name, email, password }) => async dispatch => {
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
    const body = JSON.stringify({ name, email, password });
    try {
        //post user
        const res = await axios.post(`/api/admin/register`, body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        setTimeout(() => {
            dispatch({
                type: AUTH_LOADING_TRUE
            });
            dispatch(loadUser());
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
        const res = await axios.post(`/api/admin/login`, body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
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
    dispatch(loadApi(`/api/admin/updateMyPassword`, 'patch', values));
};

export const loadAppConfigs = () => async dispatch => {
    try {
        const res = await axios.get('/api/admin/app-configs');
        dispatch({
            type: APP_CONFIGS_LOADED,
            payload: res.data.result
        });
    } catch (error) {
        dispatch({ type: APP_CONFIGS_ERROR, payload: error.response.data });
    }
};
