import React, { useEffect } from 'react';
import AccountManagersTable from './AccountManagersTable';
import AccountManagersFilter from './AccountManagersFilter';
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SubNavbarButtons from '../SubNavbarButtons';
import { setCurrentStaffNavbarButton } from '../../../../../actions/common';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';

function AccountManagers() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentStaffNavbarButton('account-managers'))
  }, [])
  const AddManager = () => {
    history.push(`/admin/staff/account-manager`);
  }
  return (
    <div>
      <SubNavbarButtons />
      <div style={{ padding: '25px 15px' }}>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => AddManager()}>
          Create a Account Manager</Button>
      </div>
      <div style={{ padding: '25px 15px' }}>
        <AccountManagersFilter />
        <AccountManagersTable />
      </div>
    </div>
  )
}

export default AccountManagers;
