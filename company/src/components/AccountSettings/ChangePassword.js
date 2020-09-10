import React, { Fragment, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Typography, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { changePassword } from '../../actions/auth';
import {  onFinishFailed } from "../../common/commonMethods";
import '../../App.scss'
const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch()
  
  useEffect(() => {
    
    form.setFieldsValue({
      currentPassword: null,
      password: null,
      passwordConfirm: null,
    });
  }, [user])


  const handleSubmitChangePassword = values => {
    dispatch(changePassword(values));
  };

  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 14,
        offset: 8,
      },
      md: {
        span: 4,
        offset: 17,
      },
      lg: {
        span: 4,
        offset: 17,
      }
    }
  };


  return (
    <Fragment>
      <Form
        {...formItemLayout}
        onFinish={handleSubmitChangePassword}
        onFinishFailed={onFinishFailed}
        form={form}
      >

        <Title level={2} style={{ textAlign: 'center' }}>Change Password</Title>
        <hr style={{ border: '1px solid black', marginBottom: '20px' }} />

        <Form.Item label='Current Password :' hasFeedback name='currentPassword' rules={
          [
            {
              required: true,
              message: 'Please input your password!'
            }
          ]
        }>
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="password"
          label="New Password :"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 6,
              message: 'Password should be more than 5 characters'
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          label="New Password Confirmation :"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item  {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' loading={btnLoading}>
            Save
          </Button>
        </Form.Item>

      </Form>
    </Fragment>
  );
}
export default ChangePassword;

