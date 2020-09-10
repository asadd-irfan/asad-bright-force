

import { loadApi } from './common'

export const addEducation = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/education`,'post',values));
};

export const deleteEducation = (id) => async dispatch => {
    dispatch(loadApi(`/api/talent/education/${id}`,'delete'));
};


export const editEducation = (id, values) => async dispatch => {
    dispatch(loadApi(`/api/talent/education/${id}`,'patch', values));
};







