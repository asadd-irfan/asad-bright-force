import React from 'react';
import {  Row, Form, Col, Card } from 'antd';
import '../../companies.scss'

function CompanyDetails({ selectedCompanyRequest }) {
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
              <h4>Company Details</h4>
            </div>
            <hr style={{ border: '1px solid', marginBottom: '10px' }} />
            
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Company Name:">
                  {selectedCompanyRequest && selectedCompanyRequest.companyName}
                </Form.Item>
              </Col>
            </Row>
            
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Company Website:">
                  {selectedCompanyRequest && selectedCompanyRequest.companyWebsite}
                </Form.Item>
              </Col>
            </Row>
            
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={22} lg={22}>
                <Form.Item label="Employees:">
                  {selectedCompanyRequest && selectedCompanyRequest.employees && selectedCompanyRequest.employees.name}
                </Form.Item>
              </Col>
            </Row>
           
          </Form>
      </Card>
    </div>
  )
}

export default CompanyDetails;
