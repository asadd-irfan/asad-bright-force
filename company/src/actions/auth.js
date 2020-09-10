import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// types
import {
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT_USER,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    USER_LOADED,
    AUTH_LOADING_TRUE,
    CLEAR_SERVER_ERRORS,
    AUTH_ERROR,
    CLEAR_USER_ERRORS,
    APP_CONFIGS_LOADED,
    APP_CONFIGS_ERROR,
    UPDATE_FAILURE,
    UPDATE_SUCCESS,

} from './types';
import { loadApi } from './common'
// load user
export const loadUser = () => async dispatch => {
    //set header
    if (localStorage.token) {
        setAuthToken(localStorage.token);
        try {
            await axios.get('/api/company/user/me').then(result => {
                if (result.data.role === 'admin' || result.data.role === 'moderator') {
                    dispatch({
                        type: USER_LOADED,
                        payload: result.data
                    });
                } else throw new Error('Unauthorized role');
            });
        } catch (error) {
            dispatch({ type: AUTH_ERROR, payload: error });
        }
    }

};
// clear user errors	
export const clearUserErrors = () => async dispatch => {
    dispatch({
        type: CLEAR_USER_ERRORS,
    });
};

// register user
export const registerUser = ({ name, email, phone, title, companyName, website, password, employees, agreementCheckBox, communicationsCheckBox }) => async dispatch => {
    // loading true
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    //set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // set body
    const body = JSON.stringify({ name, email, phone, title, companyName, website, password, employees, agreementCheckBox, communicationsCheckBox });
    try {
        // post user
        const res = await axios.post('/api/company/register', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        //@TODO: consider server side error handling
        dispatch({ type: REGISTER_FAILURE, payload: error.response.data });
    }
};

// login user
export const loginUser = ({ email, password }) => async dispatch => {
    // loading true
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
        const res = await axios.post('/api/company/login', body, config);
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


// clear user errors
export const clearServerErrors = () => async dispatch => {
    dispatch({
        type: CLEAR_SERVER_ERRORS,
    });
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


export const registerCompanyRequest = (values) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify(values);
    try {
        const res = await axios.post('/api/company/request', body, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};

// register user
export const registerFirstUser = (values, id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify(values);
    try {
        const res = await axios.post(`/api/company/signup-first-user/${id}`, body, config);
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

// register user
export const registerOtherUser = (values) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    //set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // set body
    const body = JSON.stringify(values);
    try {
        // post user
        const res = await axios.post(`/api/company/signup-other-user`, body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        dispatch({ type: REGISTER_FAILURE, payload: error.response.data });
    }
};

export const changePassword = (values) => async dispatch => {
    dispatch(loadApi(`/api/company/change-user-password`, 'patch', values));
};
export const changeUserInfo = (values) => async dispatch => {
    dispatch(loadApi(`/api/company/update-user`, 'patch', values));
};
