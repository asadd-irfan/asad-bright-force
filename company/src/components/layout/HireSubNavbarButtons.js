import React, { useState, useEffect } from 'react';
import { Menu, Row, Col, Drawer, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentHireSNavbarButton } from '../../actions/common';



export default function HireSubNavbarButtons() {
  const user = useSelector(state => state.auth.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const currentHireNavbarButton = useSelector(state => state.auth.currentHireNavbarButton);

  useEffect(() => {
    if (currentHireNavbarButton === ''){
      if (history?.location?.pathname.includes('company/hire/recruitment')) {
        dispatch(setCurrentHireSNavbarButton('recruitment'))
      }
      if (history?.location?.pathname.includes('company/hire/profile')) {
        dispatch(setCurrentHireSNavbarButton('profile'))
      }
      if (history?.location?.pathname.includes('company/hire/calender')) {
        dispatch(setCurrentHireSNavbarButton('calender'))
      }
    } 
  }, [])

  return (
    (history?.location?.pathname.includes('company/hire/profile') || history?.location?.pathname.includes('company/hire/calender')) && (user?.authorizations.includes("hire") || user?.role === 'admin') &&
    <Row style={{margin: '10px' }}>
      <Col xs={24} sm={24} md={24} lg={24}>
        <Button style={{margin: '10px'}} type={currentHireNavbarButton === 'recruitment' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/company/hire/recruitment')
          dispatch(setCurrentHireSNavbarButton('recruitment'))
        }}>
          Recruitment
        </Button>
        <Button style={{margin: '10px'}} type={currentHireNavbarButton === 'profile' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/company/hire/profile')
          dispatch(setCurrentHireSNavbarButton('profile'))
        }}>
          Profile
        </Button>
        <Button style={{margin: '10px'}} type={currentHireNavbarButton === 'calender' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/company/hire/calender')
          dispatch(setCurrentHireSNavbarButton('calender'))
        }}>
          Calender
        </Button>
      </Col>
    </Row>
  );
}

