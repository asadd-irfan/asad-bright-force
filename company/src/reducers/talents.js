// types
import {
    TALENT_LOADED,
    TALENT_CALENDAR_LOADED,
    TALENT_OFFERS_LOADED,

} from '../actions/types';


// initial state
const initialState = {
    selectedTalent: null,
    selectedTalentCalendar: null,
    selectedTalentOffers: null,
    
};

// handle actions
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case TALENT_LOADED:
            return {
                ...state,
                selectedTalent: payload.data.result,
            }
        case TALENT_CALENDAR_LOADED:
            return {
                ...state,
                selectedTalentCalendar: payload.data.result,
            }
        
        case TALENT_OFFERS_LOADED:
            return {
                ...state,
                selectedTalentOffers: payload.data.result,
            }
        
        default:
            return state;
    }
}
