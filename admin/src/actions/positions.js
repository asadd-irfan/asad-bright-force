import axios from 'axios';
// types
import {
  POSITIONS_API_ERROR,
  ALL_COMPANIES_POSITIONS_LOADED,
  POSITIONS_BTN_LOADING_TRUE,
  POSITIONS_DETAILS_LOADED,
  FILTERED_POSITION_TALENTS_LOADED,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  AUTH_LOADING_TRUE,
  RECRUITMENT_CANDIDATES_LIST_LOADED,
  UPDATE_POSITION_SUCCESS,
  UPDATE_POSITION_FAILURE,
  FILTERED_POSITION_TALENTS_NULL,
  NULL_ALL_POSITION_RESOURCES,
  CURRENT_GROUP_INDEX,
  POSITIONS_COUNT,
  SELECTED_TALENT_POSITIONS_LOADED,
  PROCESSED_POSITION_TALENTS_LOADED,
  PROCESSED_POSITION_TALENTS_REMOVE,


} from './types';


export const getAllCompaniesPositions = (params) => async dispatch => {
  console.log('params in reducer', params)
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get('/api/admin/positions' + params);
    dispatch({
      type: ALL_COMPANIES_POSITIONS_LOADED,
      payload: res.data
    });
  } catch (error) {
    dispatch({ type: POSITIONS_API_ERROR, payload: error.response.data });
  }
};
export const getPositionsCount = () => async dispatch => {

  try {
    const res = await axios.get('/api/admin/positions-count');
    dispatch({
      type: POSITIONS_COUNT,
      payload: res.data
    });
  } catch (error) {
    dispatch({ type: POSITIONS_API_ERROR, payload: error.response.data });
  }
};

export const getPositionDetailsById = (id) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get('/api/admin/company/position/' + id);
    dispatch({
      type: POSITIONS_DETAILS_LOADED,
      payload: res.data
    });
  } catch (error) {
    dispatch({ type: POSITIONS_API_ERROR, payload: error.response.data });
  }
};


export const getFilteredPositionTalents = (values, id) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.post('/api/admin/position/filter-talents/' + id, body, config);
    // console.log('res ====>', res)
    dispatch({
      type: FILTERED_POSITION_TALENTS_LOADED,
      payload: res.data
    });
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const getTalentPositions = (values) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.post('/api/admin/talent-positions', body, config);
    dispatch({
      type: SELECTED_TALENT_POSITIONS_LOADED,
      payload: res.data
    });
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
  } catch (error) {
    dispatch({ type: POSITIONS_API_ERROR, payload: error.response.data });
  }
};

export const dispatchTalentsList = (values, id) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.post('/api/admin/position/dispatch-talent-list/' + id, body, config);
    dispatch({
      type: UPDATE_POSITION_SUCCESS,
      payload: res
    });
    dispatch(getPositionDetailsById(id))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const closePosition = (values, id) => async dispatch => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.patch('/api/admin/close-position/' + id, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res
    });
    dispatch(getPositionDetailsById(id))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const getRecruitmentCandidatesList = (values, id, groupIndex) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.post('/api/admin/recruitment/' + id, body, config);
    dispatch({
      type: RECRUITMENT_CANDIDATES_LIST_LOADED,
      payload: res.data,
      key: "group" + groupIndex,
    });
    dispatch({
      type: CURRENT_GROUP_INDEX,
      payload: groupIndex
    });
    dispatch({
      type: FILTERED_POSITION_TALENTS_NULL
    });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const nullAllPositionRelatedResources = () => async dispatch => {
  dispatch({
    type: NULL_ALL_POSITION_RESOURCES,
  });
};

export const getProcessedPositionTalents = (id) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE,
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.get('/api/admin/recruitment/processed/' + id);
    dispatch({
      type: PROCESSED_POSITION_TALENTS_LOADED,
      payload: res.data
    });
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
  } catch (error) {
    dispatch({ type: POSITIONS_API_ERROR, payload: error.response.data });
  }
};

export const deleteProcessedTalents = (body, id) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE
  });
  //set header
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      candidates: body
    }
  };
  try {
    const res = await axios.delete('/api/admin/recruitment/remove-processed-candidates/' + id, config);
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
    dispatch(getPositionDetailsById(id))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const updateGroupConfigs = (values, id) => async dispatch => {
  dispatch({
    type: POSITIONS_BTN_LOADING_TRUE
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify(values);

  try {
    const res = await axios.patch('/api/admin/position/update-group-configs/' + id, body, config);
    if (res.data.message) {
      dispatch({
        type: UPDATE_SUCCESS,
        payload: res.data
      });
    }
    dispatch({
      type: UPDATE_POSITION_SUCCESS,
      payload: res
    });
    dispatch(getPositionDetailsById(id))

  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }

}

export const removeProcessedPositionTalents = () => async dispatch => {
  dispatch({
    type: PROCESSED_POSITION_TALENTS_REMOVE,
    payload: null
  });
};