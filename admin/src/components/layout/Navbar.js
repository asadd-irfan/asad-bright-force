import React, { useState } from 'react';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Row, Col, Drawer, Button, Avatar } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import styles from './Navbar.module.scss';

import { logoutUser } from '../../actions/auth';
import { useWindowSize } from '../../common/commonMethods';

function NavbarItems(mode) {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutUser());
    return <Redirect to='/admin/talents' />
  }


  return <>
    <Menu mode={mode.mode} className={`${styles.anchorStyle}`} style={{ lineHeight: '84px' }}>
      <Menu.Item key='talents'>
        <Link to='/admin/talents'>Talents</Link>
      </Menu.Item>
      <Menu.Item key='companies'>
        <Link to='/admin/companies'>Companies</Link>
      </Menu.Item>
      <Menu.Item key='positions'>
        <Link to='/admin/positions'>Positions</Link>
      </Menu.Item>
      <Menu.Item key='staff'>
        <Link to='/admin/staff/account-managers'>Staff</Link>
      </Menu.Item>
      {/* <Menu.Item key='evaluations'>
        <Link to='/admin/evaluations'>Evaluations</Link>
      </Menu.Item>
      <Menu.Item key='invites'>
        <Link to='/admin/invites'>Invites</Link>
      </Menu.Item>
      <Menu.Item key='tester'>
        <Link to='/admin/tester'>Testers</Link>
      </Menu.Item>
      <Menu.Item key='talentManagers'>
        <Link to='/admin/talent-managers'>Talent Managers</Link>
      </Menu.Item> */}
     
      {isAuthenticated && <Menu.SubMenu style={{float: 'right'}} title={
        <span className={`${styles.submenu_svg}`}>
          <Avatar size={60} src={user && `/${user.profileImage}`} icon={<UserOutlined />} className={`${styles.avatarStyle}`} style={{ backgroundColor: 'black' }} />
        </span>
      }>
        <Menu.Item key='logout' onClick={logout}>Logout</Menu.Item>
      </Menu.SubMenu>
      }
      <Menu.SubMenu title='Settings' style={{float: 'right'}}>
      <Menu.Item key='setting' >
        <Link to='/admin/config-settings'>Config Settings</Link>
      </Menu.Item>
      <Menu.Item key='coefficient-setting' >
        <Link to='/admin/coefficient-settings'>Coefficient Settings</Link>
      </Menu.Item>

      </Menu.SubMenu>

    </Menu>
  </>;
}

export default function Navbar() {
  const [width] = useWindowSize();
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  
  return (
    <Row>
      <Col xs={21} sm={21} md={0} lg={0}>
        <div className={`${styles.logo_container}`}>
          <Link to='/'>
            <div className={`${styles.logo}`} />
          </Link>
        </div>

      </Col>
      <Col xs={3} sm={3} md={24} lg={24}>
        {width <= 988 ? (
          <>
            <Button
              type='primary'
              onClick={() => {
                setDrawerVisible(true);
              }}
            >
              <MenuOutlined />
            </Button>
            <Drawer
              title='Menu'
              placement='right'
              closable={true}
              onClose={() => setDrawerVisible(false)}
              visible={isDrawerVisible}
            >
              <NavbarItems mode='inline'></NavbarItems>
            </Drawer>
          </>
        ) : (
            <NavbarItems mode='horizontal' />
          )}
      </Col>
    </Row>
  );
}

