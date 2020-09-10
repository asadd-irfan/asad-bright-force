import { loadApi } from './common'

export const updateRolePreferences = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/preferred-roles`,'patch', values));
};




