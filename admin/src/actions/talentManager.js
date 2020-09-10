import axios from 'axios';
// types
import {
  UPDATE_FAILURE,
  BTN_LOADING_TRUE,
  TALENT_MANAGERS_LOADED,
  ACCOUNT_MANAGERS_LOADED,
  ALL_ACCOUNT_MANAGERS,
  ACCOUNT_MANAGER,
  UPDATE_SUCCESS,

} from './types';
import { loadTalentManagerApi } from './common'

export const getAllTalentManagers = (params) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get('/api/admin/talent-manager/' + params);
    dispatch({
      type: TALENT_MANAGERS_LOADED,
      payload: res
    });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const getAllAdmins = () => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get('/api/admin');
    dispatch({
      type: ACCOUNT_MANAGERS_LOADED,
      payload: res
    });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const getAllAccountsManager = (params) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get('/api/admin/staff' + params);
    dispatch({
      type: ALL_ACCOUNT_MANAGERS,
      payload: res
    });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const assignManagerToRequest = (values, id) => async dispatch => {
  dispatch(loadTalentManagerApi(`/api/admin/assign-account-manager/${id}`, 'patch', values, id));
};

export const assignManagerToCompany = (values, id) => async dispatch => {
  dispatch(loadTalentManagerApi(`/api/admin/company/assign-account-manager/${id}`, 'patch', values, id));
};

export const setAccountManager = (value) => async dispatch => {
  // console.log('payload', value)

  dispatch({
    type: ACCOUNT_MANAGER,
    payload: value
  });
};

export const updateStaffProfile = (id,values)  => async dispatch => {
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
    const res = await axios.patch(`/api/admin/staff/${id}`, body, config);
    dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
    });
    dispatch(setAccountManager(res?.data?.data))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};
export const updateProfileImage = (id, data) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE
  });
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    const res = await axios.patch(`/api/admin/profile-image/${id}`, data, config);

    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(setAccountManager(res?.data?.data))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const addStaffProfile = (values) => async dispatch => {
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
      const res = await axios.post('/api/admin/staff', body, config);
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res
    });
     
  } catch (error) {
      dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};