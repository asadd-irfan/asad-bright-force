import React, { Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { loginUser } from '../../actions/auth';
import { onFinishFailed } from "../../common/commonMethods";
import styles from './Auth.module.scss'
const LoginForm = () => {
	const loading = useSelector(state => state.auth.authBtnLoading);
	const dispatch = useDispatch()

	const handleSubmit = values => {
		dispatch(loginUser(values));
	};

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
				<Form.Item label='Email Address' name='email' className="company-email" rules={
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

				<Form.Item className="company-password"
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

				<Form.Item {...tailLayout} name="remember" valuePropName="checked" className="company-remember">
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit" loading={loading} className="company-login">
						Submit
        </Button>
				</Form.Item>
				<Form.Item {...tailLayout}>
					<p>
						<Link to='#'>Forgot your password</Link>
					</p>
					<p>
						Not a member yet &nbsp;
							<Link to='/company/register'>sign up</Link>
					</p>
				</Form.Item>
			</Form>
		</Fragment>
	);
}

export default LoginForm;
