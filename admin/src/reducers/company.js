// types
import {
  COMPANY_REQUESTS_LOADED,
  COMPANY_REQUEST_LOADED,
  SERVER_ERROR,
  BTN_LOADING_TRUE,
  SET_COMPANY_NAV_ITEM,
  COMPANIES_LOADED,
  COMPANY_POSITIONS_LOADED,
  COMPANY_FOR_ASSIGN,
  UPDATE_MAIL_TOKEN,
  REMOVE_MAIL_TOKEN,
  UPDATE_FAILURE,
  COMPANY_LOADED,
  COMPANY_USERS_LOADED,
  COMPANY_AND_REQUESTS_COUNT_LOADED,
  SET_COMPANY_TAB_PANEL_KEY,
  COMPANY_SUGGESTIONS,
} from "../actions/types";

// initial state
const initialState = {
  companyRequests: null,
  selectedCompanyRequest: null,
  selectedCompany: null,
  companyRequestsCount: 0,
  openPositions: 0,
  companyAllPositions: null,
  btnLoading: false,
  serverErrors: null,
  selectedCompanyNavbarItem: "all",
  allCompanies: null,
  allCompaniesCount: 0,
  allCompaniesSuggestions: null,
  selectedCompanyForAssign: null,
  mailToken: null,
  companyUsers: null,
  companyAndRequestsCount: null,
  companyTabPanelKey: "profile",
};

// handle actions
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case COMPANY_REQUESTS_LOADED:
      return {
        ...state,
        btnLoading: false,
        companyRequests: payload.data.result,
        companyRequestsCount: payload.data.length,
      };
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

    case SET_COMPANY_NAV_ITEM:
      return {
        ...state,
        selectedCompanyNavbarItem: payload,
      };

    case COMPANY_FOR_ASSIGN:
      return {
        ...state,
        selectedCompanyForAssign: payload,
      };

    case COMPANIES_LOADED:
      return {
        ...state,
        btnLoading: false,
        allCompanies: payload.data.result,
        allCompaniesCount: payload.data.length,
      };
    case COMPANY_POSITIONS_LOADED:
      return {
        ...state,
        companyAllPositions: payload.data.result,
      };
    case COMPANY_SUGGESTIONS:
      return {
        ...state,
        btnLoading: false,
        allCompaniesSuggestions: payload.data.result,
      };

    case COMPANY_LOADED:
      return {
        ...state,
        btnLoading: false,
        selectedCompany: payload.data.result.result,
        openPositions: payload.data.result.openPositions,
        companyAllPositions: null
      };

    case COMPANY_AND_REQUESTS_COUNT_LOADED:
      return {
        ...state,
        btnLoading: false,
        companyAndRequestsCount: payload.data.result,
      };

    case SET_COMPANY_TAB_PANEL_KEY:
      return {
        ...state,
        btnLoading: false,
        companyTabPanelKey: payload,
      };

    case UPDATE_MAIL_TOKEN:
      return {
        ...state,
        btnLoading: false,
        mailToken: payload.data.URL,
      };

    case REMOVE_MAIL_TOKEN:
      return {
        ...state,
        btnLoading: false,
        mailToken: null,
      };

    case UPDATE_FAILURE:
      return {
        ...state,
        btnLoading: false,
        mailToken: null,
      };
    default:
      return state;
  }
}
