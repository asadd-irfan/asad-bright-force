import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox, Button, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
	registerCompanyRequest,
	loadAppConfigs
} from '../../actions/auth';
import { useHistory } from 'react-router-dom';
import { onFinishFailed } from "../../common/commonMethods";
const { Option } = Select;

const RegisterForm = () => {
	const [form] = Form.useForm();
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const apiResponse = useSelector(state => state.auth.apiResponse);
	const [isPhone, setPhone] = useState("");
	const loading = useSelector(state => state.auth.authBtnLoading);
	const dispatch = useDispatch()
	let companySizesOptions = appConfigs && appConfigs['company-size']
	const history = useHistory();

	useEffect(() => {
		if (apiResponse !== null) {
			form.resetFields();
			setPhone("")
		}
	}, [apiResponse])

	const handleSubmit = values => {
		const profileData = { ...values, phone: isPhone };
		// console.log('profileData',profileData)
		dispatch(registerCompanyRequest(profileData)).then(() => {
			history.push(`/company/register-message`);
		});
	};

	useEffect(() => {
		dispatch(loadAppConfigs());
	}, [])

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
				<Form.Item label='Full Name' name='requesterName' rules={
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
				<Form.Item label='Phone' rules={
					[
						{
							required: true,
							message: 'Please input your Phone!'
						}
					]
				}>
					<PhoneInput
						country={"us"}
						value={isPhone}
						onChange={phone => setPhone(phone)}
					/>
				</Form.Item>
				<Form.Item label='Title' name='title' rules={
					[
						{
							required: true,
							message: 'Please Select your Company Title!'
						}
					]
				}>
					{/* <Select
						allowClear
						style={{ width: 271.88 }}
						placeholder="Select Title"
					>
						{companyTitleOptions && companyTitleOptions.map((title, index) => {
							return <Option key={index} value={title._id}>{title.name}</Option>
						})}
					</Select> */}
					<Input />
				</Form.Item>
				<Form.Item label='Company Name' name='companyName' rules={
					[
						{
							required: true,
							message: 'Please input your Company Name!'
						}
					]
				}>
					<Input />
				</Form.Item>
				<Form.Item label='Company Website' name='companyWebsite' rules={
					[
						{
							required: true,
							message: 'Please input your Company Website!'
						},
						{
							type: "url",
							message: "This link is not a valid URL"
						}
					]
				}>
					<Input />
				</Form.Item>
				<Form.Item label="Employees:" name="employees" rules={
					[
						{
							required: true,
							message: 'Please Select your Company Size!'
						}
					]
				}>
					<Select
						allowClear
						style={{ width: 271.88 }}
						placeholder="Select employees number"
					>
						{companySizesOptions && companySizesOptions.map((size, index) => {
							return <Option key={index} value={size._id}>{size.name}</Option>
						})}
					</Select>
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
				<Form.Item {...tailFormItemLayout}>
					<p>
						Already have an account? &nbsp;
                    <Link to='/company/login'>Login</Link>
					</p>
				</Form.Item>
			</Form>
		</Fragment>
	);
}

export default RegisterForm;
