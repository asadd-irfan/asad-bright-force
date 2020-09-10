
import { loadApi } from './common'

export const updateFreelancerAvailability = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/freelancer`,'patch', values));
};


