import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox, Button, Form, Row, Col, Typography, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import styles from './Auth.module.scss'
import { Redirect } from 'react-router-dom';
import { registerFirstUser } from '../../actions/auth';
import { onFinishFailed } from "../../common/commonMethods";
import { getCompanyRequestById } from "../../actions/company";
import jwtDecode from 'jwt-decode'
import ReactPasswordStrength from 'react-password-strength';
import "./auth.scss";

const { Title } = Typography;

const RegisterFirstUser = () => {
	// get token from query paramter
	const [decodedToken, setDecodedToken] = useState(null);
	const loading = useSelector(state => state.auth.authBtnLoading);
	const request = useSelector(state => state.company.selectedCompanyRequest);
	const [userPassword, setUserPassword] = useState()
	const [showError, setShowError] = useState(false)
	const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false)

	const dispatch = useDispatch()
	const [form] = Form.useForm();
	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const token = urlParams.get('token')
		if (token) {
			const decodedToken = jwtDecode(token);
			setDecodedToken(decodedToken)
		}
	}, [])

	useEffect(() => {
		if (decodedToken && decodedToken.user.id) {
			dispatch(getCompanyRequestById(decodedToken.user.id))
		}
	}, [decodedToken])

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

			let id = request && request._id
			let obj = {
				password: userPassword.password
			}
			// console.log('obj', obj)

			dispatch(registerFirstUser(obj, id));
		}
	};
	const onChange = (value) => {
		// console.log('value', value)
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

	const formItemLayout = {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 10,
		},
	};
	const hiringFormItemLayout = {
		labelCol: {
			span: 14,
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

	// redirect if sign up successfully
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
	const user = useSelector(state => state.auth.user);
	if (isAuthenticated && user && (user.role === 'admin' || user.role === 'moderator')) {
		return <Redirect to='/company/home' />;
	}

	const passwordMessage = <div>
		<p style={{ color: 'red' }}>
			Password strength must 'good', 'strong' or 'stronger'</p>
	</div>
	const confirmPasswordMessage = <div>
		<p style={{ color: '#ff4d4f' }}>
			The two passwords that you entered do not match!</p>
	</div>

	return (
		<Fragment>
			<Row>
				<Col xs={0} sm={0} md={2} lg={6} />
				<Col xs={24} sm={24} md={20} lg={12}>
					<Fragment>
						<div className='mb-3 mt-4' />
						<div className={styles.userFormWrapper}>
							<Fragment>
								<Form
									{...formItemLayout}
									onFinish={handleSubmit}
									onFinishFailed={onFinishFailed}
									form={form}
									className='mb-5'
								>
									<Title level={2} className='text-center'>Hi, {request && request.requesterName}</Title>
									<Title level={2} className='text-center'>Welcome to BrightForce</Title>
									<Title level={2} className='text-center'>Where global Employment is reinvented </Title>
									<hr style={{ border: '1px solid' }} />
									<div className={styles.p10}>
										<Form.Item
											className='mb-0'
											name="name"
											label={<strong>Name</strong>}
										>
											{request && request.requesterName}
										</Form.Item>
										<Form.Item
											name="title"
											className='mb-0'
											label={<strong>Title</strong>}
										>
											{request && request.title}
										</Form.Item>
										<Form.Item
											className='mb-0'
											name="email"
											label={<strong>Email</strong>}
										>
											{request && request.email}
										</Form.Item>
										<Form.Item
											name="phone"
											label={<strong>Phone No</strong>}
										>
											{request && request.phone}
										</Form.Item>
										<Form.Item
											{...hiringFormItemLayout}
											name="hiring"
											label={<strong>Choose a password and start hiring</strong>}
										>
											{''}
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
											label="Verify Password:"
											// dependencies={['password']}
											// hasFeedback
											rules={[
												{
													required: true,
													message: 'Please confirm your password!',
												},
												// ({ getFieldValue }) => ({
												// 	validator(rule, value) {
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
												By signing up you agree to BrightForce's Terms of Service and Privacy Policy, which outline your rights and obligations with respect to your use of the Service and processing of your data.
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
												You agree to receive subsequent email and third-party communications, which you may opt out of, or unsubscribe from, at any time.
                            </Checkbox>
										</Form.Item>
										<Form.Item {...tailFormItemLayout}>
											<Fragment>
												BrightForce is committed to protecting your data privacy. Permissions are part of our continuing compliance efforts
                            </Fragment>
										</Form.Item>
										<Form.Item {...tailFormItemLayout}>
											<Button type='primary' htmlType='submit' loading={loading}>
												Sign Up
                        </Button>
										</Form.Item>
									</div>
								</Form>
							</Fragment>

						</div>
					</Fragment>
				</Col>
				<Col xs={0} sm={0} md={2} lg={6} />
			</Row>
		</Fragment>

	);
}

export default RegisterFirstUser;
