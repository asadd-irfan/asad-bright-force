// types
import {
    ALL_INVITES_LOADED,
    INVITE_POSITION_DETAILS_LOADED,
    INVITE_OFFER_DETAILS_LOADED,
    ALL_INVITES_POSITION_DETAILS_LOADED, 
    RECRUITMENT_DETAILS_LOADED,
    INTERVIEW_DETAILS_LOADED,
    LOGOUT_USER,

} from '../actions/types';


const initialState = {
    allInvites: [],
    allInvitePositionDetails: [],
    inviteOfferDetails: null,
    invitePositionDetails: null,
    recruitmentDetails: null,
    interviewDetails: null,
};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ALL_INVITES_LOADED:
            return {
                ...state,
                allInvites: payload.data.result
            };
            
        case INVITE_POSITION_DETAILS_LOADED:
            return {
                ...state,
                invitePositionDetails: payload.data.result
            };
            
        case INVITE_OFFER_DETAILS_LOADED:
            return {
                ...state,
                inviteOfferDetails: payload.data.result
            };
            
        case ALL_INVITES_POSITION_DETAILS_LOADED:
            return {
                ...state,
                allInvitePositionDetails: [...state.allInvitePositionDetails, payload.data.result]
            };
            
        case RECRUITMENT_DETAILS_LOADED:
            return {
                ...state,
                recruitmentDetails: payload.data.result
            };
            case INTERVIEW_DETAILS_LOADED:
              return {
                  ...state,
                  interviewDetails: payload.data.result
              };
            
              case LOGOUT_USER:
                return {
                    ...state,
                    allInvites: [],
                    allInvitePositionDetails: [],
                    inviteOfferDetails: null,
                    invitePositionDetails: null,
                    recruitmentDetails: null,
                    interviewDetails: null,
                };
        default:
            return state;
    }
}
