import axios from 'axios';
// types
import { 
    AUTH_LOADING_TRUE,
    UPDATE_FAILURE,
    UPDATE_SUCCESS,
    RESET_NOTIFICATION_SETTING,
    BTN_LOADING_TRUE,
    BTN_LOADING_FALSE,
    CURRENT_SETTINGS_NAVBAR_BUTTON,
    CURRENT_HIRE_NAVBAR_BUTTON,
    
} from './types';
import { loadUser } from './auth'


export const resetNotificationSetting = () => async dispatch => {
    dispatch({ type: RESET_NOTIFICATION_SETTING });    
};

export const setCurrentSettingSNavbarButton = (value) => async dispatch => {
    dispatch({ type: CURRENT_SETTINGS_NAVBAR_BUTTON, payload: value });  
};

export const setCurrentHireSNavbarButton = (value) => async dispatch => {
    dispatch({ type: CURRENT_HIRE_NAVBAR_BUTTON, payload: value });  
};

export const loadApi = (url, method, values) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    dispatch({
        type: BTN_LOADING_TRUE
    });
    const body = JSON.stringify(values);
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        let res = null;
        if (method === 'post') {
            res = await axios.post(url, body, config);
        }
        if (method === 'patch') {
            res = await axios.patch(url, body, config);
        }
        if (method === 'delete') {
            res = await axios.delete(url, config);
        }
        if (method === 'get') {
            res = await axios.get(url, config);
        }
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        
        dispatch({ type: BTN_LOADING_FALSE });
        dispatch(loadUser());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
        dispatch({ type: BTN_LOADING_FALSE });
    }
};

