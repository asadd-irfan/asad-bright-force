import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from "react-router";
import '../../companies.scss'
import ManagerUsers from './ManagerUsers'
import ManagerCompanyUsers from './ManagerCompanyUsers'
import TimeZoneCurrencySettings from './TimeZoneCurrencySettings'
import PositionsTracking from './PositionsTracking'
import BillingDetails from './BillingDetails'
// import CompanyProfileEdit from './CompanyProfileEdit'
import CompanyProfileView from './CompanyProfileView'
import { getAllUsersOfCompany, changeCompanyTabPanelKey } from '../../../../../../actions/company';

const { TabPane } = Tabs;

function DetailPanel({ selectedCompany, companyId }) {

  const dispatch = useDispatch();
  const companyTabPanelKey = useSelector(state => state.company.companyTabPanelKey);


  let { id } = useParams();
  useEffect(() => {
    dispatch(getAllUsersOfCompany(id));
  }, [])

  const onChangeTab = (key) => {
    dispatch(changeCompanyTabPanelKey(key));
  }
  return (
    <div style={{ padding: '25px 15px' }}>
      <div className='card-container' style={{ background: 'white' }}>
        <Tabs defaultActiveKey={companyTabPanelKey} activeKey={companyTabPanelKey} type='card' onChange={onChangeTab}>
          <TabPane tab='Company Profile' key='profile'>
            {/* <CompanyProfileEdit selectedCompany={selectedCompany && selectedCompany} companyId={companyId}/> */}
            <div className="my-5">
              <CompanyProfileView selectedCompany={selectedCompany && selectedCompany} />
            </div>
          </TabPane>
          <TabPane tab='Manage Users' key='users'>
            <div className="my-5">
              <ManagerCompanyUsers selectedCompany={selectedCompany && selectedCompany} />
            </div>
          </TabPane>
          <TabPane tab='Time Zone & Currency' key='timezone'>
            <div className="my-5">
              <TimeZoneCurrencySettings selectedCompany={selectedCompany && selectedCompany} />
            </div>
          </TabPane>
          <TabPane tab='Billing Info' key='billing'>
            <div className="my-5">
              <BillingDetails selectedCompany={selectedCompany && selectedCompany} />
            </div>
          </TabPane>
          <TabPane tab='Positions Tracking' key='position'>
            <div className="my-5">
              <PositionsTracking selectedCompany={selectedCompany && selectedCompany} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default DetailPanel;
