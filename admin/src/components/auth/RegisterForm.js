import React, { Fragment, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox, Button, notification, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { registerUser, clearServerErrors } from '../../actions/auth';
import { errorNotification } from "../../common/commonMethods";

const RegisterForm = () => {
	const [form] = Form.useForm();
	const serverErrors = useSelector(state => state.auth.serverErrors);
	const loading = useSelector(state => state.auth.btnLoading);
	const dispatch = useDispatch()

	useEffect(() => {
		serverErrors && openErrorNotification();
	}, [serverErrors, loading])

	const handleSubmit = values => {
		dispatch(registerUser(values));
	};

	const openErrorNotification = () => {
		errorNotification(serverErrors);
		dispatch(clearServerErrors());
	}

	const onFinishFailed = errorInfo => {
		notification.open({
			message: 'Errors',
			description: errorInfo.errorFields[0].errors,
		});
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
				span: 14,
				offset: 8,
			},
			lg: {
				span: 14,
				offset: 8,
			}
		}
	};

	return (
		<Fragment >
			<Form
				{...formItemLayout}
				onFinish={handleSubmit}
				onFinishFailed={onFinishFailed}
				form={form}
				style={{ margin: '5px 5px' }}
			>
				<Form.Item label='Full Name' name='name' rules={
					[
						{
							required: true,
							message: 'Please input your name'
						}
					]
				}>
					<Input maxLength={25} />
				</Form.Item>
				<Form.Item label='E-mail' name='email' rules={
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
				<Form.Item
					name="password"
					label="Password"
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
					name="confirm"
					label="Confirm Password"
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
				<Form.Item {...tailFormItemLayout} valuePropName="checked" name='agreement' rules={
					[
						{
							required: true,
							message: 'Please Select Terms and Conditions'
						}
					]
				}>
					<Checkbox>
						By Signing up you agree to BrightForce's Terms of Services and Privacy
						Policy, which outline your rights and obligations with respect to your
						use of the Service and processing of your data.
                            </Checkbox>
				</Form.Item>
				<Form.Item {...tailFormItemLayout} valuePropName="checked" name='unsubscribe' rules={
					[
						{
							required: true,
							message: 'Please Agree email and third-party communications'
						}
					]
				}>
					<Checkbox>
						You agree to receive subsequent email and third-party communications,
						which you may opt out of, or unsubscribe from, at any time.
                            </Checkbox>
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Button type='primary' htmlType='submit' loading={loading}>
						Register
                        </Button>
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<p>
						Already have an account? &nbsp;
                    <Link to='/admin/login'>Sign In</Link>
					</p>
				</Form.Item>
			</Form>
		</Fragment>
	);
}

export default RegisterForm;
