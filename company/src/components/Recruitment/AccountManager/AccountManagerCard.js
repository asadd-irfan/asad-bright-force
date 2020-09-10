import React from 'react'
import { Col, Row, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const { Paragraph } = Typography;

function AccountManagerCard() {
  const companyDetails = useSelector(state => state.company.companyDetails);
  return (
    companyDetails?.accountManager ? <div style={{ border: '2px solid black', borderRadius: '5px', margin: '20px 0px' }}>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center', borderBottom: '2px solid black' }}>
          <h6 style={{ margin: '18px 0px' }}>Your Assigned Account Manager</h6>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center', padding: '15px' }}>
          <Paragraph>You may contact your account manager with any problems and questions you have</Paragraph>
        </Col>
      </Row>
      <div style={{ paddingLeft: '15px', marginBottom: '25px' }}>

        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <UserOutlined style={{ fontSize: '26px' }} />
          </Col>
          <Col xs={20} sm={20} md={20} lg={20}>
            <Paragraph>{companyDetails?.accountManager?.name}</Paragraph>
          </Col>
        </Row>
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <MailOutlined style={{ fontSize: '26px' }} />
          </Col>
          <Col xs={20} sm={20} md={20} lg={20}>
            <Paragraph>{companyDetails?.accountManager?.email}</Paragraph>
          </Col>
        </Row>
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <PhoneOutlined style={{ fontSize: '26px' }} />
          </Col>
          <Col xs={20} sm={20} md={20} lg={20}>
            <Paragraph>{companyDetails?.accountManager?.phone}</Paragraph>
          </Col>
        </Row>
      </div>
    </div>
      : <div></div>
  )
}


export default AccountManagerCard
