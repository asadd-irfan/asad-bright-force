import React, { useState } from 'react';
import { Layout, Button, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CompanyRequestsFilter from './Filters/CompanyRequestsFilter';
import CompanySuggestionsFilter from './Filters/CompanySuggestionsFilter';
import CompaniesAllFilter from './Filters/CompaniesAllFilter';
import CompanyRequestsTable from './Tables/CompanyRequestsTable';
import CompanySuggestionsTable from './Tables/CompanySuggestionsTable';
import CompaniesAllTable from './Tables/CompaniesAllTable';
import NavigationBar from './NavigationBar';
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedCompanyNavItem, getAllCompanyRequests, getAllCompanies, addNewCompany } from '../../../../actions/company'
import { useHistory } from 'react-router-dom';

import './companies.scss'

const { Content, Sider } = Layout;

function Companies() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [companyModalVisible, setCompanyModalVisible] = useState(false)
  const selectedNavItem = useSelector(state => state.company.selectedCompanyNavbarItem)
  const [companyName, setCompanyName] = useState(null)
  const [companyURL, setCompanyURL] = useState(null)

  const showCompanyModal = () => {
    setCompanyModalVisible(true);
  };

  const handleCompanyModalOk = e => {
    let obj = {
      companyName: companyName,
      companyURL: companyURL
    }
    dispatch(addNewCompany(obj)).then(() => {
      setCompanyModalVisible(false);
      setCompanyName(null)
      setCompanyURL(null)
    })
  };

  const handleCompanyModalCancel = e => {
    setCompanyModalVisible(false);
    setCompanyName(null)
    setCompanyURL(null)
  };

  const onChangeSelectedNavItem = navItem => {
    if (navItem === 'requests') {
      dispatch(getAllCompanyRequests(''));
    }
    if (navItem === 'all') {
      dispatch(getAllCompanies(''));
    }
    dispatch(setSelectedCompanyNavItem(navItem));
    history.push(`/admin/companies`);
  };

  const onGetCompaniesRequests = status => {
    history.push(`/admin/companies`);
    dispatch(setSelectedCompanyNavItem('requests')).then(() => {
      let params = `?status=${status}`
      dispatch(getAllCompanyRequests(params));
    });
  };

  const onGetAllCompaniesByStatus = status => {
    history.push(`/admin/companies`);
    dispatch(setSelectedCompanyNavItem('all')).then(() => {
      let params = `?status=${status}`
      dispatch(getAllCompanies(params));
    });
  };

  return (
    <div style={{ padding: '25px 15px' }}>
      <Layout>
        <Sider
          breakpoint="lg"
          width={'230px'}
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <NavigationBar onGetAllCompaniesByStatus={onGetAllCompaniesByStatus} onGetCompaniesRequests={onGetCompaniesRequests} onChangeSelectedNavItem={onChangeSelectedNavItem} isCount={true} />
          {(selectedNavItem === 'requests' || selectedNavItem === 'all') && <div className='text-center mt-10'>
            <Button type='primary' onClick={showCompanyModal}>
              <PlusOutlined /> Add a new Company
                </Button>
          </div>}
        </Sider>

        <Layout>
          <Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
            {selectedNavItem === 'requests' &&
              <div>
                <CompanyRequestsFilter />
                <CompanyRequestsTable />
              </div>}
            {selectedNavItem === 'all' &&
              <div>
                <CompaniesAllFilter />
                <CompaniesAllTable />
              </div>}
            {selectedNavItem === 'suggestions' &&
              <div>
                <CompanySuggestionsFilter />
                <CompanySuggestionsTable />
              </div>}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Create a new Company"
        visible={companyModalVisible}
        onOk={handleCompanyModalOk}
        onCancel={handleCompanyModalCancel}
      >
        <p>lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aborum.</p>
            Company Name : <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
            Company Website : <Input value={companyURL} onChange={e => setCompanyURL(e.target.value)} />
      </Modal>
    </div>
  )
}

export default Companies;
