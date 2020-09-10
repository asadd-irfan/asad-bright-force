import React, { useState, useEffect } from 'react'
import { CheckCircleFilled } from '@ant-design/icons';
import { Menu, Button, Progress } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom'
import { submitProfile, talentProfileCompleted } from '../../actions/talent'
import { clearServerErrors } from '../../actions/auth'
import { resetNotificationSetting } from '../../actions/common'
import { errorNotification, successNotification } from "../../common/commonMethods";
import { HashLink } from 'react-router-hash-link';
import { setCurrentNavbarButton } from '../../actions/common';

import './SideBar.scss';

const { SubMenu } = Menu;

function CandidateSideBar(props) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const showSidebarSuccessNotification = useSelector(state => state.auth.showSidebarSuccessNotification);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrorsSidebar = useSelector(state => state.auth.serverErrorsSidebar);
  const user = useSelector(state => state.auth.user)
  const [percentageCompleteProfile, setPercentageCompleteProfile] = useState(0)
  const [openKeys, setOpenKeys] = useState(['personalInfo-tab'])
  const allTabs = ['personalInfo-tab', 'engagement-tab', 'rolePref-tab', 'CompanyPref-tab', 'workplaceFeatures-tab', 'experience-tab'];
  let totalOptions = 20;
  let oneCheckedValue = 100 / totalOptions;

  useEffect(() => {
    let totalCheckedOptions = 0;
    if (user !== null) {
      // Personal Information
      // if (user.jobSearchStatus) {
      //   totalCheckedOptions += 2;
      // }
      user.profileImage && totalCheckedOptions++;
      user.phone && user.phone !== '+' && totalCheckedOptions++;
      user.location && totalCheckedOptions++;
      (user.linkedIn || user.github || user.stackOverflow || user.personalWebsite) && totalCheckedOptions++;
      // Role Preferences
      user.preferredRoles?.mainRole?.name && totalCheckedOptions++;
      user.preferredRoles?.secondaryRole?.name && totalCheckedOptions++;
      user.preferredRoles?.managementExperience && totalCheckedOptions++;

      // Engagement Preference
      user.employmentType.length > 0 && totalCheckedOptions++;
      user.salary && (user.salary.minSalary > 0) && totalCheckedOptions++;
      user.workingHours && totalCheckedOptions++;
      user.timezone && totalCheckedOptions++;
      // Company Preference
      user.companyPreferences && (user.companyPreferences.industryPreference.length !== 0) && totalCheckedOptions++;
      user.companyPreferences && (user.companyPreferences.companySize.length !== 0) && totalCheckedOptions++;
      // Workplace Features
      user.workplaceFeatures && user.workplaceFeatures.roleFeatures.length !== 0 && totalCheckedOptions++;
      user.workplaceFeatures && user.workplaceFeatures.companyValues.length !== 0 && totalCheckedOptions++;
      user.workplaceFeatures && user.workplaceFeatures.companyFeatures.length !== 0 && totalCheckedOptions++;
      // Experience
      ((user.workExperience && user.workExperience.length !== 0) || (user.education && user.education.length !== 0)) && totalCheckedOptions++;
      user.summary && totalCheckedOptions++;
      // About
      // user.aboutMe && totalCheckedOptions++;
      // user.myAchievements && totalCheckedOptions++;
      // Languages
      user.languages && totalCheckedOptions++;
      (user.resume || user.dontHaveResume) && totalCheckedOptions++;
    }
    setPercentageCompleteProfile(oneCheckedValue * totalCheckedOptions);
  }, [user])


  useEffect(() => {
    if (percentageCompleteProfile === 100 && user && user.currentStatus === 'profile-not-completed') {
      dispatch(talentProfileCompleted())
    }
  }, [percentageCompleteProfile])
  const goToEvaluationPage = () => {
    history.push('/talent/evaluation');
    dispatch(setCurrentNavbarButton('evaluation'))
  }
  const goToViewProfile = () => {
    history.push('/talent/view-profile');
    dispatch(setCurrentNavbarButton('profile'))
  }

  useEffect(() => {
    serverErrorsSidebar && openErrorNotification();
    showSidebarSuccessNotification && openSuccessNotification();
  }, [serverErrorsSidebar, showSidebarSuccessNotification])

  const openErrorNotification = () => {
    errorNotification(serverErrorsSidebar);
    dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };
  const onMenuOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (allTabs.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  // console.log('openKeys', openKeys)

  return (
    <div className='menu-wrapper'>

      <Menu theme="dark" mode="inline"
        openKeys={openKeys}
        onOpenChange={onMenuOpenChange}
      >


        {/* <Menu.Item key="job-search-subtab">
            <div className="icons-list">
            {user && user.jobSearchStatus ?
            <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : <></>}

              <Link to="/talent/job-search" >Job Search Status </Link>
            </div>
          </Menu.Item> */}
        <SubMenu
          key="personalInfo-tab"

          title={
            <span>
              {user && user.profileImage && user.phone && user.location &&
                (user.linkedIn || user.github || user.stackOverflow || user.personalWebsite) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Personal Information
                </span>
          }
        >

          <Menu.Item key="profile-subtab">
            <div className="icons-list">
              {user && user.profileImage ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <Link to="/talent/profile" >Profile Picture</Link>
            </div>
          </Menu.Item>
          <Menu.Item key="contact-subtab">
            <div className="icons-list">
              {user && user.phone && user.phone !== '+' ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <HashLink to='/talent/profile#contactInfo'>Contact Information</HashLink>
            </div>
          </Menu.Item>
          <Menu.Item key="my-location-subtab">
            <div className="icons-list">
              {user && user.location ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <HashLink to='/talent/profile#location'>Location</HashLink>
            </div>
          </Menu.Item>
          <Menu.Item key="social-subtab">
            <div className="icons-list">
              {user && (user.linkedIn || user.github || user.stackOverflow || user.personalWebsite) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <HashLink to='/talent/profile#socialLinks'>Social Links</HashLink>
            </div>
          </Menu.Item>
        </SubMenu>
        {/* <SubMenu
          key="rolePref-tab"
          title={
            <span>
              {user && (user.preferredRoles && user.preferredRoles.selectedRoles.length > 0) 
                && (user.employmentType.length > 0) && (user.salary && (user.salary.minSalary > 0)) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Role Preferences
                </span>
          }
        > */}
        <SubMenu
          key="rolePref-tab"
          title={
            <span>
              {user?.preferredRoles?.mainRole?.name && user?.preferredRoles?.secondaryRole?.name && user?.preferredRoles?.managementExperience
                // && (user.employmentType.length > 0) && (user.salary && (user.salary.minSalary > 0))
                ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Role Preferences
                </span>
          }
        >
          <Menu.Item key="main-role-subtab">
            <div className="icons-list">
              {user?.preferredRoles?.mainRole?.name ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <Link to="/talent/roles" >Main Role</Link>
            </div>
          </Menu.Item>
          <Menu.Item key="secondary-role-subtab">
            <div className="icons-list">
              {user?.preferredRoles?.secondaryRole?.name ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <HashLink to="/talent/roles#secondary-role" >Secondary Role</HashLink>
            </div>
          </Menu.Item>
          <Menu.Item key="management-subtab">
            {((user?.preferredRoles?.managementExperience?.status === true && user?.preferredRoles?.managementExperience?.yearsOfExperience) || user?.preferredRoles?.managementExperience?.status === false) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to="/talent/roles#management" >Management Experience</HashLink>
          </Menu.Item>

        </SubMenu>

        <SubMenu
          key="engagement-tab"
          title={
            <span>
              {user && (user.employmentType.length > 0) && (user.salary && (user.salary.minSalary > 0)) && user.workingHours
                ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Engagement Preferences
                </span>
          }
        >

          <Menu.Item key="engagement-subtab">
            <div className="icons-list">
              {user && user.employmentType.length > 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <Link to="/talent/profile/engagement-preferences" >Employment Type</Link>
            </div>
          </Menu.Item>
          <Menu.Item key="work-hour-subtab">
            {user && user.workingHours ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/profile/engagement-preferences#work-hour'>Work Hours </HashLink>
          </Menu.Item>
          <Menu.Item key="salary-subtab">
            {user && user.salary && (user.salary.minSalary > 0) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/profile/engagement-preferences#salary'>Salary Expectations</HashLink>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="CompanyPref-tab"
          title={
            <span>
              {user
                && user.companyPreferences
                && (user.companyPreferences.industryPreference.length !== 0
                  && user.companyPreferences.companySize.length !== 0) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Company Preferences
                </span>
          }
        >

          <Menu.Item key="industries-subtab">
            {user && user.companyPreferences && (user.companyPreferences.industryPreference.length !== 0) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to='/talent/profile/company-preferences#preferred-industry'>
              Industries
                </Link>
          </Menu.Item>
          <Menu.Item key="company-subtab">
            {user && user.companyPreferences &&
              (user.companyPreferences.companySize.length !== 0) ?
              <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/profile/company-preferences#company-size'>
              Company Size
                </HashLink>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="workplaceFeatures-tab"
          title={
            <span>
              {user && user.workplaceFeatures && user.workplaceFeatures.roleFeatures.length !== 0 && user.workplaceFeatures.companyFeatures.length !== 0 && user.workplaceFeatures.companyValues.length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Workplace Features
                </span>
          }
        >
          <Menu.Item key="role-features-subtab"><Link to="/talent/workplace" >
            {user && user.workplaceFeatures && user.workplaceFeatures.roleFeatures.length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            Role Features
          </Link></Menu.Item>
          <Menu.Item key="company-values-subtab">
            {user && user.workplaceFeatures && user.workplaceFeatures.companyValues.length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/workplace#company-values'>
              Company Values
                </HashLink>
          </Menu.Item>
          <Menu.Item key="company-features-subtab">
            {user && user.workplaceFeatures && user.workplaceFeatures.companyFeatures.length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/workplace#company-features'>
              Company Features
                </HashLink>

          </Menu.Item>
        </SubMenu>
        {/* <Menu.Item key="languages-subtab">
          <div className="icons-list">
            {user && user.languages.length > 0 ?
              <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : <></>}

            <Link to="/talent/languages" >Languages </Link>
          </div>
        </Menu.Item> */}
        <SubMenu
          key="experience-tab"
          title={
            <span>
              {user && user.summary && (user.workExperience && user.workExperience.length !== 0)
                && (user.education && (user.education.length !== 0 || user.selfTaught))
                && (user.resume || user.dontHaveResume) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : <></>}
              Experience
                </span>
          }
        >
          <Menu.Item key="summary-subtab">
            {user && user.summary ?
              <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to='/talent/experience' >
              Summary
     </Link>
          </Menu.Item>
          {/* <Menu.Item key="work-experience-subtab">
            {user && user.workExperience && user.workExperience
              .length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to="/talent/experience" >Work Experience</Link></Menu.Item> */}
          <Menu.Item key="education-subtab">
            {user && ((user.education && user.education
              .length !== 0) || (user.workExperience && user.workExperience
                .length !== 0)) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/experience#education'>
              Employment & Education
                </HashLink>
          </Menu.Item>
          <Menu.Item key="languages-subtab">
            <div className="icons-list">
              {user && user.languages.length > 0 ?
                <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : <></>}

              <HashLink to="/talent/experience#languages" >Languages </HashLink>
            </div>
          </Menu.Item>
          <Menu.Item key="resume-subtab">
            {user && (user.resume || user.dontHaveResume) ?
              <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <HashLink to='/talent/experience#resume'>Resume</HashLink>
          </Menu.Item>
        </SubMenu>
        {/* <SubMenu
          key="about-tab"
          title={
            <span onClick={() => history.push("/talent/about")}>
              {user && user.aboutMe && user.myAchievements ?
                <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              About
                </span>
          }

        >
          <Menu.Item key="about-me-subtab">
            {user && user.aboutMe ?
              <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to='/talent/about' >
              About Me
     </Link>
          </Menu.Item>
          <Menu.Item key="achievements-subtab">
            {user && user.myAchievements ?
              <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <a href='/talent/about#my-achievements'>
              My Achievements
                </a>
          </Menu.Item>
        </SubMenu> */}
        <Menu.Item key="blocked-companies-subtab">
          <div className="icons-list">
            {user && user.blockedCompanies && (user.blockedCompanies.length > 0) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to="/talent/blocked-companies" >Blocked Companies</Link>
          </div>
        </Menu.Item>


      </Menu>
      <div style={{ textAlign: 'center', marginTop: '20px', padding: '5px', color: 'white' }}>
        Your Profile is {Math.trunc(percentageCompleteProfile)}% Complete
            <Progress percent={percentageCompleteProfile} showInfo={false} />
      </div>
      {/* {user && user.currentStatus === 'profile-not-completed' && <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" size='large' disabled={percentageCompleteProfile !== 100} loading={btnLoading} onClick={submitProfileData}>Submit Profile</Button>
      </div>} */}
      {location.pathname.includes('view-profile') && percentageCompleteProfile === 100 && user && user.profileApproved.status == false && <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" loading={btnLoading} onClick={goToEvaluationPage}>Start The Evaluation Process</Button>
      </div>}
      {!location.pathname.includes('view-profile') && <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" disabled={percentageCompleteProfile !== 100} loading={btnLoading} onClick={goToViewProfile}>View Profile</Button>
      </div>}
    </div>
  );
}

export default CandidateSideBar
