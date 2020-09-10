import React, { useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentStaffNavbarButton } from '../../../../actions/common';



export default function SubNavbarButtons() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentStaffNavbarButton = useSelector(state => state.auth.currentStaffNavbarButton);

  useEffect(() => {
    if (currentStaffNavbarButton === ''){
      if (history?.location?.pathname.includes('admin/staff/account-managers')) {
        dispatch(setCurrentStaffNavbarButton('account-managers'))
      }
      if (history?.location?.pathname.includes('admin/staff/talent-managers')) {
        dispatch(setCurrentStaffNavbarButton('talent-managers'))
      }
    } 
  }, [])

  return (
    <Row style={{margin: '10px' }}>
      <Col xs={24} sm={24} md={24} lg={24}>
        <Button style={{margin: '10px'}} type={currentStaffNavbarButton === 'account-managers' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/admin/staff/account-managers')
          dispatch(setCurrentStaffNavbarButton('account-managers'))
        }}>
          Account Managers
        </Button>
        {/* <Button style={{margin: '10px'}} type={currentStaffNavbarButton === 'talent-managers' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/admin/staff/talent-managers')
          dispatch(setCurrentStaffNavbarButton('talent-managers'))
        }}>
          Talent Managers
        </Button> */}
      </Col>
    </Row>
  );
}

