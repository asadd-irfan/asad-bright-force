import React, { useEffect } from 'react';
import { Layout } from 'antd';
import InternalRecords from './InternalRecords'
import NavigationBar from '../../NavigationBar';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router";
import { useHistory } from 'react-router-dom';
import '../../companies.scss'
import DetailPanel from './DetailPanel'

import { setSelectedCompanyNavItem, getAllCompanyRequests, getAllCompanies, getCompanyById } from '../../../../../../actions/company';

const { Content, Sider } = Layout;
function CompanyDetail() {

  const dispatch = useDispatch();
  const history = useHistory();
  const selectedCompany = useSelector(state => state.company.selectedCompany)
  
  let { id } = useParams();
  useEffect(() => {
    dispatch(getCompanyById(id));
  }, [])


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
    <div>
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
        </Sider>

        <Layout>
          <Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
            <div>
              <InternalRecords selectedCompany={selectedCompany && selectedCompany}/>
            </div>
          </Content>
        </Layout>
      </Layout>

      <DetailPanel selectedCompany={selectedCompany && selectedCompany} companyId={id}/>

    </div>
  )
}

export default CompanyDetail;
