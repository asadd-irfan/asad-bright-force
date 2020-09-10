import React from 'react';
import {  Row, Form, Col, Card } from 'antd';
import '../../companies.scss'

function ContactDetails({ selectedCompanyRequest }) {
  const [form] = Form.useForm();
  
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <div style={{ marginRight: '10px' }}>
      <Card bordered={false} style={{ border: '2px solid', borderRadius: '5px'}}>
        <Form
            {...layout}
            labelAlign={'left'}
            form={form}
          >
            <div style={{ marginBottom: '10px' }}>
              <h4>Contact Details</h4>
            </div>
            <hr style={{ border: '1px solid', marginBottom: '10px' }} />
            
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item label="Full Name:">
                {selectedCompanyRequest && selectedCompanyRequest.requesterName}
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={11} lg={11}>
                <Form.Item label="Title:">
                {selectedCompanyRequest && selectedCompanyRequest.title && selectedCompanyRequest.title}
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Email Address:">
                  {selectedCompanyRequest && selectedCompanyRequest.email}
                </Form.Item>
              </Col>
            </Row>
            
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Phone number:">
                  {selectedCompanyRequest && selectedCompanyRequest.phone}
                </Form.Item>
              </Col>
            </Row>
            
          </Form>
      </Card>
    </div>
  )
}

export default ContactDetails;
