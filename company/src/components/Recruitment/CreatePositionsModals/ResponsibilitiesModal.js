import React, { useState, } from 'react';
import { Form, Row, Col, Radio, Input } from 'antd';
import { useSelector, } from "react-redux";
const { TextArea } = Input

const ResponsibilitiesModal = () => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const employmentOptions = appConfigs && appConfigs['employment-type']

    return (
        <div className="my-5">

            <h2 className="my-5">What are your position main responsibilities?</h2>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <h5>Main Responsibilities:</h5>
                    <Form.Item name='mainResponsibilities' >
                        <TextArea rows={7} />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
}

export default ResponsibilitiesModal;
