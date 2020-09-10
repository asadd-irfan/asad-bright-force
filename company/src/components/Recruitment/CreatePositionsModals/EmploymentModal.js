import React, { useState, } from 'react';
import { Form, Row, Col, Radio } from 'antd';
import { useSelector, } from "react-redux";


const EmploymentModal = () => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const employmentOptions = appConfigs && appConfigs['employment-type']

    return (
        <div className="my-5">
            <div className="my-5">
                <h2>What employment type are you looking for?</h2>
            </div>


            <div>
                <h5>Employment Type</h5>

                <Form.Item name='employmentType' >
                    <Radio.Group style={{ width: '100%' }}>
                        <Row>
                            {employmentOptions ? employmentOptions.map((radio, index) => {
                                return (
                                    <Col xs={24} sm={24} md={24} lg={24} key={index}>
                                        <Radio value={radio._id} key={radio._id} >
                                            {radio.name}
                                        </Radio>
                                    </Col>
                                );
                            }) : <div>Loading...</div>}
                        </Row>
                    </Radio.Group>
                </Form.Item>
            </div></div>
    )
}

export default EmploymentModal;
