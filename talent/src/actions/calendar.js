import { loadApi } from "./common";
import {
  // TM_ERROR,
  TM_LOADED,
  TALENT_TIMEZONE,
} from "./types";
import axios from "axios";

export const getTManagersDetails = (params) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/talent/calender?${params}`);
    dispatch({
      type: TM_LOADED,
      payload: res.data.result,
    });
  } catch (error) {
    // dispatch({ type: TM_ERROR, payload: error.response.data });
  }
};

export const mergeTwoEvents = (values) => async (dispatch) => {
  dispatch(loadApi(`/api/talent/merge-events`, "patch", values));
};

export const getTimeZoneName = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/talent/timezone-name/${id}`);
    dispatch({
      type: TALENT_TIMEZONE,
      payload: res.data?.result?.name,
    });
  } catch (error) {
    // dispatch({ type: TM_ERROR, payload: error.response.data });
  }
};

export const scheduleTalentMeeting = (values) => async (dispatch) => {
  dispatch(loadApi(`/api/talent/schedule-TM-meeting`, "patch", values));
};
export const scheduleProfessionalInterviewMeeting = (values) => async (
  dispatch
) => {
  dispatch(
    loadApi(`/api/talent/schedule-professional-interview`, "patch", values)
  );
};
