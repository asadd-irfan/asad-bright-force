import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { notification, Spin } from 'antd';
// layout
import { Layout } from 'antd';
// import Business from './components/business/Business';
// import Calendar from './components/Calendar';

// import Navbar from './components/layout/Navbar';
// import NotFound from './components/layout/NotFound';
// auth

// import Register from './components/auth/RegisterContainer';
// import Login from './components/auth/LoginContainer';
// import AccountSettings from './components/AccountSettings/AccountSettings';
// import TimeZoneCurrencySettings from './components/AccountSettings/TimeZoneCurrencySettings';
// import BillingDetails from './components/AccountSettings/BillingDetails';
// import Company from './components/Company/index';
// import Recruitment from './components/Recruitment/index';
// import ViewOffer from './components/Recruitment/ViewOffer';
// import RecruitmentDetails from './components/Recruitment/Details/index';
// import TalentPage from './components/Recruitment/TalentPage';
// import ScheduleInterviewTalentPage from './components/Recruitment/TalentPage/ScheduleInterview';
// import EditPosition from './components/Recruitment/EditPosition/EditPosition';
// import ViewPosition from './components/Recruitment/ViewPosition/ViewPosition';
// import Avatar from './components/AccountSettings/Avatar';
// import SettingsSubNavbarButtons from './components/layout/SettingsSubNavbarButtons';
// import HireSubNavbarButtons from './components/layout/HireSubNavbarButtons';
// import ManagerUsers from './components/Company/ManagerUsers';
// import Manage from './components/Manage';
// dashboards
// import SidebarLayout from './components/layout/SidebarLayout';
// import FullScreenLayout from './components/layout/FullScreenLayout';

import { useSelector, useDispatch } from "react-redux";
import { errorNotification, successNotification } from "./common/commonMethods";
import { resetNotificationSetting } from './actions/common';
import { getAllUsersOfCompany, getCompanyDetails } from './actions/company';


// routing
import PrivateRoute from './components/routing/PrivateRoute';
// actions
import { loadUser, clearServerErrors, loadAppConfigs } from './actions/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

// import Notifications from './components/Notifications';
// import HomePage from './components/Home/index';
// import RegisterFirstUser from './components/auth/RegisterFirstUser';
// import RegisterOtherUser from './components/auth/RegisterOtherUser';

const { Header } = Layout;

const Login = lazy(() => import('./components/auth/LoginContainer'));
const Register = lazy(() => import('./components/auth/RegisterContainer'));
const RegisterMessage = lazy(() => import('./components/auth/RegisterMessage'));
const RegisterOtherUser = lazy(() => import('./components/auth/RegisterOtherUser'));
const RegisterFirstUser = lazy(() => import('./components/auth/RegisterFirstUser'));
const HomePage = lazy(() => import('./components/Home/index'));
const Notifications = lazy(() => import('./components/Notifications'));
const FullScreenLayout = lazy(() => import('./components/layout/FullScreenLayout'));
const SidebarLayout = lazy(() => import('./components/layout/SidebarLayout'));
const Navbar = lazy(() => import('./components/layout/Navbar'));
const NotFound = lazy(() => import('./components/layout/NotFound'));
const Business = lazy(() => import('./components/business/Business'));
const Calendar = lazy(() => import('./components/Calendar'));
const Manage = lazy(() => import('./components/Manage'));
const AccountSettings = lazy(() => import('./components/AccountSettings/AccountSettings'));
const Avatar = lazy(() => import('./components/AccountSettings/Avatar'));
const TimeZoneCurrencySettings = lazy(() => import('./components/AccountSettings/TimeZoneCurrencySettings'));
const BillingDetails = lazy(() => import('./components/AccountSettings/BillingDetails'));
const Company = lazy(() => import('./components/Company/index'));
const ManagerUsers = lazy(() => import('./components/Company/ManagerUsers'));
const Recruitment = lazy(() => import('./components/Recruitment/index'));
const CreatePosition = lazy(() => import('./components/Recruitment/CreatePosition'));
const ViewOffer = lazy(() => import('./components/Recruitment/ViewOffer'));
const RecruitmentDetails = lazy(() => import('./components/Recruitment/Details/index'));
const TalentPage = lazy(() => import('./components/Recruitment/TalentPage'));
const ScheduleInterviewTalentPage = lazy(() => import('./components/Recruitment/TalentPage/ScheduleInterview'));
const RescheduleInterviewTalentPage = lazy(() => import('./components/Recruitment/TalentPage/ScheduleInterview/RescheduleInterview'));
const EditPosition = lazy(() => import('./components/Recruitment/EditPosition/EditPosition'));
const ViewPosition = lazy(() => import('./components/Recruitment/ViewPosition/ViewPosition'));
const SettingsSubNavbarButtons = lazy(() => import('./components/layout/SettingsSubNavbarButtons'));
const HireSubNavbarButtons = lazy(() => import('./components/layout/HireSubNavbarButtons'));


let loggedIn = async () => {
  return localStorage.token;
};
notification.config({
  duration: 2,
});

function CompanyDashboard() {
  const hire = ['hire'];
  const manage = ['manage'];
  const accessAll = ['manage', 'hire'];

  return loggedIn && localStorage.userType === 'company' ? (
    <Switch>
      <PrivateRoute exact path='/company/business' layout={FullScreenLayout} component={Business} accessRights={accessAll} />
      <PrivateRoute exact path='/company/user/avatar' layout={FullScreenLayout} component={Avatar} accessRights={accessAll} />
      <PrivateRoute exact path='/company/user/setting' layout={FullScreenLayout} component={AccountSettings} accessRights={accessAll} />
      <PrivateRoute exact path='/company/settings/manage-users' layout={FullScreenLayout} component={ManagerUsers} accessRights={accessAll} />
      <PrivateRoute exact path='/company/settings/timezone-currency' layout={FullScreenLayout} component={TimeZoneCurrencySettings} accessRights={accessAll} />
      <PrivateRoute exact path='/company/settings/billing' layout={FullScreenLayout} component={BillingDetails} accessRights={accessAll} />
      <PrivateRoute exact path='/company/notifications' layout={FullScreenLayout} component={Notifications} accessRights={accessAll} />
      <PrivateRoute exact path='/company/home' layout={FullScreenLayout} component={HomePage} accessRights={accessAll} />
      <PrivateRoute exact path='/company/hire/profile' layout={SidebarLayout} component={Company} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/calender' layout={SidebarLayout} component={Calendar} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/view-position/:id' layout={SidebarLayout} component={ViewPosition} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/edit-position/:id' layout={SidebarLayout} component={EditPosition} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment' layout={SidebarLayout} component={Recruitment} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/position' layout={SidebarLayout} component={CreatePosition} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/details/:id' layout={SidebarLayout} component={RecruitmentDetails} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/talent-page/:id' layout={SidebarLayout} component={TalentPage} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/view-offer/:id' layout={SidebarLayout} component={ViewOffer} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/talent-page/schedule-interview/:id' layout={SidebarLayout} component={ScheduleInterviewTalentPage} accessRights={hire} />
      <PrivateRoute exact path='/company/hire/recruitment/talent-page/reschedule-interview/:id' layout={SidebarLayout} component={RescheduleInterviewTalentPage} accessRights={hire} />
      <PrivateRoute exact path='/company/manage' layout={FullScreenLayout} component={Manage} accessRights={manage} />
      <PrivateRoute layout={FullScreenLayout} component={NotFound} accessRights={accessAll} />
    </Switch>
  ) : <Redirect to='/company/login' />;
}

const App = ({ store }) => {

  const auth = useSelector(state => state.auth);
  const { isAuthenticated, user } = auth;
  const isAuthorized = isAuthenticated && user && (user.role === 'admin' || user.role === 'moderator');
  const dispatch = useDispatch();
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const userErrors = useSelector(state => state.auth.userErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    userErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [userErrors, showSuccessNotification]);

  useEffect(() => {
    if (isAuthorized) {
      dispatch(loadAppConfigs());
      dispatch(getAllUsersOfCompany());
      dispatch(getCompanyDetails());
    }
  }, [isAuthorized]);


  const openErrorNotification = () => {
    errorNotification(userErrors);
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
          {isAuthorized &&
            <>
              <Header>
                <Navbar />
              </Header>
              <Layout>
                <SettingsSubNavbarButtons />
              </Layout>
              {/* <Layout>
                <HireSubNavbarButtons />
              </Layout> */}
            </>
          }
          <Layout style={{ height: '100%' }}>
            <Switch>
              <Route path='/company/register' component={Register} />
              <Route path='/company/register-message' component={RegisterMessage} />
              <Route path='/company/register-first-user' component={RegisterFirstUser} />
              <Route path='/company/register-other-user' component={RegisterOtherUser} />
              <Route path='/company/login' component={Login} />
              <CompanyDashboard />
            </Switch>
          </Layout>
        </Layout>
      </Suspense>
    </Router>

  );
};

export default App;
