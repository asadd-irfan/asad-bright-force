import { loadApi } from './common'

export const addWorkExperience = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/work-experience`,'post',values));
};

export const deleteWorkExperience = (id) => async dispatch => {
    dispatch(loadApi(`/api/talent/work-experience/${id}`,'delete'));
};

export const editWorkExperience = (id, values) => async dispatch => {
    dispatch(loadApi(`/api/talent/work-experience/${id}`,'patch', values));
};


