import axios from 'axios';
// types
import {
  AUTH_LOADING_TRUE,
  UPDATE_FAILURE,
  UPDATE_SUCCESS,
  UPDATE_SIDEBAR_FAILURE,
} from './types';
import { loadUser } from './auth'
import { loadApi } from './common'

export const updateTalentProfile = (id, values) => async dispatch => {
  dispatch(loadApi(`/api/talent/profile/${id}`, 'patch', values));
};
export const updateAvailabilityStatus = (values) => async dispatch => {
  dispatch(loadApi(`/api/talent/availability-status`, 'patch', values));
};
export const updateUserLanguages = (values) => async dispatch => {
  dispatch(loadApi(`/api/talent/languages`, 'patch', values));
};
export const deleteCompanyFromBlockList = (id) => async dispatch => {
  dispatch(loadApi(`/api/talent/block-company/${id}`, 'delete'));
};

export const blockACompany = (values) => async dispatch => {
  dispatch(loadApi(`/api/talent/block-company`, 'post', values));
};


export const updateProfileImage = (id, data) => async dispatch => {
  dispatch({
    type: AUTH_LOADING_TRUE
  });
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    const res = await axios.patch(`/api/talent/upload-profileImage/${id}`, data, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const submitProfile = () => async dispatch => {
  dispatch({
    type: AUTH_LOADING_TRUE
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(`/api/talent/submit-profile`, config);
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: UPDATE_SIDEBAR_FAILURE, payload: error });
  }
};
export const talentProfileCompleted = () => async dispatch => {
  dispatch({
    type: AUTH_LOADING_TRUE
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(`/api/talent/profile-completed`, config);
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: UPDATE_SIDEBAR_FAILURE, payload: error });
  }
};

export const scheduleManagerMeeting = () => async dispatch => {
  dispatch({
    type: AUTH_LOADING_TRUE
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(`/api/talent/status-meeting-pending`, config);
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};


