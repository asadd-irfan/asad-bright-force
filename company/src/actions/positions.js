import axios from 'axios';
// types
import {
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  AUTH_LOADING_TRUE,
  BTN_LOADING_TRUE,
  COMPANY_POSITIONS_LOADED,
  COMPANY_POSITION_DETAILS_LOADED,
  SERVER_ERROR,
  LATEST_COMPANY_POSITION_CREATED,
  LATEST_COMPANY_POSITION_NULL,
  RECRUITMENT_CANDIDATES_LIST_LOADED,
  SET_SELECTED_POSITION_ID,
  SET_SELECTED_POSITION_RECRUITMENT,
  COMPANY_OFFER_LOADED,
  CLEAR_SERVER_ERRORS_POSITION,
  COMPANY_INTERVIEW_LOADED,
  BTN_LOADING_FALSE,
  COMPANY_POSITION_DETAILS_NULL,
  COMPANY_ACTIVE_POSITIONS_LOADED,
  COMPANY_ALL_POSITIONS_TYPE,

} from './types';

export const createPosition = (values) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify(values);
  try {
    const res = await axios.post(`/api/company/position`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data
    });
    dispatch({
      type: LATEST_COMPANY_POSITION_CREATED,
      payload: res.data
    });
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });

  }

};
export const editCompanyPosition = (data, id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.patch(`/api/company/position/${id}`, data, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};
export const restoreCompanyPosition = (id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });

  try {
    const res = await axios.patch(`/api/company/restore-position/${id}`);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};


export const getAllCompanyPositions = () => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/position');
    dispatch({
      type: COMPANY_POSITIONS_LOADED,
      payload: res
    });
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getActivePositions = () => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/active-positions');
    dispatch({
      type: COMPANY_ACTIVE_POSITIONS_LOADED,
      payload: res
    });
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getAllPositionsByType = () => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/all-positions');
    dispatch({
      type: COMPANY_ALL_POSITIONS_TYPE,
      payload: res
    });
    dispatch({ type: BTN_LOADING_FALSE });

  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const removeShortListCandidate = (id, values, positionId) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.delete(`/api/company/position/remove-shortlist/${id}`);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data
    });
    dispatch({ type: BTN_LOADING_FALSE });
    dispatch(getRecruitmentCandidatesList(values, positionId))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });

  }
};

export const getCompanyPositionDetails = (id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  dispatch({
    type: COMPANY_POSITION_DETAILS_NULL,
  });
  try {
    let res = await axios.get(`/api/company/position/${id}`);
    dispatch({
      type: COMPANY_POSITION_DETAILS_LOADED,
      payload: res
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};
export const latestCompanyPositionCreatedNull = () => async dispatch => {
  dispatch({
    type: LATEST_COMPANY_POSITION_NULL,
  });

};

export const getRecruitmentCandidatesList = (values, id) => async dispatch => {
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
    const res = await axios.post('/api/company/position-recruitment/' + id, body, config);
    dispatch({
      type: RECRUITMENT_CANDIDATES_LIST_LOADED,
      payload: res.data
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const sendOfferToTalent = (values, posRecId) => async dispatch => {
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
    const res = await axios.post('/api/company/position/offer/' + posRecId, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};
export const reSendOfferToTalent = (values, posRecId) => async dispatch => {
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
    const res = await axios.post('/api/company/position/resend-offer/' + posRecId, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};


export const setSelectedPositionId = (positionId) => async dispatch => {
  dispatch({
    type: SET_SELECTED_POSITION_ID,
    payload: positionId
  });
};
export const setSelectedPositionRecruitment = (positionRec) => async dispatch => {
  dispatch({
    type: SET_SELECTED_POSITION_RECRUITMENT,
    payload: positionRec
  });
};

// clear user errors
export const clearServerErrorsPosition = () => async dispatch => {
  dispatch({
    type: CLEAR_SERVER_ERRORS_POSITION,
  });
};



export const getPosCandidateById = (id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/position-candidate/' + id);
    dispatch(setSelectedPositionRecruitment(res.data.result))
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getPosInterviewById = (id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/position-interview/' + id);
    dispatch({
      type: COMPANY_INTERVIEW_LOADED,
      payload: res
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getPosOfferById = (id) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get('/api/company/offer/' + id);
    dispatch({
      type: COMPANY_OFFER_LOADED,
      payload: res
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};


export const changeInterviewResult = (data, positionRec) => async dispatch => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.patch(`/api/company/position/interview-result/${positionRec?._id}`, data, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch({ type: BTN_LOADING_FALSE });
    let obj = {
      "groupId": positionRec?.groupId
    }
    dispatch(getRecruitmentCandidatesList(obj, positionRec?.position))
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

