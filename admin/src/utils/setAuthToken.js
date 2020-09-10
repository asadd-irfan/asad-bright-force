import axios from 'axios';

// This function checks if a token exists and 
// if it is sets it on a global header
const setAuthToken = token => {
    if (token)
        //set global header
        // axios.defaults.headers.common['Bearer ']=token;
        axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
    else
        //delete token
        axios.defaults.headers.common['Authorization'] = null;
}

export default setAuthToken;