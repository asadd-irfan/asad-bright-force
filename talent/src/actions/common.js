import axios from 'axios';
// types
import { 
    AUTH_LOADING_TRUE,
    UPDATE_FAILURE,
    UPDATE_SUCCESS,
    RESET_NOTIFICATION_SETTING,
    UPDATE_CALENDER_TYPE,
    CURRENT_NAVBAR_BUTTON,
    
} from './types';
import { loadUser } from './auth'


export const resetNotificationSetting = () => async dispatch => {
    dispatch({ type: RESET_NOTIFICATION_SETTING });    
};
export const setCurrentNavbarButton = (value) => async dispatch => {
    dispatch({ type: CURRENT_NAVBAR_BUTTON, payload: value });    
};

export const loadApi = (url, method, values) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
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
        
        dispatch(loadUser());
        if (url === '/api/talent/schedule-TM-meeting') {
            dispatch({
                type: UPDATE_CALENDER_TYPE,
                payload: null,
            });
        }
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};


