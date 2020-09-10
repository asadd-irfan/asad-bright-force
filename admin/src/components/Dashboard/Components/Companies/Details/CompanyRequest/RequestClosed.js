import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import '../../companies.scss'
import RegisteredCompanyUser from './RegisteredCompanyUser';
import CompanyDetailsActual from './CompanyDetailsActual';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyById } from '../../../../../../actions/company'


function RequestClosed({ selectedCompanyRequest }) {
  const dispatch = useDispatch()
  const selectedCompany = useSelector(state => state.company.selectedCompany)

  useEffect(() => {
     if (selectedCompanyRequest && selectedCompanyRequest.assignedCompany) {
      dispatch(getCompanyById(selectedCompanyRequest.assignedCompany))
     }
  }, [selectedCompanyRequest])
  return (
    <div style={{ marginRight: '10px' }}>
      <div className='text-center' style={{ margin: '10px 0px' }}>
        <h3><CheckOutlined style={{ color: '#009E0F' }} /> This Request is handled and closed</h3>
      </div>
      <Row style={{ margin: '10px 0px' }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <CompanyDetailsActual selectedCompany={selectedCompany && selectedCompany} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <RegisteredCompanyUser selectedCompanyRequest={selectedCompanyRequest && selectedCompanyRequest} />
        </Col>
      </Row>
    </div>
  )
}

export default RequestClosed;
