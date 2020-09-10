import axios from 'axios';
// types
import { 
    AUTH_LOADING_TRUE,
    UPDATE_FAILURE,
    UPDATE_SUCCESS,
} from './types';
import { loadUser } from './auth'


export const uploadResume = (data) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    try {
        const res = await axios.patch(`/api/talent/upload-cv`,data);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error });
    }
};



export const removeTalentResume = (values) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    const body = JSON.stringify(values);
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    };
    
  
    try {
        const res = await axios.delete(`/api/talent/remove-cv`,config);
        
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (error) {
        dispatch({ type: UPDATE_FAILURE, payload: error });
    }
};

