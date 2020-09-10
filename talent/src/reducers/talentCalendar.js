// types
import {
  TALENT_CALENDAR_LOADED,
  TALENT_CALENDAR_API_RESPONSE,
  UPDATE_CALENDER_TYPE,
  LOGOUT_USER,
  TALENT_TIMEZONE,
} from "../actions/types";

const initialState = {
  talentScheduleEvents: null,
  talentCalenderApiResponse: null,
  calendarType: null,
  timezoneName: null,
};

// handle actions
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TALENT_CALENDAR_LOADED:
      return {
        ...state,
        talentScheduleEvents: payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        talentScheduleEvents: null,
        talentCalenderApiResponse: null,
        calendarType: null,
      };

    case TALENT_CALENDAR_API_RESPONSE:
      return {
        ...state,
        talentCalenderApiResponse: payload.message,
      };

    case UPDATE_CALENDER_TYPE:
      return {
        ...state,
        calendarType: payload,
      };
    case TALENT_TIMEZONE:
      return {
        ...state,
        timezoneName: payload,
      };

    default:
      return state;
  }
}
