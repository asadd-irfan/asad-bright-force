import axios from 'axios';
// types
import {
    SERVER_ERROR,
    AUTH_LOADING_TRUE,
    AUTH_LOADING_FALSE,
    ALL_INVITES_LOADED,
    INVITE_POSITION_DETAILS_LOADED,
    INVITE_OFFER_DETAILS_LOADED,
    ALL_INVITES_POSITION_DETAILS_LOADED,
    UPDATE_SUCCESS,
    RECRUITMENT_DETAILS_LOADED,
    INTERVIEW_DETAILS_LOADED,
    
} from './types';

export const getAllInvites = () => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    try {
        let res = await axios.get('/api/talent/company-offers');
        dispatch({
            type: ALL_INVITES_LOADED,
            payload: res
        });
        dispatch({ type: AUTH_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: AUTH_LOADING_FALSE });
    }
};

export const getPositionDetailOfInvite = (id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    try {
        let res = await axios.get('/api/talent/position/' + id);
        dispatch({
            type: INVITE_POSITION_DETAILS_LOADED,
            payload: res
        });
        dispatch({ type: AUTH_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: AUTH_LOADING_FALSE });
    }
};
export const getPositionDetailOfAllInvites = (id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    try {
        let res = await axios.get('/api/talent/position/' + id);
        dispatch({
            type: ALL_INVITES_POSITION_DETAILS_LOADED,
            payload: res
        });
        dispatch({ type: AUTH_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: AUTH_LOADING_FALSE });
    }
};

export const getOfferDetailOfInvite = (id) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    try {
        let res = await axios.get('/api/talent/offer/' + id);
        dispatch({
            type: INVITE_OFFER_DETAILS_LOADED,
            payload: res
        });
        dispatch({ type: AUTH_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: AUTH_LOADING_FALSE });
    }
};

export const getRecruitmentDetailsById = (id) => async dispatch => {
  dispatch({
      type: AUTH_LOADING_TRUE
  });
  try {
      let res = await axios.get('/api/talent/recruitment/' + id);
      dispatch({
          type: RECRUITMENT_DETAILS_LOADED,
          payload: res
      });
      dispatch({ type: AUTH_LOADING_FALSE });
  } catch (error) {
      dispatch({ type: SERVER_ERROR, payload: error });
      dispatch({ type: AUTH_LOADING_FALSE });
  }
};
export const getInterviewDetailsById = (id) => async dispatch => {
  dispatch({
      type: AUTH_LOADING_TRUE
  });
  try {
      let res = await axios.get('/api/talent/interview/' + id);
      dispatch({
          type: INTERVIEW_DETAILS_LOADED,
          payload: res
      });
      dispatch({ type: AUTH_LOADING_FALSE });
  } catch (error) {
      dispatch({ type: SERVER_ERROR, payload: error });
      dispatch({ type: AUTH_LOADING_FALSE });
  }
};

export const acceptRejectJobOffer = (values, offerDetail) => async dispatch => {
    dispatch({
        type: AUTH_LOADING_TRUE
    });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // set body
    const body = JSON.stringify(values);

    try {
        const res = await axios.post(`/api/talent/job-offer/` + offerDetail?._id, body, config);
        dispatch({
            type: UPDATE_SUCCESS,
            payload: res.data
        });
        dispatch(getOfferDetailOfInvite(offerDetail?._id))
        dispatch({ type: AUTH_LOADING_FALSE });
    } catch (error) {
        dispatch({ type: SERVER_ERROR, payload: error });
        dispatch({ type: AUTH_LOADING_FALSE });
    }
};


