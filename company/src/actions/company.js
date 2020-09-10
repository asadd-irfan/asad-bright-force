import axios from "axios";
// types
import {
  COMPANY_REQUEST_LOADED,
  SERVER_ERROR,
  BTN_LOADING_TRUE,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  COMPANY_USERS_LOADED,
  AUTH_LOADING_TRUE,
  COMPANY_LOADED,
  UPDATE_MAIL_TOKEN,
  COMPANY_CALENDAR_LOADED,
  BTN_LOADING_FALSE,
  COMPANY_TIMEZONE,
} from "./types";
import { loadUser } from "./auth";

export const getCompanyDetails = () => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get("/api/company/details");
    dispatch({
      type: COMPANY_LOADED,
      payload: res,
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getCompanyRequestById = (id) => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    const res = await axios.get("/api/company/request/" + id);
    dispatch({
      type: COMPANY_REQUEST_LOADED,
      payload: res,
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const updateUserProfileImage = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.patch(
      `/api/company/user/upload-profileImage`,
      data,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch({ type: BTN_LOADING_FALSE });
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const updateCompanyLogo = (data, id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.patch(
      `/api/company/upload-logo/${id}`,
      data,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(getCompanyDetails());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
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
      `/api/company/upload-bannerImage/${id}`,
      data,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(getCompanyDetails());
    dispatch(loadUser());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getAllUsersOfCompany = () => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get("/api/company/users");
    dispatch({
      type: COMPANY_USERS_LOADED,
      payload: res,
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getCalendarOfCompany = () => async (dispatch) => {
  dispatch({
    type: BTN_LOADING_TRUE,
  });
  try {
    let res = await axios.get("/api/company/calendar");
    dispatch({
      type: COMPANY_CALENDAR_LOADED,
      payload: res,
    });
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: SERVER_ERROR, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const deleteCompanyUser = (id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  try {
    let res = await axios.delete("/api/company/remove-user/" + id);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(getAllUsersOfCompany());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const editAuthorizations = (data, id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  try {
    let res = await axios.patch(
      `/api/company/edit-authorizations/${id}`,
      data,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(getAllUsersOfCompany());
    dispatch(loadUser());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const appointAsAdmin = (id) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING_TRUE,
  });
  try {
    let res = await axios.patch("/api/company/appoint-admin/" + id);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(getAllUsersOfCompany());
    dispatch(loadUser());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
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
    const res = await axios.patch(`/api/company/details/${id}`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(getCompanyDetails());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const changeBillingData = (values) => async (dispatch) => {
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
    const res = await axios.patch(`/api/company/billing-details`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(getCompanyDetails());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const changeBillingUser = (id) => async (dispatch) => {
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
      `/api/company/change-billing-user/${id}`,
      body,
      config
    );
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(getCompanyDetails());
    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const inviteNewUserToCompany = (values) => async (dispatch) => {
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
    const res = await axios.post(`/api/company/invite-user`, body, config);
    dispatch({
      type: UPDATE_SUCCESS,
      payload: res.data,
    });
    dispatch({
      type: UPDATE_MAIL_TOKEN,
      payload: res,
    });

    dispatch({ type: BTN_LOADING_FALSE });
  } catch (error) {
    dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
    dispatch({ type: BTN_LOADING_FALSE });
  }
};

export const getTimeZoneName = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/company/timezone-name/${id}`);
    dispatch({
      type: COMPANY_TIMEZONE,
      payload: res.data?.result?.name,
    });
  } catch (error) {
    // dispatch({ type: TM_ERROR, payload: error.response.data });
  }
};
