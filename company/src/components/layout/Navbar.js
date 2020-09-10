import React, { useState } from 'react';
import { Menu, Row, Col, Drawer, Button, Avatar } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { BellFilled, MenuOutlined, UserOutlined } from '@ant-design/icons';


import styles from './Navbar.module.scss';

import { logoutUser } from '../../actions/auth';
import { useWindowSize } from '../../common/commonMethods';

function NavbarItems(mode) {
    const user = useSelector(state => state.auth.user)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(logoutUser());
        return <Redirect to='/company/login' />
    }
    return (
        <Menu mode={mode.mode} className={`${styles.anchorStyle}`} style={{ float: 'right', lineHeight: '84px' }}>
            <Menu.Item key='home'>
                <Link to='/company/home'>Home</Link>
            </Menu.Item>
            <Menu.Item key='hire'>
                <Link to='/company/hire/profile'>Recruit</Link>
            </Menu.Item>
            <Menu.Item key='manage'>
                <Link to='/company/manage'>Manage</Link>
            </Menu.Item>
            {/* <Menu.Item key='recruitment'>
                <Link to='/company/hire/recruitment'>Recruitment</Link>
            </Menu.Item>
            <Menu.Item key='company'>
                <Link to='/company/hire/profile'>Company</Link>
            </Menu.Item>
            <Menu.Item key='calender'>
                <Link to='/company/hire/calender'>Calender</Link>
            </Menu.Item> */}
            <Menu.SubMenu title='Settings'>
                <Menu.Item key='manage-user'> <Link to='/company/settings/manage-users'>Manage Users</Link> </Menu.Item>
                <Menu.Item key='time-zon'> <Link to='/company/settings/timezone-currency'>Timezone & Currency</Link> </Menu.Item>
                <Menu.Item key='billing'> <Link to='/company/settings/billing'>Billing Info</Link> </Menu.Item>
            </Menu.SubMenu>
            {
                isAuthenticated &&
                <Menu.SubMenu title={
                    <span className={`${styles.submenu_svg}`}>
                        <Avatar size={60}
                            src={user && user?.profileImage?.includes("http")
                                ? user?.profileImage
                                : `/${user?.profileImage}`
                            }
                            icon={<UserOutlined />} style={{ backgroundColor: 'black' }} />
                    </span>
                }>
                    <Menu.Item key='name'><b style={{ fontSize: 18 }}> {user?.fullName}</b> </Menu.Item>
                    <Menu.Item key='setting'> <Link to='/company/user/setting'>Account Settings</Link> </Menu.Item>
                    <Menu.Item key='avatar'> <Link to='/company/user/avatar'>Edit Avatar</Link> </Menu.Item>
                    <Menu.Item key='logout' onClick={logout}>Logout</Menu.Item>
                </Menu.SubMenu>
            }

            {/* </Menu.Item> */}
            <Menu.Item key='notification'>
                <Link to='/company/notifications'><BellFilled style={{ fontSize: '22px' }} /></Link>
            </Menu.Item>

        </Menu>
    );
}

export default function Navbar() {
    const [width, height] = useWindowSize();
    const [isDrawerVisible, setDrawerVisible] = useState(false);

    return (
        <Row>
            <Col xs={20} sm={20} md={0} lg={0}>
                <div className={`${styles.logo_container}`}>
                    <Link to='/'>
                        <div className={`${styles.logo}`} />
                    </Link>
                </div>
            </Col>
            <Col xs={4} sm={4} md={24} lg={24}>
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
