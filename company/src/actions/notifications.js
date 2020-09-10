import axios from 'axios';
// types
import {
  COMPANY_NOTIFICATIONS_LOADED,
  BTN_LOADING_TRUE,
  SERVER_ERROR,
  BTN_LOADING_FALSE,
  UPDATE_SUCCESS,
  POSITION_NOTIFICATIONS_LOADED
} from './types';

export const getAllCompanyNotifications = () => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/notifications');
    if (res.data.message){
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
    else {
      dispatch({
        type: COMPANY_NOTIFICATIONS_LOADED,
        payload: res
      });
    }
    
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};
export const getPositionNotifications = (id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/position-notifications/' + id);
    dispatch({
      type: POSITION_NOTIFICATIONS_LOADED,
      payload: res
    });
    
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};