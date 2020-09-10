import React, { Component, Fragment } from 'react';
import { Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import LoginForm from './LoginForm';

const { TabPane } = Tabs;

class Login extends Component {
	callback = (key) => {
		if (key === 'talent') {
			window.location.href = '/talent/login'
		}
	}
	render() {

		return (
			<Fragment>
				{/* *******Headline******* */}
				<div className='mb-5 mt-1'>
					<h1 className='text-center'>Company Log In</h1>
					<p className='text-center' style={{ fontSize: '1rem' }}>
						<UserOutlined style={{ fontSize: '2rem' }} />
						&nbsp; Sign Into Your Account
                    </p>
				</div>

				{/* Tabs for login */}
				<div className='card-container my-5 py-5' >
					{/* <Tabs defaultActiveKey='company' type='card' onChange={this.callback} centered={true}>
						<TabPane tab='Talent' key='talent'>
						</TabPane>
						<TabPane tab='Company' key='company'>
							<LoginForm />
						</TabPane>
					</Tabs> */}
					<LoginForm />
				</div>
			</Fragment>
		);
	}
}

// export default Form.create()(Login);
export default Login;
