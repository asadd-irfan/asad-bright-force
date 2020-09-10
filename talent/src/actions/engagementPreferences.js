import { loadApi } from './common'

export const updateEngagementPreferences = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/engagement-preferences`,'patch', values));
};


