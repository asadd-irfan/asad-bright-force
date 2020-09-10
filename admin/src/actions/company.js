import axios from "axios";
// types
import {
  COMPANY_REQUESTS_LOADED,
  COMPANY_REQUEST_LOADED,
  SERVER_ERROR,
  BTN_LOADING_TRUE,
  SET_COMPANY_NAV_ITEM,
  COMPANIES_LOADED,
  COMPANY_FOR_ASSIGN,
  UPDATE_MAIL_TOKEN,
  UPDATE_FAILURE,
  UPDATE_SUCCESS,
  COMPANY_LOADED,
  COMPANY_USERS_LOADED,
  COMPANY_POSITIONS_LOADED,
  INVITE_USER_SUCCESS,
  AUTH_LOADING_TRUE,
  COMPANY_AND_REQUESTS_COUNT_LOADED,
  SET_COMPANY_TAB_PANEL_KEY,
  COMPANY_SUGGESTIONS,
} from "./types";

import { loadCompanyApi } from "./common";

export const deleteCompanyUser = (id) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.delete("/api/admin/company/remove-users/" + id);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const editAuthorizations = (data, id) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  try {
    let res = await axios.patch(`/api/admin/company/edit-authorizations/${id}`, data, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const appointAsAdmin = (id, values) => async dispatch => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.patch(`/api/admin/company/appoint-admin/${id}`, body, config);

    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data
    });

  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const updateCompanyBillingDetails = (values, id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.patch(`/api/admin/company/billing/${id}`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
    dispatch(getCompanyById(id));
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};


export const getAllCompanies = (params) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get("/api/admin/companies" + params);
    dispatch({
      type: COMPANIES_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const getCompanyAllPositions = (id) => async (dispatch) => {

  try {
    let res = await axios.get("/api/admin/company-positions/" + id);
    dispatch({
      type: COMPANY_POSITIONS_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const getAllUsersOfCompany = (id) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get("/api/admin/company-users/" + id);
    dispatch({
      type: COMPANY_USERS_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};
export const getAllCompanyRequests = (params) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get("/api/admin/company-requests" + params);
    dispatch({
      type: COMPANY_REQUESTS_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const getCompanyRequestById = (id) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get("/api/admin/company-request/" + id);
    dispatch({
      type: COMPANY_REQUEST_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const getCompanyById = (id) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get("/api/admin/company/" + id);
    dispatch({
      type: COMPANY_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const getCompanyAndRequestsCount = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/admin/company-count");
    dispatch({
      type: COMPANY_AND_REQUESTS_COUNT_LOADED,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};

export const setSelectedCompanyNavItem = (navItem) => async (dispatch) => {
  dispatch({
    type: SET_COMPANY_NAV_ITEM,
    payload: navItem,
  });
};

export const selectCompanyForAssign = (company) => async (dispatch) => {
  dispatch({
    type: COMPANY_FOR_ASSIGN,
    payload: company,
  });
};

export const addCompany = (values) => async (dispatch) => {
  dispatch(loadCompanyApi(`/api/admin/new-company`, "post", values));
};
export const addNewCompany = (values) => async (dispatch) => {
  dispatch(loadCompanyApi(`/api/admin/company`, "post", values));
};

export const assignCompanyToUser = (values, id) => async (dispatch) => {
  dispatch(
    loadCompanyApi(`/api/admin/assign-company/${id}`, "post", values, id)
  );
};

export const denyCompanyRequest = (values, id) => async (dispatch) => {
  dispatch(
    loadCompanyApi(`/api/admin/deny-request/${id}`, "patch", values, id)
  );
};

export const inviteNewUserToCompany = (values, id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  //set body
  const body = JSON.stringify(values);
  try {
    //post user
    const res = await axios.post(
      `/api/admin/company/invite-user/${id}`,
      body,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
    dispatch({
      type: INVITE_USER_SUCCESS,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const sendMailToUser = (id) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  const body = {};
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    let res = await axios.post(`/api/admin/send-email/${id}`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });

    dispatch({
      type: UPDATE_MAIL_TOKEN,
      payload: res,
    });
    dispatch(getAllCompanies(""));
    dispatch(getCompanyRequestById(id));
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
  }
};

export const updateCompanyDetails = (values, id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.patch(`/api/admin/company/${id}`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
    dispatch(getCompanyById(id));
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const restartRequest = (id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = {};
  try {
    const res = await axios.patch(
      `/api/admin/restart-request/${id}`,
      body,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
    dispatch(getCompanyRequestById(id));
    dispatch(getCompanyAndRequestsCount());
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const changeRequesterEmail = (values, id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(values);
  try {
    const res = await axios.patch(
      `/api/admin/change-request-email/${id}`,
      body,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res,
    });
    dispatch(getCompanyRequestById(id));
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const changeCompanyTabPanelKey = (key) => async (dispatch) => {
  dispatch({
    type: SET_COMPANY_TAB_PANEL_KEY,
    payload: key,
  });
};

export const updateCompanyLogo = (data, id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.patch(
      `/api/admin/company-logo/${id}`,
      data,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(getCompanyById(id));
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const updateBannerImage = (data, id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.patch(
      `/api/admin/company-banner/${id}`,
      data,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(getCompanyById(id));
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
  }
};

export const getAllCompaniesSuggestions = (params) => async (dispatch) => {
  try {
    let res = await axios.get("/api/admin/suggested-companies" + params);
    dispatch({
      type: COMPANY_SUGGESTIONS,
      payload: res,
    });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};


export const getTalentCompaniesSuggestions = (id) => async (dispatch) => {
  try {
    let res = await axios.get("/api/admin/talent-suggested-companies/" + id);
    return res.data;
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
  }
};