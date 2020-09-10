import axios from 'axios';

// types
import { 
    TALENT_CALENDAR_LOADED,
    UPDATE_FAILURE,
    AUTH_LOADING_TRUE,
    TALENT_CALENDAR_API_RESPONSE,
    UPDATE_CALENDER_TYPE
} from './types';

export const getTalentScheduleEvents = () => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        let res = await axios.get('/api/talent/schedule-calender', config);
        dispatch({
            type: TALENT_CALENDAR_LOADED,
            payload: res.data.result,
        });
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};


export const deleteTalentScheduledEvent = (id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        let res = await axios.delete(`/api/talent/schedule-calender/${id}`, config);
        dispatch({
            type: TALENT_CALENDAR_API_RESPONSE,
            payload: res.data,
        });
        dispatch(getTalentScheduleEvents());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};

export const editTalentScheduledEvent = (id, values) => async dispatch => {
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
        let res = await axios.patch(`/api/talent/schedule-calender/${id}`, body, config);
        dispatch({
            type: TALENT_CALENDAR_API_RESPONSE,
            payload: res.data,
        });
        dispatch(getTalentScheduleEvents());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};
export const addTalentScheduledEvent = (values) => async dispatch => {
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
        let res = await axios.post(`/api/talent/schedule-calender`, body, config);
        dispatch({
            type: TALENT_CALENDAR_API_RESPONSE,
            payload: res.data,
        });
        dispatch(getTalentScheduleEvents());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};
export const updateCalenderType = (value) => async dispatch => {
    dispatch({
        type: UPDATE_CALENDER_TYPE,
        payload: value
    });
};



