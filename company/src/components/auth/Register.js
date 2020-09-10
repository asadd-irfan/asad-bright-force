import React, { Fragment } from 'react';
import { Tabs, Typography } from 'antd';
import RegisterForm from './RegisterForm';
const { TabPane } = Tabs;
const { Title } = Typography;

const Register = () => {
    const callback = (key) => {
        if (key === 'talent') {
            window.location.href = '/talent/register'
        }
    }
    return (
        <Fragment>
            <div className='mb-5 mt-4'>
                <Title level={3} className='text-center' style={{ color: '#7B15CC' }}>Employ talent anywhere in the world</Title>
            </div>

            {/* Tabs for login */}
            <div className='card-container my-5 py-5' >
                {/* <Tabs defaultActiveKey='company' type='card' onChange={callback} centered={true}>
                    <TabPane tab='Talent' key='talent'>
                    </TabPane>
                    <TabPane tab='Company' key='company'>
                        <RegisterForm />
                    </TabPane>
                </Tabs> */}
                <RegisterForm />

            </div>
        </Fragment>
    );
}

export default Register;

