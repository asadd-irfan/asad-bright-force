import React, { Component, Fragment } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tabs } from 'antd';
import LoginForm from './LoginForm';

const { TabPane } = Tabs;

class Login extends Component {
	callback = (key) => {
		if (key === 'company') {
			window.location.href = '/company/login'
		}
	}
	render() {

		return (
			<Fragment>
				{/* *******Headline******* */}
				<div className='mb-5 mt-1'>
					<h1 className='text-center'>Talent Log In</h1>
					<p className='text-center' style={{ fontSize: '1rem' }}>
						<UserOutlined style={{ fontSize: '2rem' }} />
						&nbsp; Sign Into Your Account
                    </p>
				</div>

				{/* Tabs for login */}
				<div className='card-container my-5 py-5' >
					{/* <Tabs defaultActiveKey='talent' type='card' onChange={this.callback}>
						<TabPane tab='Talent' key='talent'>
							<LoginForm />
						</TabPane>
						<TabPane tab='Company' key='company'>
						</TabPane>
					</Tabs> */}
					<LoginForm />

				</div>
			</Fragment>
		);
	}
}

export default Form.create()(Login);
