import axios from 'axios';
// types
import {

  FILTER_APP_CONFIGS,
  APP_CONFIGS_ERROR,
  UPDATE_SUCCESS,
  COEFFICIENT_CONFIGS,
  UPDATE_FAILURE,

} from './types';
import {  loadAppConfigs } from './auth';



export const filterAppConfigs = (params) => async dispatch => {
  try {
      const res = await axios.get('/api/admin/configs' + params);
      dispatch({
          type: FILTER_APP_CONFIGS,
          payload: res.data.result
      });

    } catch (error) {
      dispatch({ type: APP_CONFIGS_ERROR, payload: error.response.data });
  }
};
export const addAppConfigs = (values, type) => async dispatch => {
  const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

//set body
const body = JSON.stringify(values);
  try {
      const res = await axios.post('/api/admin/app-configs', body, config);
      // console.log()
      if (res.data.message) {
        dispatch({
          type: UPDATE_SUCCESS,
          payload: res.data
        });
      }
      dispatch(
        filterAppConfigs(`?type=${type}`)
      );
      dispatch(loadAppConfigs())
  } catch (error) {
      dispatch({ type: APP_CONFIGS_ERROR, payload: error.response.data });
  }
};

export const deleteAppConfig = (id, type) => async dispatch => {

  try {
    let res = await axios.delete('/api/admin/app-configs/' + id);
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
    dispatch(
      filterAppConfigs(`?type=${type}`)
    );
    dispatch(loadAppConfigs())

  } catch (error) {
    dispatch({ type: APP_CONFIGS_ERROR, payload: error.response.data });
  }
};


export const editAppConfig = (data, id, configType) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  
  try {
    let res = await axios.patch('/api/admin/app-configs/' + id, data, config);
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
    dispatch(
      filterAppConfigs(`?type=${configType}`)
    );
    dispatch(loadAppConfigs())
  } catch (error) {
    dispatch({ type: APP_CONFIGS_ERROR, payload: error.response.data });
  }
};

export const getCoefficientConfigs = () => async dispatch => {
  try {
      const res = await axios.get('/api/admin/configs?type=coefficient' );
      dispatch({
          type: COEFFICIENT_CONFIGS,
          payload: res.data.result
      });
  } catch (error) {
      dispatch({ type: APP_CONFIGS_ERROR, payload: error.response.data });
  }
};

export const updateCoefficientWeight = (data) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    let res = await axios.patch('/api/admin/coefficient-weight', data, config);
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
    dispatch(getCoefficientConfigs());
    dispatch(loadAppConfigs())
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};