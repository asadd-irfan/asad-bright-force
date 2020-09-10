import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import styles from './Topbar.module.scss';

class Topbar extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={4}>
                        <Link to='/'>
                            <div className={`${styles.logo} ml-1`} />
                        </Link>
                    </Col>
                    <Col sm={8}>
                        <div className={styles.buttonGroup}>
                            <Button type='primary'>Hire BrightForce</Button>
                            <Button type='primary'>
                                Talent Join <br /> The Community
                            </Button>
                            {/* @TODO: replace Link with <a> */}
                            <Link to='/'>Login</Link>
                            <span>/</span>
                            <Link to='/' className='mr-3'>
                                Register
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Topbar;
