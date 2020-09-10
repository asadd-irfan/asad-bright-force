// types
import {
    ALL_COMPANIES_POSITIONS_LOADED,
    POSITIONS_BTN_LOADING_TRUE,
    CLEAR_SERVER_ERRORS,
    POSITIONS_API_ERROR,
    SET_POSITION_NAV_ITEM,
    SET_POSITION_SIDEBAR_KEY,
    POSITIONS_DETAILS_LOADED,
    FILTERED_POSITION_TALENTS_LOADED,
    FILTERED_POSITION_TALENTS_NULL,
    UPDATE_POSITION_SUCCESS,
    UPDATE_POSITION_FAILURE,
    RECRUITMENT_CANDIDATES_LIST_LOADED,
    NULL_ALL_POSITION_RESOURCES,
    CURRENT_GROUP_INDEX,
    SELECTED_POSITION_NULL,
    POSITIONS_COUNT,
    SELECTED_TALENT_POSITIONS_LOADED,
    SELECTED_POSITION_TALENT_NULL,
    PROCESSED_POSITION_TALENTS_LOADED,
    PROCESSED_POSITION_TALENTS_REMOVE,
    
} from '../actions/types';


// initial state
const initialState = {
    allCompaniesPositions: null,
    allCompaniesPositionsCount: 0,
    btnLoading: false,
    selectedPositionDetails: null,
    serverErrors: null,
    positionApiResponse: null,
    selectedPositionNavbarItem: 'allCompanyPositions',
    sidebarKey: '1',
    filteredPositionTalents: [],
    processedPositionTalents: [],
    recruitmentCandidatesList: null,
    companyLongListCandidates: null,
    currentGroupIndex: 1,
    groupData: null,
    positionsCount: null,
    selectedTalentPositions: [],

};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ALL_COMPANIES_POSITIONS_LOADED:
            return {
                ...state,
                allCompaniesPositions: payload.result,
                allCompaniesPositionsCount: payload.length ? payload.length : 0,
                btnLoading: false,
            };
        case POSITIONS_API_ERROR:
            return {
                ...state,
                serverErrors: payload,
                btnLoading: false,
                selectedTalentPositions: [],
            };
            case POSITIONS_COUNT:
              return {
                  ...state,
                  positionsCount: payload.result,
                  btnLoading: false,
              };
        case CLEAR_SERVER_ERRORS:
            return {
                ...state,
                serverErrors: null,
                btnLoading: false,
            };
        case SELECTED_POSITION_TALENT_NULL:
            return {
                ...state,
                selectedTalentPositions: [],
                btnLoading: false,
            };

        case POSITIONS_BTN_LOADING_TRUE:
            return {
                ...state,
                btnLoading: true
            };
        case SELECTED_TALENT_POSITIONS_LOADED:
            return {
                ...state,
                btnLoading: false,
                selectedTalentPositions: payload.result
            };
        case SET_POSITION_NAV_ITEM:
            return {
                ...state,
                selectedPositionNavbarItem: payload,
                btnLoading: false,
            }
        case SET_POSITION_SIDEBAR_KEY: {
            return {
                ...state,
                sidebarKey: payload,
                btnLoading: false,
            }
        }
        case POSITIONS_DETAILS_LOADED: {
            return {
                ...state,
                selectedPositionDetails: payload.result,
                btnLoading: false,
            }
        }
        case SELECTED_POSITION_NULL: {
            return {
                ...state,
                selectedPositionDetails: null,
                groupData: null,
                btnLoading: false,
            }
        }
        case FILTERED_POSITION_TALENTS_LOADED:
            return {
                ...state,
                filteredPositionTalents: payload.result,
                btnLoading: false,
            };
        case PROCESSED_POSITION_TALENTS_LOADED:
            return {
                ...state,
                processedPositionTalents: payload.result,
                btnLoading: false,
            };
            case PROCESSED_POSITION_TALENTS_REMOVE:
              return {
                  ...state,
                  processedPositionTalents: payload,
                  btnLoading: false,
              };
            
        case FILTERED_POSITION_TALENTS_NULL:
            return {
                ...state,
                filteredPositionTalents: [],
                btnLoading: false,
            };
        case RECRUITMENT_CANDIDATES_LIST_LOADED:
            let groupDataTemp = {
                ...state.groupData,
            }
            groupDataTemp[action.key] = payload.result
            return {
                ...state,
                recruitmentCandidatesList: payload.result,
                groupData: groupDataTemp,
                btnLoading: false,
            };
        case CURRENT_GROUP_INDEX:
            return {
                ...state,
                currentGroupIndex: payload
            };
        case NULL_ALL_POSITION_RESOURCES:
            return {
                ...state,
                btnLoading: false,
                filteredPositionTalents: [],
                recruitmentCandidatesList: null,
                companyLongListCandidates: null,
            };
        case UPDATE_POSITION_SUCCESS:
            let response = ''
            // console.log('payload',payload)
            if (payload.data && payload.data.message !== undefined && payload.data.message !== null) {
                response = payload.data.message
            }
            else {
                response = payload
            }
            return {
                ...state,
                positionApiResponse: response,
                btnLoading: false,
                showSuccessNotification: true,
            }
        default:
            return state;
    }
}
