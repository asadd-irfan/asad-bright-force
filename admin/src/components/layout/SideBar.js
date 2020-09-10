import React from 'react'
import { CheckCircleFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './SideBar.scss';

const { SubMenu } = Menu;

function SideBar(props) {
  const history = useHistory();
  const user = useSelector(state => state.auth.user)
  return (
    <div className='menu-wrapper'>

      <Menu theme="dark" mode="inline" >
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
              <a href='/talent/profile#contactInfo'>Contact Information</a>
            </div>
          </Menu.Item>
          <Menu.Item key="my-location-subtab">
            <div className="icons-list">
              {user && user.location ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <a href='/talent/profile#location'>Location</a>
            </div>
          </Menu.Item>
          <Menu.Item key="social-subtab">
            <div className="icons-list">
              {user && (user.linkedIn || user.github || user.stackOverflow || user.personalWebsite) ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              <a href='/talent/profile#socialLinks'>Social Links</a>
            </div>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="preferred-role-subtab">
            <div className="icons-list">
            {user && user.preferredRoles && user.preferredRoles.selectedRoles.length > 0  ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to="/talent/roles" >Preferred Role</Link>
            </div>
          </Menu.Item>
        
        <SubMenu
          key="experience-tab"
          title={
            <span>
              {user && user.professionalExperience && user.professionalExperience.length !== 0 && user.technicalExperience &&
                user.technicalExperience
                  .length !== 0 && user.workExperience && user.workExperience
                    .length !== 0 && user.education && user.education
                      .length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
              Experience
                </span>
          }
        >

          <Menu.Item key="professional-experience-subtab">
          {user && user.technicalExperience &&
              user.technicalExperience
                .length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to='/talent/experience'>Technical Experience</Link></Menu.Item>
          {/* <Menu.Item key="technical-experience-subtab">
            {user && user.technicalExperience &&
              user.technicalExperience
                .length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <a href='/talent/experience#tech-experience'>
              Technical Experience
                </a>
          </Menu.Item> */}
          <Menu.Item key="work-experience-subtab">
            {user && user.workExperience && user.workExperience
              .length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <Link to="/talent/workexperience" >Work Experience</Link></Menu.Item>
          <Menu.Item key="education-subtab">
            {user && user.education && user.education
              .length !== 0 ? <CheckCircleFilled style={{ color: 'green', fontSize: '18px' }} /> : ''}
            <a href='/talent/workexperience#education'>
              Education
                </a>
          </Menu.Item>
        </SubMenu>
        <SubMenu
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
        </SubMenu>
      </Menu>
    </div>
  );
}

export default SideBar
