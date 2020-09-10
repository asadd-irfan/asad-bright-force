import { loadTalentApi } from './common'

export const updateCodingChallenge = (values, id) => async dispatch => {
    dispatch(loadTalentApi(`/api/admin/evaluation/coding-challenge/${id}`,'patch', values, id));
};
export const updateVideoInterview = (values, id) => async dispatch => {
    dispatch(loadTalentApi(`/api/admin/evaluation/video-interview/${id}`,'patch', values, id));
};
export const updateManagerMeeting = (values, id) => async dispatch => {
    dispatch(loadTalentApi(`/api/admin/evaluation/TM-meeting/${id}`,'patch', values, id));
};
export const updateProfessionalInterview = (values, id) => async dispatch => {
    dispatch(loadTalentApi(`/api/admin/evaluation/professional-interview/${id}`,'patch', values, id));
};
