import React, { Fragment } from 'react';
import { Row, Col, Steps } from 'antd';
import styles from './Auth.module.scss'
import { Link } from "react-router-dom";

const { Step } = Steps;

const RegisterContainer = () => {


    return (
        <Fragment>
            <Row className={styles.middle}>
                <Col xs={0} sm={0} md={4} lg={4} />
                <Col xs={24} sm={24} md={16} lg={16}>
                    <div className='card-container my-5 py-5' >
                        <Row justify='center'>
                            <div className={`${styles.logo_container}`} >
                                {/* <Link to="/company/login"> */}
                                <div className={`${styles.logo}`} />
                                {/* </Link> */}
                            </div>
                        </Row>
                        <Row justify='center' className="m-3 p-3">
                            <h3>Thank you for signing up to BrightForce!</h3>
                        </Row>
                        <Row justify='center' className="m-2 p-2">
                            <h5>We are reviewing your request and will be in touch shortly</h5>
                        </Row>
                        <Row justify='center' className="mt-5 p-2">
                            <h5>The next steps:</h5>
                        </Row>
                        <Row justify='center' className="mt-5 p-2">
                            <Steps >
                                <Step title="Step 1" description="We call you to get to know your Hiring and global employment and payroll needs." />
                                <Step className="ant-steps-item-process ant-steps-item-active" title="Step 2" description="you get access to the platform including vetted talents and full employment and global payroll service." />
                                <Step className="ant-steps-item-process ant-steps-item-active" title="Step 3" description="Hire and manage global workforce!" />
                            </Steps>
                        </Row>


                    </div>
                </Col>
            </Row>
        </Fragment>
    );
};

export default RegisterContainer;
