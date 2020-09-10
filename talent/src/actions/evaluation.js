import { UPDATE_EVALUATION_FAILURE, UPDATE_EVALUATION_SUCCESS, AUTH_LOADING_TRUE } from './types'
import axios from 'axios';
import { loadUser } from './auth'
import { loadApi } from './common'

export const getTalentEvaluation = () => async dispatch => {
    dispatch(loadEvaluationApi(`/api/talent/evaluation`,'get'));
};

export const scheduleInterview = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/schedule-meeting`,'patch',values));
};


export const loadEvaluationApi = (url, method, values) => async dispatch => {
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
            type: UPDATE_EVALUATION_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (error) {
        dispatch({ type: UPDATE_EVALUATION_FAILURE, payload: error });
    }
};

