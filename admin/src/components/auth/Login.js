import React, { Component, Fragment } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import LoginForm from './LoginForm';

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
					<h1 className='text-center'>Admin Log In</h1>
					<p className='text-center' style={{ fontSize: '1rem' }}>
						<UserOutlined style={{ fontSize: '2rem' }} />
						&nbsp; Sign Into Your Account
                    </p>
				</div>

				{/* Tabs for login */}
				<LoginForm />
			</Fragment>
        );
	}
}

export default Form.create()(Login);
