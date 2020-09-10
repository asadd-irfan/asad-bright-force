import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { notification, Spin, Layout, Space } from "antd";

// import Navbar from './components/layout/Navbar';
import SubNavbarButtons from "./components/layout/SubNavbarButtons";
// import NotFound from './components/layout/NotFound';
// auth

// import Register from './components/auth/RegisterContainer';
// import Login from './components/auth/LoginContainer';

// dashboards

// import ViewProfile from './components/Dashboard/Components/ViewProfile/ViewProfile';
// import PersonalInformation from './components/Dashboard/Components/PersonalInformation';
// import AccountSettings from './components/Dashboard/Components/AccountSettings/AccountSettings';
// import BlockedCompanies from './components/Dashboard/Components/BlockedCompanies/BlockedCompanies';
// import JobSearch from './components/Dashboard/Components/JobSearchPage/JobSearch';
// import EngagementPreferences from './components/Dashboard/Components/EngagementPreferences';
// import WorkplaceFeatures from './components/Dashboard/Components/WorkplaceFeatures/WorkplaceFeatures';
// import WorkExperience from './components/Dashboard/Components/WorkEducation';
// import Education from './components/Dashboard/Components/WorkEducation/Education';
// import CompanyPreferences from './components/Dashboard/Components/CompanyPrefrences';
// import SidebarLayout from './components/layout/SidebarLayout';
// import FullScreenLayout from './components/layout/FullScreenLayout';
// import RolePreference from './components/Dashboard/Components/PreferredRole/PreferredRole';
// import AboutMe from './components/Dashboard/Components/About/AboutMe';
// import Evaluation from './components/Evaluation/Components';
// import InviteFriend from './components/InviteFriend';
// import TalentCalendar from './components/Calendar/Calendar'
// import TalentInvites from './components/Invites/index'
// import PositionDetails from './components/Invites/positionDetails'
// import Languages from './components/Dashboard/Components/Languages';
// import TimeZoneCurrencySettings from './components/Dashboard/Components/TimeZoneCurrencySettings/TimeZoneCurrencySettings';
import { useSelector, useDispatch } from "react-redux";

// routing
import PrivateRoute from "./components/routing/PrivateRoute";
// redux
import { Provider } from "react-redux";
import storeConfig from "./store";
// actions
import { loadUser, loadAppConfigs } from "./actions/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
const Login = lazy(() => import("./components/auth/LoginContainer"));
const ForgetPassword = lazy(() => import("./components/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const Register = lazy(() => import("./components/auth/RegisterContainer"));
const EngagementPreferences = lazy(() =>
  import("./components/Dashboard/Components/EngagementPreferences")
);
const CompanyPreferences = lazy(() =>
  import("./components/Dashboard/Components/CompanyPrefrences")
);
const PersonalInformation = lazy(() =>
  import("./components/Dashboard/Components/PersonalInformation")
);
const ViewProfile = lazy(() =>
  import("./components/Dashboard/Components/ViewProfile/ViewProfile")
);

const Navbar = lazy(() => import("./components/layout/Navbar"));
const NotFound = lazy(() => import("./components/layout/NotFound"));
const AccountSettings = lazy(() =>
  import("./components/Dashboard/Components/AccountSettings/AccountSettings")
);
const Avatar = lazy(() =>
  import("./components/Dashboard/Components/AccountSettings/Avatar")
);
const BlockedCompanies = lazy(() =>
  import("./components/Dashboard/Components/BlockedCompanies/BlockedCompanies")
);
const JobSearch = lazy(() =>
  import("./components/Dashboard/Components/JobSearchPage/JobSearch")
);
const WorkplaceFeatures = lazy(() =>
  import(
    "./components/Dashboard/Components/WorkplaceFeatures/WorkplaceFeatures"
  )
);
const WorkExperience = lazy(() =>
  import("./components/Dashboard/Components/WorkEducation")
);
const Education = lazy(() =>
  import("./components/Dashboard/Components/WorkEducation/Education")
);
const SidebarLayout = lazy(() => import("./components/layout/SidebarLayout"));
const FullScreenLayout = lazy(() =>
  import("./components/layout/FullScreenLayout")
);
const RolePreference = lazy(() =>
  import("./components/Dashboard/Components/PreferredRole/PreferredRole")
);
const AboutMe = lazy(() =>
  import("./components/Dashboard/Components/About/AboutMe")
);
const Evaluation = lazy(() => import("./components/Evaluation/Components"));
const InviteFriend = lazy(() => import("./components/InviteFriend"));
const TalentCalendar = lazy(() => import("./components/Calendar/Calendar"));
const TalentInvites = lazy(() => import("./components/Invites/index"));
const PositionDetails = lazy(() =>
  import("./components/Invites/positionDetails")
);
const Languages = lazy(() =>
  import("./components/Dashboard/Components/Languages")
);
const TimeZoneCurrencySettings = lazy(() =>
  import(
    "./components/Dashboard/Components/TimeZoneCurrencySettings/TimeZoneCurrencySettings"
  )
);

const { Header } = Layout;

let loggedIn = async () => {
  return localStorage.token;
};
notification.config({
  duration: 2,
});

function TalentDashboard() {
  return loggedIn && localStorage.userType === "talent" ? (
    <Switch>
      <PrivateRoute
        exact
        path="/talent/profile/engagement-preferences"
        component={EngagementPreferences}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/profile/company-preferences"
        component={CompanyPreferences}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/profile"
        component={PersonalInformation}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/view-profile"
        component={ViewProfile}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/workplace"
        component={WorkplaceFeatures}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/experience"
        component={WorkExperience}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/education"
        component={Education}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/settings"
        component={AccountSettings}
        layout={FullScreenLayout}
      />
      <PrivateRoute
        exact
        path="/talent/avatar"
        component={Avatar}
        layout={FullScreenLayout}
      />
      <PrivateRoute
        exact
        path="/talent/blocked-companies"
        component={BlockedCompanies}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/job-search"
        component={JobSearch}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/roles"
        component={RolePreference}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/about"
        component={AboutMe}
        layout={SidebarLayout}
      />
      {/* <PrivateRoute exact path='/talent/languages' component={Languages} layout={SidebarLayout} /> */}
      <PrivateRoute
        exact
        path="/talent/opportunities"
        component={TalentInvites}
        layout={FullScreenLayout}
      />
      <PrivateRoute
        exact
        path="/talent/opportunities-details/:id"
        component={PositionDetails}
        layout={FullScreenLayout}
      />
      <PrivateRoute
        exact
        path="/talent/timezone-currency"
        component={TimeZoneCurrencySettings}
        layout={SidebarLayout}
      />
      <PrivateRoute
        exact
        path="/talent/evaluation"
        component={Evaluation}
        layout={FullScreenLayout}
      />
      <PrivateRoute
        exact
        path="/talent/calendar"
        component={TalentCalendar}
        layout={FullScreenLayout}
      />
      <PrivateRoute
        exact
        path="/talent/invite-friend"
        component={InviteFriend}
        layout={FullScreenLayout}
      />
      <PrivateRoute component={NotFound} layout={FullScreenLayout} />
    </Switch>
  ) : (
    <Redirect to="/talent/login" />
  );
}

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { store } = storeConfig;
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadAppConfigs());
  }, []);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="div-center">
            <Spin size="large" tip="Loading..." />
          </div>
        }
      >
        <Layout>
          {isAuthenticated && (
            <>
              <Header>
                <Navbar />
              </Header>
              <Layout>
                <SubNavbarButtons />
              </Layout>
            </>
          )}
          <Layout style={{ height: "100%" }}>
            <Switch>
              <Route path="/talent/register" component={Register} />
              <Route path="/talent/login" component={Login} />
              <Route
                path="/talent/forget-password"
                component={ForgetPassword}
              />
              <Route
                path="/talent/reset-password/:token"
                component={ResetPassword}
              />
              <TalentDashboard />
            </Switch>
          </Layout>
        </Layout>
      </Suspense>
    </Router>
  );
};

export default App;
