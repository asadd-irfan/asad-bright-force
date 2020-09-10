// types
import {
    COMPANY_POSITIONS_LOADED,
    LATEST_COMPANY_POSITION_CREATED,
    COMPANY_POSITION_DETAILS_LOADED,
    LATEST_COMPANY_POSITION_NULL,
    RECRUITMENT_CANDIDATES_LIST_LOADED,
    SET_SELECTED_POSITION_ID,
    SET_SELECTED_POSITION_RECRUITMENT,
    CLEAR_SERVER_ERRORS_POSITION,
    COMPANY_OFFER_LOADED,
    COMPANY_INTERVIEW_LOADED,
    COMPANY_POSITION_DETAILS_NULL,
    LOGOUT_USER,
    COMPANY_ACTIVE_POSITIONS_LOADED,
    COMPANY_ALL_POSITIONS_TYPE,
    NEW_POSITION_SKILLS,
    NEW_POSITION_FEATURES,
    NEW_POSITION_MANAGEMENT_EXP,
    NEW_POSITION_HIRING_TEAM,
    NEW_POSITION_ROLE_FEATURES,

} from '../actions/types';


// initial state
const initialState = {
    allCompanyPositions: null,
    activePositions: null,
    allPositionsByType: null,
    companyPositionDetails: null,
    latestCompanyPosition: null,
    recruitmentCandidatesList: null,
    selectedPositionId: null,
    selectedPositionRecruitment: null,
    companyPositionOffer: null,
    companyPositionInterview: null,
    newPositionSkills: [],
    newPositionFeatures: [],
    newPositionRoleFeatures: [],
    newPositionHiringTeam: [],
    newPositionManagementExp: false,
};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {

        case NEW_POSITION_SKILLS:
            return {
                ...state,
                newPositionSkills: payload,
            }
        case NEW_POSITION_FEATURES:
            return {
                ...state,
                newPositionFeatures: payload,
            }
        case NEW_POSITION_ROLE_FEATURES:
            return {
                ...state,
                newPositionRoleFeatures: payload,
            }
        case NEW_POSITION_HIRING_TEAM:
            return {
                ...state,
                newPositionHiringTeam: payload,
            }
        case NEW_POSITION_MANAGEMENT_EXP:
            return {
                ...state,
                newPositionManagementExp: payload,
            }
        case COMPANY_POSITION_DETAILS_LOADED:
            return {
                ...state,
                companyPositionDetails: payload.data.result,
            }
        case COMPANY_POSITIONS_LOADED:
            return {
                ...state,
                allCompanyPositions: payload.data.result,
            }

        case COMPANY_ACTIVE_POSITIONS_LOADED:
            return {
                ...state,
                activePositions: payload.data.result,
            }
        case COMPANY_ALL_POSITIONS_TYPE:
            return {
                ...state,
                allPositionsByType: payload.data.result,
            }

        case LATEST_COMPANY_POSITION_CREATED:
            return {
                ...state,
                latestCompanyPosition: payload.data,
            }
        case LATEST_COMPANY_POSITION_NULL:
            return {
                ...state,
                latestCompanyPosition: null,
            }
        case COMPANY_POSITION_DETAILS_NULL:
            return {
                ...state,
                companyPositionDetails: null,
            }
        case RECRUITMENT_CANDIDATES_LIST_LOADED:
            return {
                ...state,
                recruitmentCandidatesList: payload.result,
            }
        case SET_SELECTED_POSITION_ID:
            return {
                ...state,
                selectedPositionId: payload,
            }
        case SET_SELECTED_POSITION_RECRUITMENT:
            return {
                ...state,
                selectedPositionRecruitment: payload,
            }
        case COMPANY_OFFER_LOADED: {
            return {
                ...state,
                companyPositionOffer: payload.data.result
            }
        }
        case COMPANY_INTERVIEW_LOADED: {
            return {
                ...state,
                companyPositionInterview: payload.data.result
            }
        }
        case CLEAR_SERVER_ERRORS_POSITION:
            return {
                ...state,
                serverErrorsPosition: null
            };
        case LOGOUT_USER:
            return initialState;
        default:
            return state;
    }
}
