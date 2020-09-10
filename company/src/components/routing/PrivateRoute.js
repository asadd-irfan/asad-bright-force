import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotAuthorized from '../layout/NotAuthorized';

const compareArray = (arr1, arr2) => {
  return arr1.some(el => arr2.includes(el.toString()))
}


const PrivateRoute = ({ component: Component, layout: Layout, accessRights: accessRights, ...rest }) => {
  // console.log('accessRights',accessRights)
    const auth = useSelector(state => state.auth);
    const { isAuthenticated, user, loading } = auth;
    const isAuthorizedRole = isAuthenticated && user && (user.role === 'admin' || user.role === 'moderator');
    let isAuthorizedToAccess;
    if (user && user.role === 'admin') {
      isAuthorizedToAccess = true;
    } else {
      isAuthorizedToAccess = user && compareArray(user.authorizations, accessRights);
    }
    if (loading) return <h5>loading...</h5>;
    // if not authorized and not loading redirect to login
    else if (!isAuthorizedRole && !loading ) return <Redirect to='/company/login' />;
    else if (!isAuthorizedToAccess) return <NotAuthorized />;

    
    //otherwise render the given component
    else return <Route {...rest} render={props => <Layout><Component {...props} /></Layout>} />;
};

export default PrivateRoute;
