import React, { useState } from 'react';
import {  Row, Form, Col, Card, Input, Button, Typography, notification } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import '../../companies.scss'
import { sendMailToUser, changeRequesterEmail } from '../../../../../../actions/company'
const { Paragraph } = Typography;

function SendRegistrationEmail({ selectedCompanyRequest }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.company.btnLoading);
  const authBtnLoading = useSelector(state => state.auth.btnLoading);
  const mailToken = useSelector(state => state.company.mailToken);
  const [emailValue, setEmailValue] = useState(selectedCompanyRequest && selectedCompanyRequest.email)

  const sendMail = () => {
    if (emailValue !== null && emailValue !== '' && emailValue !== undefined) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(emailValue) === false) {
        notification.error({
          message: 'Error',
          description: 'Enter Correct Email Format!!!',
        });
      }
      else {
        let id = selectedCompanyRequest && selectedCompanyRequest._id
        dispatch(sendMailToUser(id));
      }
    }
    else {
      notification.error({
        message: 'Error',
        description: 'Add Email First!!!',
      });
    }
  }

  const handleChangeEmail = () => {
    if (emailValue !== null && emailValue !== '' && emailValue !== undefined) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(emailValue) === false) {
        notification.error({
          message: 'Error',
          description: 'Enter Correct Email Format!!!',
        });
      }
      else {
        let id = selectedCompanyRequest && selectedCompanyRequest._id
        let obj = {
          email: emailValue
        }
        dispatch(changeRequesterEmail(obj,id));
      }
    }
    else {
      notification.error({
        message: 'Error',
        description: 'Add Email First!!!',
      });
    }
  }
  
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
              <Col xs={2} sm={2} md={2} lg={2}
                  style={{
                      alignSelf: 'center',
                  }}
              >
                  <div className='circle'>{2}</div>
              </Col>
              <Col xs={22} sm={22} md={22} lg={22}>
                  <h4>Send Registration Email</h4>
              </Col>
                
            </Row>
            
            <hr style={{ border: '1px solid', marginBottom: '10px' }} />
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16}>
              <Paragraph>Please make Sure You Speak with the contact before you send the registration email!</Paragraph>
            
              </Col>
              
            </Row>
            <Row>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={14} lg={14}>
                <Form.Item label="Email Address:">
                  <Input onChange={(e) => setEmailValue(e.target.value)} value={emailValue} />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={2} lg={2}>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Button type='default' onClick={handleChangeEmail} loading={authBtnLoading}>Change</Button>
              </Col>
            </Row>

            <div className='text-center'> 
                <Button type='primary' disabled={selectedCompanyRequest.status === 'pending'} onClick={sendMail} loading={btnLoading}>Send Email</Button>
            </div>
            <div className='text-center' style={{ margin: '20px 20px', wordWrap: 'break-word'}}> 
                {mailToken && <>
                  <strong>URL: </strong> {mailToken && mailToken}
                </>}
            </div>
          </Form>
      </Card>
    </div>
  )
}

export default SendRegistrationEmail;
