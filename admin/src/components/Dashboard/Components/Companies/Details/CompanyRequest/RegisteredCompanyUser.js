import React from 'react';
import {  Row, Form, Col, Card, Button, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import '../../companies.scss'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changeCompanyTabPanelKey } from '../../../../../../actions/company'

const { Paragraph } = Typography;

function RegisteredCompanyUser({ selectedCompanyRequest }) {

  const history = useHistory();
  const dispatch = useDispatch();

  const gotoCompanyUsersPage = () => {
    dispatch(changeCompanyTabPanelKey('users'))
    history.push(`/admin/companies/company/${selectedCompanyRequest && selectedCompanyRequest.assignedCompany}`);
  }

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
           
            <Row style={{ marginBottom: '10px' }}>
              <Col xs={22} sm={22} md={22} lg={22}>
                  <h4>Registered Company User</h4>
              </Col>
            </Row>
            
            <hr style={{ border: '1px solid', marginBottom: '10px' }} />
            
            <div style={{ borderLeft: '2px solid', height: '80%', paddingLeft:'15px', marginBottom:'15px'}}>

              <Row>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <UserOutlined style={{fontSize: '26px'}} />
                </Col>
                <Col xs={21} sm={21} md={21} lg={21}>
                  <Paragraph>{selectedCompanyRequest && selectedCompanyRequest.requesterName}, {selectedCompanyRequest && selectedCompanyRequest.title.name}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <MailOutlined style={{fontSize: '26px'}} />
                </Col>
                <Col xs={21} sm={21} md={21} lg={21}>
                <Paragraph>{selectedCompanyRequest && selectedCompanyRequest.email}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={3} sm={3} md={3} lg={3}>
                <PhoneOutlined style={{fontSize: '26px'}} />
                </Col>
                <Col xs={21} sm={21} md={21} lg={21}>
                <Paragraph>{selectedCompanyRequest && selectedCompanyRequest.phone}</Paragraph>
                </Col>
              </Row>       
              </div>
            <div className='text-center' style={{ marginTop: '40px'}}> 
              <Button type='primary' onClick={gotoCompanyUsersPage}>Go to Company Users Page</Button>
            </div>
            
          </Form>
      </Card>
    </div>
  )
}

export default RegisteredCompanyUser;
