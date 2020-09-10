import React, { Fragment, useState, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Checkbox, Button, notification, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { registerUser, clearServerErrors, loadAppConfigs } from '../../actions/auth';
import ReactPasswordStrength from 'react-password-strength';
import { errorNotification } from "../../common/commonMethods";
import "./Auth.module.scss";
import "./auth.scss";
const { Option } = Select;

const RegisterForm = () => {
	const [form] = Form.useForm();
	const serverErrors = useSelector(state => state.auth.serverErrors);
	const loading = useSelector(state => state.auth.btnLoading);
	const dispatch = useDispatch()
	const appConfigs = useSelector(state => state.auth.appConfigs);
	let roleOptions = appConfigs && appConfigs['roles']
	const [userPassword, setUserPassword] = useState()
	const [showError, setShowError] = useState(false)
	const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false)

	useEffect(() => {
		dispatch(loadAppConfigs());
	}, [])

	useEffect(() => {
		serverErrors && openErrorNotification();
	}, [serverErrors, loading])

	const handleSubmit = values => {
		if (userPassword.score < 2) {
			notification.error({
				message: 'Error',
				description: "Password strength must 'good', 'strong' or 'stronger'.",
			});
		} else if (form.getFieldValue('confirm') != userPassword.password) {
			notification.error({
				message: 'Error',
				description: "The two passwords that you entered do not match!",
			});
		} else {

			let obj = {
				...values,
				password: userPassword.password
			}
			// console.log('obj', obj)

			dispatch(registerUser(obj));
		}
	};

	const openErrorNotification = () => {
		errorNotification(serverErrors);
		dispatch(clearServerErrors());
	}
	const onChange = (value) => {
		// console.log('pass', value)
		setUserPassword(value);
		if (value.score >= 2) {
			setShowError(false)
		} else {
			setShowError(true)
		}
		if (form.getFieldValue('confirm')) {
			if (form.getFieldValue('confirm') == value.password) {
				setShowConfirmPasswordError(false)
			} else {
				setShowConfirmPasswordError(true)
			}
		}
	}
	const comparePasswords = (e) => {
		// console.log('c-pass', e.target.value)
		if (e.target.value == userPassword?.password) {
			setShowConfirmPasswordError(false)
		} else {
			setShowConfirmPasswordError(true)
		}
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
	const passwordMessage = <div>
		<p style={{ color: '#ff4d4f' }}>
			Password strength must 'good', 'strong' or 'stronger'</p>
	</div>
	const confirmPasswordMessage = <div>
		<p style={{ color: '#ff4d4f' }}>
			The two passwords that you entered do not match!</p>
	</div>


	return (
		<Fragment >
			<Form
				{...formItemLayout}
				onFinish={handleSubmit}
				onFinishFailed={onFinishFailed}
				form={form}
				style={{ margin: '5px 5px' }}
			>
				<Form.Item label='Role' name='role' rules={
					[
						{
							required: true,
							message: 'Please Select your Role!'
						}
					]
				}>
					<Select
						allowClear
						style={{ width: 300 }}
						placeholder="I'm Looking For a Job as a..."
					>
						{roleOptions && roleOptions.map((role, index) => {
							return <Option key={index} value={role._id}>{role.name}</Option>
						})}
					</Select>
				</Form.Item>
				<Form.Item label='Full Name' name='name' rules={
					[
						{
							required: true,
							message: 'Please input your name'
						}
					]
				}>
					<Input maxLength={25} style={{ width: 300 }} />
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
					<Input style={{ width: 300 }} />
				</Form.Item>
				<Form.Item
					// name="password"
					label="Password"
					// rules={[
					// 	{
					// 		required: true,
					// 		message: 'Please input your password!',
					// 	},
					// 	{
					// 		pattern: /^((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,})$/,
					// 		message: passwordMessage
					// 	},
					// ]}
					hasFeedback
				>
					{/* <Input.Password /> */}
					<ReactPasswordStrength
						minLength={5}
						minScore={2}
						scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
						changeCallback={onChange}
						inputProps={{
							name: "password_input", autoComplete: "off", className: "form-control"
						}}

					/>
				</Form.Item>
				{showError && <Row >
					<Col xs={8} sm={8} md={8} lg={8} />
					<Col xs={24} sm={24} md={12} lg={12}>
						{passwordMessage}
					</Col>
				</Row>}
				<Form.Item
					name="confirm"
					label="Confirm Password"
					// dependencies={['password']}
					// hasFeedback
					rules={[
						{
							required: true,
							message: 'Please confirm your password!',
						},
						// () => ({
						// 	validator(rule, value) {
						// 		// if (!value || getFieldValue('password') === value) {
						// 		if (!value || userPassword?.password === value) {
						// 			return Promise.resolve();
						// 		}
						// 		return Promise.reject('The two passwords that you entered do not match!');
						// 	},
						// }),
					]}
				>
					<Input.Password style={{ width: 300 }} onChange={(e) => comparePasswords(e)} />
				</Form.Item>
				{showConfirmPasswordError && <Row >
					<Col xs={8} sm={8} md={8} lg={8} />
					<Col xs={24} sm={24} md={12} lg={12}>
						{confirmPasswordMessage}
					</Col>
				</Row>}
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
                    <Link to='/talent/login'>Sign In</Link>
					</p>
				</Form.Item>
			</Form>
		</Fragment>
	);
}

export default RegisterForm;
