import React, { useEffect, useState, Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Button, Form, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { resetNotificationSetting } from '../../actions/common';
import { resetPassword, clearServerErrors } from '../../actions/auth';
import { errorNotification, onFinishFailed, successNotification, } from "../../common/commonMethods";
import styles from './Auth.module.scss'
import ReactPasswordStrength from 'react-password-strength';
import "./auth.scss";
import { useParams } from "react-router";

const LoginForm = () => {
	const serverErrors = useSelector(state => state.auth.serverErrors);
	const apiResponse = useSelector(state => state.auth.apiResponse);
	const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
	const loading = useSelector(state => state.auth.btnLoading);
	const dispatch = useDispatch()
	const history = useHistory();
	const [form] = Form.useForm();
	const [userPassword, setUserPassword] = useState(null)
	const [showError, setShowError] = useState(false)
	const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false)
	let { token } = useParams();
	const resetToken = token
	// console.log('token', resetToken)
	useEffect(() => {
		serverErrors && openErrorNotification();
		showSuccessNotification && openSuccessNotification();
	}, [serverErrors, loading]);

	const handleSubmit = () => {
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
				'password': userPassword.password
			}
			dispatch(resetPassword(obj, resetToken)).then((res) => {
				console.log('res', res)
				if (res && res.status === 'success') {
					form.resetFields();
					setUserPassword(null);
					history.push(`/talent/login`);
				}

			});
		}
	};

	const openErrorNotification = () => {
		errorNotification(serverErrors);
		dispatch(clearServerErrors());
	}
	const openSuccessNotification = () => {
		successNotification(apiResponse)
		dispatch(resetNotificationSetting());
	};

	const layout = {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 10,
		},
	};

	const buttonLayout = {
		wrapperCol: {
			span: 8,
			offset: 8,
		},
	};
	const comparePasswords = (e) => {
		// console.log('c-pass', e.target.value)
		if (e.target.value == userPassword?.password) {
			setShowConfirmPasswordError(false)
		} else {
			setShowConfirmPasswordError(true)
		}
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
	const passwordMessage = <div>
		<p style={{ color: '#ff4d4f' }}>
			Password strength must 'good', 'strong' or 'stronger'</p>
	</div>
	const confirmPasswordMessage = <div>
		<p style={{ color: '#ff4d4f' }}>
			The two passwords that you entered do not match!</p>
	</div>
	return (
		<Fragment>
			<Row className={styles.middle}>
				<Col xs={0} sm={0} md={4} lg={4} />
				<Col xs={24} sm={24} md={16} lg={16}>
					<div className='card-container my-5 py-5' >


						<Row justify='center' className="m-3 p-3">
							<h3>Set New Password!</h3>
						</Row>
						<Form form={form}
							{...layout}
							className={styles.form}
							initialValues={{
								remember: false,
							}}
							onFinish={handleSubmit}
							onFinishFailed={onFinishFailed}
						>
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


							<Form.Item {...buttonLayout}>
								<Button type="primary" block htmlType="submit" loading={loading} style={{ width: 330 }}>
									Reset Password
        </Button>
							</Form.Item>


						</Form>



					</div>
				</Col>
			</Row>
		</Fragment>
	);
};

export default LoginForm;
