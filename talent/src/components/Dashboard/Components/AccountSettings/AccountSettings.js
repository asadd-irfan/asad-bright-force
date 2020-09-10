import React, { Fragment, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Typography, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { changePassword, clearServerErrors } from './../../../../actions/auth';
import { resetNotificationSetting } from './../../../../actions/common';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import './../BlockedCompanies/blockedCompanies.scss'
const { Title } = Typography;

const ProfileForm = () => {
  const [form] = Form.useForm();
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
	const btnLoading = useSelector(state => state.auth.btnLoading);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch()

  useEffect(() => {
    form.setFieldsValue({
      currentPassword: null,
      password: null,
      passwordConfirm: null,
    });
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification,user])

  const handleSubmit = values => {
    dispatch(changePassword(values));
  };

  
  const openErrorNotification = () => {
		errorNotification(serverErrors);
		dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
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
			span: 16,
			offset: 8,
		},
  };
  
  
  return (
    <Fragment>
      <div style={{textAlign:'center', marginBottom:'20px'}}>
        <h1>User Settings</h1>
        <hr style={{ border: '1px solid black'}}/>
      </div>
      <Form 
        {...formItemLayout}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        form={form} 
      >
        <Form.Item label='Full Name :'>
          <Input maxLength={25} disabled style={{color: 'black'}} value={user.name}/>
        </Form.Item>
        <Form.Item label='Email Address :'>
          <Input maxLength={25} disabled style={{color: 'black'}} value={user.email}/>
        </Form.Item>
        <Title level={2} style={{ textAlign: 'center'}}>Change Password</Title>
        <hr style={{ border: '1px solid black', marginBottom:'20px'}}/>
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
        <Form.Item {...tailFormItemLayout} >
          <Button type='primary' htmlType='submit' loading={btnLoading}>
            Save
          </Button>
        </Form.Item>

      </Form>
      <hr style={{ border: '1px solid black'}}/>

      <div style={{textAlign:'left', marginTop:'50px', marginBottom:'30px',marginLeft:'100px'}}>
        <p >Want to delete you Account?</p>
        <Link to='/talent/settings'> Delete</Link>
      </div>

    </Fragment>
  );
}
export default ProfileForm;

