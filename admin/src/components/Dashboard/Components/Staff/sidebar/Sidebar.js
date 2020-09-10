import React, { useState, useEffect } from 'react'
import { CheckCircleFilled } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom'
// import { submitProfile, talentProfileCompleted } from '../../actions/talent'
// import { clearServerErrors } from '../../../../actions/auth'
import { resetNotificationSetting }  from '../../../../../actions/common';
import { errorNotification, successNotification } from "../../../../../common/commonMethods";
import { clearServerErrors } from '../../../../../actions/auth';

import './sidebar.scss';

const { SubMenu } = Menu;

function Sidebar(props) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const accountManager = useSelector(state => state.talentManager.accountManager);

  const showSidebarSuccessNotification = useSelector(state => state.auth.showSidebarSuccessNotification);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrorsSidebar = useSelector(state => state.auth.serverErrorsSidebar);
  const user = useSelector(state => state.auth.user)
  const [percentageCompleteProfile, setPercentageCompleteProfile] = useState(0)
  let totalOptions = 20;
  let oneCheckedValue = 100 / totalOptions;
  
 

  const submitProfileData = () => {
    // dispatch(submitProfile())
  }

  useEffect(() => {
    if (percentageCompleteProfile === 100 && user && user.currentStatus === 'profile-not-completed') {
      // dispatch(talentProfileCompleted())
    } 
  }, [percentageCompleteProfile])

  const goToEditPage = (id) => {
    history.push('/admin/staff/account-manager/'+ id);
  }
  const goToViewProfile = () => {
    history.push('/talent/view-profile');
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
  return (
    <div className='menu-wrapper'>

      <Menu theme="dark" mode="inline" >
     
    
        
        
        <SubMenu
          key="personalInfo-tab"

          title={
            <span>
              {/* {user && user.profileImage && user.phone && user.location &&
                (user.linkedIn || user.github || user.stackOverflow || user.personalWebsite) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''} */}
              Personal Information
                </span>
          }
        >

          <Menu.Item key="profile-subtab">
            <div className="icons-list">
              {/* {user && user.profileImage ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''} */}
              <Link to="/talent/profile" >Profile Picture</Link>
            </div>
          </Menu.Item>
          <Menu.Item key="contact-subtab">
            <div className="icons-list">
              {/* {user && user.phone && user.phone !== '+' ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''} */}
              <a href='/talent/profile#contactInfo'>Contact Information</a>
            </div>
          </Menu.Item>
          <Menu.Item key="my-location-subtab">
            <div className="icons-list">
              {/* {user && user.location ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''} */}
              <a href='/talent/profile#location'>Location</a>
            </div>
          </Menu.Item>
          <Menu.Item key="social-subtab">
            <div className="icons-list">
              {/* {user && (user.linkedIn || user.github || user.stackOverflow || user.personalWebsite) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''} */}
              <a href='/talent/profile#socialLinks'>Social Links</a>
            </div>
          </Menu.Item>
        </SubMenu>
        
        

      </Menu>
  
  
      {location.pathname.includes('/admin/staff/account-managers/') &&  <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" loading={btnLoading} onClick={(() => goToEditPage(accountManager?._id))}>Edit Account Manager Profile</Button>
      </div>}
     
    </div>
  );
}

export default Sidebar
