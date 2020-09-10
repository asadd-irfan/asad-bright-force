import { loadApi } from './common'

export const updateExperience = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/experience`,'patch', values));
};

export const suggestSkill = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/suggest-skill`,'post', values));
};

export const suggestCompany = (values) => async dispatch => {
  dispatch(loadApi(`/api/talent/suggest-company`,'post', values));
};



