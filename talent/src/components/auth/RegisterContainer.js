import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux'
import styles from './Auth.module.scss'

import Register from './Register';

const RegisterContainer = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);
    if (isAuthenticated && user && user.role ) return <Redirect to='/talent/profile' />;

    return (
        <Fragment>
            <Row className={styles.middle}>
                <Col xs={0} sm={0} md={2} lg={6}/>
                <Col xs={24} sm={24} md={20} lg={12}>
                    <Register />
                </Col>
                <Col xs={0} sm={0} md={2} lg={6}/>
            </Row>
        </Fragment>
    );
};

export default RegisterContainer;
