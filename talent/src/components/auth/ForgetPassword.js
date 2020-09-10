import React, { useEffect, Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Button, Form } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { resetNotificationSetting } from '../../actions/common';
import { forgetPassword, clearServerErrors } from '../../actions/auth';
import { errorNotification, onFinishFailed, successNotification, } from "../../common/commonMethods";
import styles from './Auth.module.scss'
const LoginForm = () => {
	const serverErrors = useSelector(state => state.auth.serverErrors);
	const apiResponse = useSelector(state => state.auth.apiResponse);
	const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
	const loading = useSelector(state => state.auth.btnLoading);
	const dispatch = useDispatch()
	const [form] = Form.useForm();

	useEffect(() => {
		serverErrors && openErrorNotification();
		showSuccessNotification && openSuccessNotification();
	}, [serverErrors, loading]);

	const handleSubmit = values => {
		dispatch(forgetPassword(values)).then((link) => {
			console.log('link', link)
			form.resetFields();
		});
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
	const tailLayout = {
		wrapperCol: {
			span: 16,
			offset: 8,
		},
	};
	const buttonLayout = {
		wrapperCol: {
			span: 8,
			offset: 8,
		},
	};

	return (
		<Fragment>
			<Row className={styles.middle}>
				<Col xs={0} sm={0} md={4} lg={4} />
				<Col xs={24} sm={24} md={16} lg={16}>
					<div className='card-container my-5 py-5' >


						<Row justify='center' className="m-3 p-3">
							<h3>Forget Your Password!</h3>
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
							<Form.Item label='Email Address' name='email' rules={
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

							<Form.Item {...buttonLayout}>
								<Button type="primary" block htmlType="submit" loading={loading} style={{ width: 330 }}>
									Reset Password
        </Button>
							</Form.Item>

							<Form.Item {...tailLayout}>
								<p>
									<u><Link to='/talent/login'>Login</Link></u>
								</p>
								<p>
									Don't have an account?  &nbsp;
							<u><Link to='/talent/register'>Sign Up</Link></u>
								</p>
							</Form.Item>
						</Form>



					</div>
				</Col>
			</Row>
		</Fragment>
	);
};

export default LoginForm;
