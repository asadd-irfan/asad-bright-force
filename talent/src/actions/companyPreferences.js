import { loadApi } from './common'

export const updateCompanyPreferences = (values) => async dispatch => {
    dispatch(loadApi(`/api/talent/company-preferences`,'patch', values));
};



