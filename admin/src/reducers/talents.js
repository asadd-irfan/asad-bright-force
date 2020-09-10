// types
import {
    TALENTS_LOADED,
    BTN_LOADING_TRUE,
    CLEAR_SERVER_ERRORS,
    ALL_TALENTS_LOADED_COUNT,
    TALENT_LOADED,
    TALENT_EVALUATION_LOADED,
    TALENT_EVALUATION_LOADED_ERROR,
    TALENT_MANAGER_MEETING_LOADED,
    TALENTS_MANAGER_MEETING_LOADED_ERROR,
    TALENT_PROF_INTERVIEW_LOADED,
    TALENT_PROF_INTERVIEW_LOADED_ERROR,
    ALL_TALENTS_COUNT_LOADED,
    ALL_TALENTS_COUNT_LOADED_ERROR
} from '../actions/types';


// initial state
const initialState = {
    talents: null,
    talentsTotalLength: 0,
    allTalentsCount: 0,
    btnLoading: false,
    selectedTalent: null,
    selectedTalentEvaluation: null,
    talentManagerMeeting: null,
    talentProfInterview: null,
    allTalentsCountData: null
};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case TALENTS_LOADED:
            return {
                ...state,
                talents: payload.result,
                talentsTotalLength: payload.length ? payload.length : 0,
                btnLoading: false,
            };
        case TALENT_LOADED:
            return {
                ...state,
                selectedTalent: payload.result,
                btnLoading: false,
            };
        case TALENT_EVALUATION_LOADED:
            return {
                ...state,
                selectedTalentEvaluation: payload.data,
                btnLoading: false,
            };
        case TALENT_EVALUATION_LOADED_ERROR:
            return {
                ...state,
                selectedTalentEvaluation: null,
                btnLoading: false,
            };
        case TALENT_MANAGER_MEETING_LOADED:
            return {
                ...state,
                talentManagerMeeting: payload.result,
                btnLoading: false,
            };
        case TALENTS_MANAGER_MEETING_LOADED_ERROR:
            return {
                ...state,
                talentManagerMeeting: null,
                btnLoading: false,
            };
        case TALENT_PROF_INTERVIEW_LOADED:
            return {
                ...state,
                talentProfInterview: payload.result,
                btnLoading: false,
            };
        case TALENT_PROF_INTERVIEW_LOADED_ERROR:
            return {
                ...state,
                talentProfInterview: null,
                btnLoading: false,
            };
        case ALL_TALENTS_LOADED_COUNT:
            return {
                ...state,
                allTalentsCount: payload,
                btnLoading: false,
            };
        case ALL_TALENTS_COUNT_LOADED:
            return {
                ...state,
                allTalentsCountData: payload.result,
                btnLoading: false,
            };
        case ALL_TALENTS_COUNT_LOADED_ERROR:
            return {
                ...state,
                allTalentsCountData: null,
                btnLoading: false,
            };
        case CLEAR_SERVER_ERRORS:
            return {
                ...state,
                serverErrors: null
            };
        
        case BTN_LOADING_TRUE:
            return {
                ...state,
                btnLoading: true
            }
        
        default:
            return state;
    }
}
