import React, { Fragment } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import RegisterForm from './RegisterForm';

const Register = () =>  {
    return (
        <Fragment>
            <div className='mb-5 mt-1'>
                <h1 className='text-center'>Admin Sign Up</h1>
                <p className='text-center' style={{ fontSize: '1rem' }}>
                    <UserOutlined style={{ fontSize: '2rem' }} />
                    &nbsp; Create Your Account
                </p>
            </div>

            {/* Tabs for login */}
            <RegisterForm />
        </Fragment>
    );
}

export default Form.create()(Register);

