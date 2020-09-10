import React, { useEffect, Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { loginUser, clearServerErrors } from '../../actions/auth';
import { errorNotification, onFinishFailed } from "../../common/commonMethods";
import styles from './Auth.module.scss'
const LoginForm = () => {
	const serverErrors = useSelector(state => state.auth.serverErrors);
	const loading = useSelector(state => state.auth.btnLoading);
	const dispatch = useDispatch()

	useEffect(() => {
		serverErrors && openErrorNotification();
	}, [serverErrors, loading]);

	const handleSubmit = values => {
		dispatch(loginUser(values));
	};

	const openErrorNotification = () => {
		errorNotification(serverErrors);
		dispatch(clearServerErrors());
  }

	const layout = {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 10,
		},
	};
	const tailLayout = {
		wrapperCol: {
			span: 16,
			offset: 8,
		},
	};

	return (
		<Fragment>
			<Form
				{...layout}
				className={styles.form}
				initialValues={{
					remember: false,
				}}
				onFinish={handleSubmit}
				onFinishFailed={onFinishFailed}
			>
				<Form.Item label='Email Address' name='email'  className="admin-email" rules={
					[
						{
							type: 'email',
							message: 'The input is not valid E-mail!'
						},
						{
							required: true,
							message: 'Please input your E-mail!'
						}
					]
				}>
					<Input />
				</Form.Item>

				<Form.Item className="admin-password"
					label="Password"
					name="password"
					hasFeedback
					rules={
						[
							{
								required: true,
								message: 'Please input your password!'
							},
							{
								min: 6,
								message: 'Password should be more than 5 characters'
							},
						]
					}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailLayout} name="remember" valuePropName="checked" className="admin-remember">
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" loading={loading} className="admin-login">
						Submit
        </Button>
				</Form.Item>
				<Form.Item {...tailLayout}>
					<p>
						<Link to='#'>Forgot your password</Link>
					</p>
					{/* <p>
						Not a member yet &nbsp;
							<Link to='/admin/register'>sign up</Link>
					</p> */}
				</Form.Item>
			</Form>
		</Fragment>
	);
}

export default LoginForm;
