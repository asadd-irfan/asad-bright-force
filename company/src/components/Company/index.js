import React, { Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Tabs } from 'antd';
import CompanyProfile from './CompanyProfile/index'
const { TabPane } = Tabs;

const Company = () => {

  return (
    <Fragment>
      <div style={{ padding: '25px 15px' }}>
        {/* <div className='card-container' style={{ background: 'white' }}> */}
        {/* <Tabs defaultActiveKey='profile' type='card'>
            <TabPane tab='Company Profile' key='profile'> */}
        <CompanyProfile />
        {/* </TabPane>
        </Tabs> */}
        {/* </div> */}
      </div>
    </Fragment>
  );
}
export default Company;

