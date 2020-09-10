import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Input, Row, Col, notification } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import MainInfo from '../../Details/CompanyRequest/MainInfo'
import NavigationBar from '../../NavigationBar';
import CompanyDetails from '../../Details/CompanyRequest/CompanyDetails';
import ContactDetails from '../../Details/CompanyRequest/ContactDetails';
import SendRegistrationEmail from '../../Details/CompanyRequest/SendRegistrationEmail';
import AssignBFCompany from '../../Details/CompanyRequest/AssignBFCompany';
import DeniedReport from '../../Details/CompanyRequest/DeniedReport';
import RequestClosed from '../../Details/CompanyRequest/RequestClosed';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router";
import { useHistory } from 'react-router-dom';
import '../../companies.scss'
import { getCompanyRequestById, setSelectedCompanyNavItem, getAllCompanyRequests, denyCompanyRequest, getAllCompanies } from '../../../../../../actions/company';

const { Content, Sider } = Layout;
const { TextArea } = Input;
function CompanyRequest() {

  const dispatch = useDispatch();
  const history = useHistory();
  const selectedCompanyRequest = useSelector(state => state.company.selectedCompanyRequest)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  let { id } = useParams();
  useEffect(() => {
    dispatch(getCompanyRequestById(id));
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

  const denyRequest = () => {
    setRejectModalVisible(true)
  };

  const handleRejectModalOk = e => {
    if (rejectionReason !== null && rejectionReason !== '' && rejectionReason !== undefined) {
      let obj = {
        rejectionReason: rejectionReason
      }
      dispatch(denyCompanyRequest(obj, id));
      setRejectModalVisible(false);
      setRejectionReason('')
    }
    else {
      notification.error({
        message: 'Error',
        description: 'Add Rejection Reason First!!!',
      });
    }
  };

  const handleRejectModalCancel = e => {
    setRejectModalVisible(false);
    setRejectionReason('')
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
        </Sider>

        <Layout>
          <Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
            <div>
              <MainInfo selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
            </div>
          </Content>
        </Layout>
      </Layout>

      <Layout>
        <Row style={{ margin: '10px 0px' }}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <CompanyDetails selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <ContactDetails selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
          </Col>
        </Row>

        {selectedCompanyRequest && (selectedCompanyRequest.status === 'handled' || selectedCompanyRequest.status === 'pending') &&
          <div>
            <Row style={{ margin: '10px 0px' }}>
              {selectedCompanyRequest && (selectedCompanyRequest.status === 'pending' || selectedCompanyRequest.status === 'handled') && <Col xs={24} sm={24} md={12} lg={12}>
                <AssignBFCompany selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
              </Col>}
              {selectedCompanyRequest && (selectedCompanyRequest.status === 'pending' || selectedCompanyRequest.status === 'handled') && <Col xs={24} sm={24} md={12} lg={12}>
                <SendRegistrationEmail selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
              </Col>}
            </Row>
            <Row style={{ margin: '10px 0px' }}>
              {selectedCompanyRequest && (selectedCompanyRequest.status === 'pending') && <Col xs={24} sm={24} md={24} lg={24}>
                <Button type='danger' onClick={denyRequest}> <StopOutlined /> Rejected Request</Button>
              </Col>}
            </Row>
          </div>}

        {selectedCompanyRequest && (selectedCompanyRequest.status === 'denied') &&
          <Row style={{ margin: '10px 0px' }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <DeniedReport selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
            </Col>
          </Row>}
        {selectedCompanyRequest && (selectedCompanyRequest.status === 'closed') &&
          <Row style={{ margin: '10px 0px' }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <RequestClosed selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
            </Col>
          </Row>}

      </Layout>
      <Modal
        title="Reject Request"
        visible={rejectModalVisible}
        onOk={handleRejectModalOk}
        onCancel={handleRejectModalCancel}
      >
        <p>Are you sure to Reject this Request?</p>
        Rejection Reason : <TextArea rows={4} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
      </Modal>

    </div>
  )
}

export default CompanyRequest;
