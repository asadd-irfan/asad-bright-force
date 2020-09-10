import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux'

import CompanyProfileEdit from './CompanyProfileEdit'
import CompanyProfileView from './CompanyProfileView'
import { getCompanyDetails, getAllUsersOfCompany } from '../../../actions/company'
import { setCurrentHireSNavbarButton } from '../../../actions/common'

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false)
  const companyDetails = useSelector(state => state.company.companyDetails);
  const currentUser = useSelector(state => state.auth.user);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    dispatch(getCompanyDetails());
    dispatch(getAllUsersOfCompany());
    dispatch(setCurrentHireSNavbarButton('profile'));

  }, [])

  useEffect(() => {
    if (companyDetails?.about && companyDetails?.size && companyDetails?.location) {
      setShowEditProfile(true);
      setIsEdit(false)
    } else {
      setIsEdit(true)
    }
  }, [companyDetails]);

  const handleEditProfileBtn = () => {
    setIsEdit(true)
  }
  const handleViewProfileBtn = () => {
    setIsEdit(false)
  }
  return (<div>
    {/* <Fragment> */}
    {(currentUser?.role === 'admin' && showEditProfile === true) && <div style={{ marginBottom: '40px' }}>

      {!isEdit ?
        <Row className="my-5">
          <Col xs={14} sm={14} md={18} lg={18}>

          </Col>
          {showEditProfile === true && <Col xs={7} sm={7} md={3} lg={3}>
            <Button onClick={handleEditProfileBtn} type='primary'>Edit Profile</Button>
          </Col>}
        </Row>
        : <Row className="my-5">
          <Col xs={14} sm={14} md={18} lg={18}>

          </Col>
          <Col xs={7} sm={7} md={3} lg={3}>
            <Button onClick={handleViewProfileBtn} type='primary'>View Profile</Button>
          </Col>
        </Row>
      }
    </div>}
    {isEdit ?
      <CompanyProfileEdit goToView={handleViewProfileBtn} companyDetails={companyDetails && companyDetails} />
      :
      <CompanyProfileView companyDetails={companyDetails && companyDetails} />}
    {/* </Fragment> */}
  </div>
  );
}
export default CompanyProfile;

