import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';



const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
    const auth = useSelector(state => state.auth);
    const { isAuthenticated, user, loading } = auth;
    const isAuthorized = isAuthenticated && user && user.role === 'admin';

    if (loading) return <div style={{ margin: '0 auto', padding: '0 auto' }}><h5>Loading...</h5></div>;
    // if not authorized and not loading redirect to login
    else if (!isAuthorized && !loading) return <Redirect to='/admin/login' />;
    //otherwise render the given component
    else return <Route {...rest} render={props => <Layout><Component {...props} /></Layout>} />;
};

export default PrivateRoute;
