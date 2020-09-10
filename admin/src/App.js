import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { notification, Spin } from 'antd';
// layout
import { Layout } from 'antd';

// auth
// import Register from './components/auth/RegisterContainer';
// import Login from './components/auth/LoginContainer';
// dashboards
// import SidebarLayout from './components/layout/SidebarLayout';
// import FullScreenLayout from './components/layout/FullScreenLayout';
// import Navbar from './components/layout/Navbar';
// import NotFound from './components/layout/NotFound';

import { useSelector, useDispatch } from "react-redux";
import { errorNotification, successNotification } from "./common/commonMethods";
import { resetNotificationSetting } from './actions/common';


// routing
import PrivateRoute from './components/routing/PrivateRoute';
// actions
import { loadUser, clearServerErrors } from './actions/auth';
import { getAllCompanyRequests, getAllCompanies, getCompanyAndRequestsCount } from './actions/company';
import { getAllAdmins } from './actions/talentManager';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
// import Talents from './components/Dashboard/Components/Talents';
// import TalentDetails from './components/Dashboard/Components/Talents/TalentsDetails/index';
// import Evaluations from './components/Dashboard/Components/Evaluations';
// import Companies from './components/Dashboard/Components/Companies';
// import CompanyRequest from './components/Dashboard/Components/Companies/Details/CompanyRequest/index';
// import CompanyDetail from './components/Dashboard/Components/Companies/Details/CompanyDetail/index';
// import Invites from './components/Dashboard/Components/Invites';
// import Positions from './components/Dashboard/Components/Positions';
// import PositionFiltering from './components/Dashboard/Components/Positions/Position';
// import AccountManagers from './components/Dashboard/Components/Staff/AccountManagers';
// import AddAccountManager from './components/Dashboard/Components/Staff/AccountManagers/AddAccountManager';
// import EditAccountManager from './components/Dashboard/Components/Staff/AccountManagers/EditAccountManager';
// import AccountManagerDetails from './components/Dashboard/Components/Staff/AccountManagers/AccountManagerDetails';
// import Settings from './components/Dashboard/Components/Settings/index';
// import CoefficientSettings from './components/Dashboard/Components/Settings/CoefficientSettings';

const { Header } = Layout;

const Login = lazy(() => import('./components/auth/LoginContainer'));
const Talents = lazy(() => import('./components/Dashboard/Components/Talents'));
const TalentDetails = lazy(() => import('./components/Dashboard/Components/Talents/TalentsDetails/index'));
const Evaluations = lazy(() => import('./components/Dashboard/Components/Evaluations'));
const Companies = lazy(() => import('./components/Dashboard/Components/Companies'));
const CompanyRequest = lazy(() => import('./components/Dashboard/Components/Companies/Details/CompanyRequest/index'));
const CompanyDetail = lazy(() => import('./components/Dashboard/Components/Companies/Details/CompanyDetail/index'));
const Invites = lazy(() => import('./components/Dashboard/Components/Invites'));
const Positions = lazy(() => import('./components/Dashboard/Components/Positions'));
const PositionFiltering = lazy(() => import('./components/Dashboard/Components/Positions/Position'));
const AccountManagers = lazy(() => import('./components/Dashboard/Components/Staff/AccountManagers'));
const AddAccountManager = lazy(() => import('./components/Dashboard/Components/Staff/AccountManagers/AddAccountManager'));
const EditAccountManager = lazy(() => import('./components/Dashboard/Components/Staff/AccountManagers/EditAccountManager'));
const AccountManagerDetails = lazy(() => import('./components/Dashboard/Components/Staff/AccountManagers/AccountManagerDetails'));
const Settings = lazy(() => import('./components/Dashboard/Components/Settings/index'));
const CoefficientSettings = lazy(() => import('./components/Dashboard/Components/Settings/CoefficientSettings'));
const SidebarLayout = lazy(() => import('./components/layout/SidebarLayout'));
const FullScreenLayout = lazy(() => import('./components/layout/FullScreenLayout'));
const Navbar = lazy(() => import('./components/layout/Navbar'));
const NotFound = lazy(() => import('./components/layout/NotFound'));


let loggedIn = async () => {
  return localStorage.token;
};
notification.config({
  duration: 2,
});

function AdminDashboard() {
  return loggedIn && localStorage.userType === 'admin' ? (
    <Switch>
      <PrivateRoute exact path='/admin/talents' layout={FullScreenLayout} component={Talents} />
      <PrivateRoute exact path='/admin/talents/:id' layout={FullScreenLayout} component={TalentDetails} />
      <PrivateRoute exact path='/admin/companies' layout={FullScreenLayout} component={Companies} />
      <PrivateRoute exact path='/admin/companies/request/:id' layout={FullScreenLayout} component={CompanyRequest} />
      <PrivateRoute exact path='/admin/companies/company/:id' layout={FullScreenLayout} component={CompanyDetail} />
      <PrivateRoute exact path='/admin/evaluations' layout={SidebarLayout} component={Evaluations} />
      <PrivateRoute exact path='/admin/positions' layout={FullScreenLayout} component={Positions} />
      <PrivateRoute exact path='/admin/positions/company/:id' layout={FullScreenLayout} component={PositionFiltering} />
      <PrivateRoute exact path='/admin/invites' layout={SidebarLayout} component={Invites} />
      <PrivateRoute exact path='/admin/staff/account-managers' layout={FullScreenLayout} component={AccountManagers} />
      <PrivateRoute exact path='/admin/staff/account-manager' layout={FullScreenLayout} component={AddAccountManager} />
      <PrivateRoute exact path='/admin/staff/account-manager/:id' layout={FullScreenLayout} component={EditAccountManager} />
      <PrivateRoute exact path='/admin/staff/account-managers/:id' layout={FullScreenLayout} component={AccountManagerDetails} />
      <PrivateRoute exact path='/admin/config-settings' layout={FullScreenLayout} component={Settings} />
      <PrivateRoute exact path='/admin/coefficient-settings' layout={FullScreenLayout} component={CoefficientSettings} />
      <PrivateRoute layout={FullScreenLayout} component={NotFound} />
    </Switch>
  ) : <Redirect to='/admin/login' />;
}

const App = ({ store }) => {
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, user } = auth;
  const isAuthorized = isAuthenticated && user && user.role === 'admin';
  const dispatch = useDispatch();
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(
    state => state.auth.showSuccessNotification
  );

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification]);

  useEffect(() => {
    if (isAuthorized) {
      dispatch(getAllCompanyRequests(''));
      dispatch(getAllCompanies(''));
      dispatch(getAllAdmins(''));
      dispatch(getCompanyAndRequestsCount())
    }
  }, [isAuthorized]);


  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };


  return (

    <Router>
      <Suspense fallback={
        <div className="div-center">
          <Spin size="large" tip="Loading..." />
        </div>
      }>

        <Layout>
          {isAuthorized && <Header>
            <Navbar />
          </Header>}
          <Layout style={{ height: '100%' }}>
            <Switch>
              {/* <Route path='/admin/register' component={Register} /> */}
              <Route path='/admin/login' component={Login} />
              <AdminDashboard />
            </Switch>
          </Layout>
        </Layout>
      </Suspense>
    </Router>

  );
};

export default App;
