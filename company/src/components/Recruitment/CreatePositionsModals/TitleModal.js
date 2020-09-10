import React, { useState, } from 'react';
import { Form, Row, Col, Input } from 'antd';


const TitleModal = () => {

    return (
        <div className="my-5">
            <div className="my-5">
                <h2>What is your position title?</h2>
            </div>

            <Row style={{ marginTop: '20px' }} className="my-3">
                <Col xs={24} sm={24} md={12} lg={12}>
                    <h5>Title</h5>
                    <Form.Item name='title'>
                        <Input placeholder="Ex. Full Stack Developer" />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
}

export default TitleModal;
