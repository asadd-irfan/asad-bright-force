import axios from 'axios';
// types
import {
    BTN_LOADING_TRUE,
    TALENT_LOADED,
    SERVER_ERROR,
    AUTH_LOADING_TRUE,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    BTN_LOADING_FALSE,
    TALENT_CALENDAR_LOADED,
    TALENT_OFFERS_LOADED,


} from './types';
import { getPosCandidateById } from './positions'

export const getTalentOffers = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        let res = await axios.get('/api/company/talent-offers/' + id);
        dispatch({
            type: TALENT_OFFERS_LOADED,
            payload: res
        });
        dispatch({ type: BTN_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: BTN_LOADING_FALSE });
    }
};
export const getTalentById = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        let res = await axios.get('/api/company/talent/' + id);
        dispatch({
            type: TALENT_LOADED,
            payload: res
        });
        dispatch({ type: BTN_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: BTN_LOADING_FALSE });
    }
};
export const getTalentCalendarById = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        let res = await axios.get('/api/company/talent-calendar/' + id);
        dispatch({
            type: TALENT_CALENDAR_LOADED,
            payload: res
        });
        dispatch({ type: BTN_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: BTN_LOADING_FALSE });
    }
};
export const scheduleInterviewWithTalent = (values, id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE,
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.patch(`/api/company/position/schedule-interview/${id}`, values, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        dispatch(getPosCandidateById(id))
        dispatch({ type: BTN_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
        dispatch({ type: BTN_LOADING_FALSE });
    }
};
export const rescheduleInterviewWithTalent = (values, id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE,
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.patch(`/api/company/position/reschedule-interview/${id}`, values, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        dispatch(getPosCandidateById(id))
        dispatch({ type: BTN_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
        dispatch({ type: BTN_LOADING_FALSE });
    }
};