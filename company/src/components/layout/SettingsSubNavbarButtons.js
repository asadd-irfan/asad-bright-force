import React, { useState, useEffect } from 'react';
import { Menu, Row, Col, Drawer, Button, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentSettingSNavbarButton } from '../../actions/common';



export default function SettingsSubNavbarButtons() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentSettingNavbarButton = useSelector(state => state.auth.currentSettingNavbarButton);

  useEffect(() => {
    if (currentSettingNavbarButton === ''){
      if (history?.location?.pathname.includes('company/settings/manage-users')) {
        dispatch(setCurrentSettingSNavbarButton('manage-users'))
      }
      if (history?.location?.pathname.includes('company/settings/timezone-currency')) {
        dispatch(setCurrentSettingSNavbarButton('timezone-currency'))
      }
      if (history?.location?.pathname.includes('company/settings/billing')) {
        dispatch(setCurrentSettingSNavbarButton('billing'))
      }
    } 
  }, [])

  return (
    history?.location?.pathname.includes('company/settings') &&
    <Row style={{margin: '10px' }}>
      <Col xs={24} sm={24} md={24} lg={24}>
        <Button style={{margin: '10px'}} type={currentSettingNavbarButton === 'manage-users' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/company/settings/manage-users')
          dispatch(setCurrentSettingSNavbarButton('manage-users'))
        }}>
          Users
        </Button>
        <Button style={{margin: '10px'}} type={currentSettingNavbarButton === 'timezone-currency' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/company/settings/timezone-currency')
          dispatch(setCurrentSettingSNavbarButton('timezone-currency'))
        }}>
          Time Zone & Currency
        </Button>
        <Button style={{margin: '10px'}} type={currentSettingNavbarButton === 'billing' ? "primary" :"default"} size='large' onClick={() => {
          history.push('/company/settings/billing')
          dispatch(setCurrentSettingSNavbarButton('billing'))
        }}>
          Billing Info
        </Button>
      </Col>
    </Row>
  );
}

