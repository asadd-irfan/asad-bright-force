import React, { useState, useEffect } from 'react';
import { Form, Radio, Row, Col } from 'antd';
import { useSelector } from 'react-redux'



const RoleModal = ({ form }) => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const rolesOptions = appConfigs && appConfigs['roles']

    return (
        <div className="my-5">


            <div style={{ backgroundColor: 'white', borderRadius: '7px', padding: '20px' }}>
                <h3>What are you looking for?</h3>


                <Row style={{ marginTop: '20px' }}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <div>
                            <Form.Item name='positionType'>
                                <Radio.Group style={{ width: '100%' }}>
                                    <Row>
                                        {rolesOptions ? rolesOptions.map((radio, index) => {
                                            return (
                                                <Col xs={24} sm={24} md={12} lg={12} key={index}>
                                                    <Radio value={radio._id} key={radio._id} >
                                                        {radio.name}
                                                    </Radio>
                                                </Col>
                                            );
                                        }) : <div>Loading...</div>}
                                    </Row>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>



            </div>
        </div>
    )
}

export default RoleModal;
