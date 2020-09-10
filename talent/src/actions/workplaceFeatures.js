import { loadApi } from './common'

export const updateWorkplaceFeatures = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/workplace-features`,'patch', values));
};


