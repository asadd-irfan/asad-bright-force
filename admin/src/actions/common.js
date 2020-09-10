import axios from 'axios';
// types
import { 
    AUTH_LOADING_TRUE,
    UPDATE_FAILURE,
    UPDATE_SUCCESS,
    RESET_NOTIFICATION_SETTING,
    UPDATE_CALENDER_TYPE,
    BTN_LOADING_TRUE,
    REMOVE_MAIL_TOKEN,
    SET_SIDEBAR_KEY,
    CURRENT_STAFF_NAVBAR_BUTTON,

    
} from './types';
import { loadUser } from './auth'
import { getTalentById, getTalentEvaluation, getTalentsCount } from './talent'
import { getAllCompanies, getCompanyRequestById, getCompanyAndRequestsCount } from './company'
import { getAllAdmins } from './talentManager';


export const resetNotificationSetting = () => async dispatch => {
    dispatch({ type: RESET_NOTIFICATION_SETTING });    
};

export const setSidebarKey = (key) => async dispatch => {
    dispatch({ 
        type: SET_SIDEBAR_KEY,
        payload: key
    });    
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

export const loadTalentApi = (url, method, values, id) => async dispatch => {
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
        
        dispatch(getTalentById(id))
        dispatch(getTalentEvaluation(id));
        dispatch(getTalentsCount());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};

export const loadCompanyApi = (url, method, values, id) => async dispatch => {
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
            payload: res,
        });
        dispatch({
            type: REMOVE_MAIL_TOKEN,
        });
        
        dispatch(getAllCompanies(''))
        dispatch(getCompanyRequestById(id))
        dispatch(getCompanyAndRequestsCount())
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};

export const loadTalentManagerApi = (url, method, values, id) => async dispatch => {
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
            payload: res,
        });
        dispatch(getAllCompanies(''))
        dispatch(getCompanyRequestById(id))
        dispatch(getAllAdmins())
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};

export const setCurrentStaffNavbarButton = (value) => async dispatch => {
    dispatch({
        type: CURRENT_STAFF_NAVBAR_BUTTON,
        payload: value
    });
};
