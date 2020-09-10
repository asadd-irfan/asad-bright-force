import React, { Fragment } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tabs } from 'antd';
import RegisterForm from './RegisterForm';
const { TabPane } = Tabs;

const Register = () => {
    const callback = (key) => {
        if (key === 'company') {
            window.location.href = '/company/register'
        }
    }
    return (
        <Fragment>
            <div className='mb-5 mt-1'>
                <h1 className='text-center'>Talent Sign Up</h1>
                <p className='text-center' style={{ fontSize: '1rem' }}>
                    <UserOutlined style={{ fontSize: '2rem' }} />
                    &nbsp; Create Your Account
                </p>
            </div>

            {/* Tabs for login */}
            <div className='card-container my-5 py-5' >
                {/* <Tabs defaultActiveKey='talent' type='card' onChange={callback}>
                    <TabPane tab='Talent' key='talent'>
                        <RegisterForm />
                    </TabPane>
                    <TabPane tab='Company' key='company'>
                    </TabPane>
                </Tabs> */}
                <RegisterForm />

            </div>
        </Fragment>
    );
}

export default Form.create()(Register);

