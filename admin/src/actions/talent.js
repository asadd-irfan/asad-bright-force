import axios from 'axios';
// types
import {
    TALENTS_LOADED_ERROR,
    TALENTS_LOADED,
    BTN_LOADING_TRUE,
    ALL_TALENTS_LOADED_COUNT,
    TALENT_LOADED,
    TALENT_EVALUATION_LOADED,
    TALENT_EVALUATION_LOADED_ERROR,
    UPDATE_SUCCESS,
    UPDATE_FAILURE,
    TALENT_MANAGER_MEETING_LOADED,
    TALENTS_MANAGER_MEETING_LOADED_ERROR,
    TALENT_PROF_INTERVIEW_LOADED,
    TALENT_PROF_INTERVIEW_LOADED_ERROR,
    ALL_TALENTS_COUNT_LOADED,
    ALL_TALENTS_COUNT_LOADED_ERROR
} from './types';
import { loadTalentApi } from './common'


export const getTalentsData = (params) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent' + params);
        dispatch({
            type: TALENTS_LOADED,
            payload: res.data
        });
        // dispatch({
        //     type: ALL_TALENTS_LOADED_COUNT,
        //     payload: res.data.length
        // });
    } catch (error) {
        dispatch({ type: TALENTS_LOADED_ERROR, payload: error });
    }
};

export const getTalents = (values) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    //set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify(values);
    try {
        const res = await axios.post('/api/admin/talents', body, config);
        dispatch({
            type: TALENTS_LOADED,
            payload: res.data
        });
        dispatch({
            type: ALL_TALENTS_LOADED_COUNT,
            payload: res.data.length
        });
    } catch (error) {
        dispatch({ type: TALENTS_LOADED_ERROR, payload: error });
    }
};

export const getTalentById = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent/' + id);
        dispatch({
            type: TALENT_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TALENTS_LOADED_ERROR, payload: error.response });
    }
};
export const getTalentEvaluation = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent-evaluation/' + id);
        dispatch({
            type: TALENT_EVALUATION_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TALENT_EVALUATION_LOADED_ERROR, payload: error.response });
    }
};

export const getAllTalentsCount = () => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent');
        dispatch({
            type: ALL_TALENTS_LOADED_COUNT,
            payload: res.data.length
        });
    } catch (error) {
        dispatch({ type: TALENTS_LOADED_ERROR, payload: error });
    }
};

export const getTalentsCount = () => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent-count');
        dispatch({
            type: ALL_TALENTS_COUNT_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: ALL_TALENTS_COUNT_LOADED_ERROR, payload: error });
    }
};


export const getProfileSubmitTalentsData = () => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/submitted-talent-profiles');
        dispatch({
            type: TALENTS_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TALENTS_LOADED_ERROR, payload: error });
    }
};

export const getTalentManagerMeeting = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent/manager-meeting/' + id);
        dispatch({
            type: TALENT_MANAGER_MEETING_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TALENTS_MANAGER_MEETING_LOADED_ERROR, payload: error });
    }
};
export const getProfInterviewerMeeting = (id) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE,
    });
    try {
        const res = await axios.get('/api/admin/talent/professional-interview/' + id);
        dispatch({
            type: TALENT_PROF_INTERVIEW_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: TALENT_PROF_INTERVIEW_LOADED_ERROR, payload: error });
    }
};

export const saveTalentContact = (values, id) => async dispatch => {
    dispatch(loadTalentApi(`/api/admin/talent/contact/${id}`, 'post', values, id));
};

export const deleteTalentContact = (id, talentId) => async dispatch => {
    dispatch({
        type: BTN_LOADING_TRUE
    });
    //set header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            talentId: talentId
        }
    };
    try {
        const res = await axios.delete(`/api/admin/talent/contact/${id}`, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data.message
        });
        dispatch(getTalentById(talentId))
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    }
};


export const changeTalentProfileStatus = (values, id) => async dispatch => {
    dispatch(loadTalentApi(`/api/admin/talent/profile-status/${id}`, 'patch', values, id));
};
export const ApproveTalentProfile = (id) => async dispatch => {
    let values = {};
    dispatch(loadTalentApi(`/api/admin/approve-talent-profile/${id}`, 'patch', values, id));
};
