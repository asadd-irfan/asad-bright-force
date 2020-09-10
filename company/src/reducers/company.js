// types
import {
  COMPANY_REQUEST_LOADED,
  SERVER_ERROR,
  BTN_LOADING_TRUE,
  BTN_LOADING_FALSE,
  COMPANY_USERS_LOADED,
  UPDATE_MAIL_TOKEN,
  COMPANY_LOADED,
  COMPANY_CALENDAR_LOADED,
  LOGOUT_USER,
  COMPANY_TIMEZONE,
} from "../actions/types";

// initial state
const initialState = {
  companyRequests: null,
  selectedCompanyRequest: null,
  btnLoading: false,
  serverErrors: null,
  mailToken: null,
  companyUsers: null,
  companyDetails: null,
  companyCalendar: [],
  timezoneName: null,
};

// handle actions
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_REQUEST_LOADED:
      return {
        ...state,
        btnLoading: false,
        selectedCompanyRequest: payload.data.result,
      };
    case BTN_LOADING_TRUE:
      return {
        ...state,
        btnLoading: true,
      };
    case BTN_LOADING_FALSE:
      return {
        ...state,
        btnLoading: false,
      };

    case SERVER_ERROR:
      return {
        ...state,
        btnLoading: false,
        serverErrors: payload,
      };
    case COMPANY_USERS_LOADED:
      return {
        ...state,
        btnLoading: false,
        companyUsers: payload.data.result,
      };
    case UPDATE_MAIL_TOKEN:
      return {
        ...state,
        btnLoading: false,
        mailToken: payload.data.URL,
      };

    case COMPANY_LOADED:
      return {
        ...state,
        btnLoading: false,
        companyDetails: payload.data.result,
      };

    case COMPANY_CALENDAR_LOADED:
      return {
        ...state,
        btnLoading: false,
        companyCalendar: payload.data.result,
      };
    case COMPANY_TIMEZONE:
      return {
        ...state,
        timezoneName: payload,
      };
    case LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
}
