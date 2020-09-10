import React, { useState, useEffect } from 'react';
import { Button, Menu, Checkbox, Modal, Input, notification, Avatar, Col, Tag, Row, Card, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, MoreOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux'
import { inviteNewUserToCompany, deleteCompanyUser, appointAsAdmin, editAuthorizations } from '../../actions/company';
import './manage_user.scss';
import { setCurrentSettingSNavbarButton } from '../../actions/common';

const { Paragraph } = Typography;
const { SubMenu } = Menu;

function ManagerUsers() {

  useEffect(() => {
    dispatch(setCurrentSettingSNavbarButton('manage-users'))
  }, [])

  const dispatch = useDispatch();
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')

  const [inviteModal, setInviteModal] = useState(false)
  const [authorizationModal, setAuthorizationModal] = useState(false)
  const [adminModal, setAdminModal] = useState(false)
  const [authRoles, setAuthRoles] = useState([])

  const [hireCheckBox, setHireCheckBox] = useState(false)
  const [manageCheckBox, setManageCheckBox] = useState(false)
  const [userAuthRoles, setUserAuthRoles] = useState([])

  const [deleteUserModal, setDeleteUserModal] = useState(false)
  const mailToken = useSelector(state => state.company.mailToken);
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const companyUsers = useSelector(state => state.company.companyUsers);
  const currentUser = useSelector(state => state.auth.user);

  const showInviteNewUserModal = () => {
    setHireCheckBox(false)
    setManageCheckBox(false)
    setInviteModal(true);
  }

  const onChangeNewUser = (e, authRole) => {
    let authRoleArray = [...authRoles];
    if (authRole === 'hire' && e.target.checked) {
      authRoleArray.push(authRole);
      setHireCheckBox(true)
    }
    if (authRole === 'manage' && e.target.checked) {
      authRoleArray.push(authRole);
      setManageCheckBox(true)
    }

    if (authRole === 'hire' && !e.target.checked) {
      authRoleArray = authRoleArray.filter(e => e !== 'hire');
      setHireCheckBox(false)

    }
    if (authRole === 'manage' && !e.target.checked) {
      authRoleArray = authRoleArray.filter(e => e !== 'manage');
      setManageCheckBox(false)

    }
    console.log('authRoleArray', authRoleArray)
    setAuthRoles(authRoleArray)

  }

  const handleInviteModalOk = e => {
    if (inviteEmail !== null && inviteEmail !== '' && inviteEmail !== undefined) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(inviteEmail) === false) {
        notification.error({
          message: 'Error',
          description: 'Enter Correct Email Format!!!',
        });
      }
      else {
        if (authRoles.length === 0) {
          notification.error({
            message: 'Error',
            description: 'Please Select one authorization role.',
          });
        } else {
          let obj = {
            email: inviteEmail,
            authorizations: authRoles
          }
          // console.log(obj)
          dispatch(inviteNewUserToCompany(obj));
          setInviteModal(false);
          setInviteEmail('')
          setAuthRoles([])
        }

      }

    }
    else {
      notification.error({
        message: 'Error',
        description: 'Add Email First!!!',
      });
    }
  };

  const handleInviteModalCancel = e => {
    setInviteModal(false);
    setInviteEmail('')
  };

  const showDeleteUserModal = (userId) => {
    setSelectedUserId(userId)
    setDeleteUserModal(true);
  }
  const handleDeleteUserModalOk = e => {
    dispatch(deleteCompanyUser(selectedUserId));
    setDeleteUserModal(false);
  };

  const handleDeleteUserModalCancel = e => {
    setDeleteUserModal(false);
  };




  const showAdminModal = (userId) => {
    setSelectedUserId(userId)
    setAdminModal(true);
  }

  const handleAdminModalOk = e => {
    dispatch(appointAsAdmin(selectedUserId));
    setAdminModal(false);
  };
  const handleAdminModalCancel = e => {
    setAdminModal(false);
  };

  const handleAuthorizationModalOk = e => {
    if (userAuthRoles.length === 0) {
      notification.error({
        message: 'Error',
        description: 'Please Select one authorization role.',
      });
    } else {
      let body = {
        "authorizations": userAuthRoles
      }
      dispatch(editAuthorizations(body, selectedUserId));
      setAuthorizationModal(false);
    }
  };

  const handleAuthorizationModalCancel = e => {
    // console.log('in handleAuthorizationModalCancel')
    setManageCheckBox(false);
    setHireCheckBox(false);
    setUserAuthRoles([]);
    setAuthorizationModal(false);

  };

  // console.log('authRoles',authRoles)
  const showAuthModal = (user) => {
    // console.log(user)
    setSelectedUserId(user._id)
    setUserAuthRoles(user.authorizations)
    if (user.authorizations) {
      user.authorizations.find(e => {
        if (e === 'hire') {
          setHireCheckBox(true)
        }
        if (e === 'manage') {
          setManageCheckBox(true)
        }
      })
    }

    setAuthorizationModal(true);

  }
  const onChangeEditUser = (e, authRole) => {

    let userRolesArray = [...userAuthRoles];
    if (authRole === 'hire' && e.target.checked) {
      userRolesArray.push(authRole);
      setHireCheckBox(true)
    }
    if (authRole === 'manage' && e.target.checked) {
      userRolesArray.push(authRole);
      setManageCheckBox(true)

    }

    if (authRole === 'hire' && !e.target.checked) {
      userRolesArray = userRolesArray.filter(e => e !== 'hire');
      setHireCheckBox(false)

    }
    if (authRole === 'manage' && !e.target.checked) {
      userRolesArray = userRolesArray.filter(e => e !== 'manage');
      setManageCheckBox(false)

    }
    setUserAuthRoles(userRolesArray)
    console.log('userAuthRoles', userAuthRoles)

  }
  // console.log('manageCheckBox now', manageCheckBox)
  // console.log('hireCheckBox now', hireCheckBox)

  return (
    <div style={{ padding: '25px 15px' }}>
      <Row>
        <Col xs={0} sm={0} md={3} lg={3} />
        <Col xs={24} sm={24} md={18} lg={18}>

          {currentUser?.role === 'admin' && <div style={{ margin: '30px 20px' }}>
            <Button type='primary' size='large' onClick={showInviteNewUserModal} loading={btnLoading} >
              +  Invite a New User
      </Button>
          </div>}


          <div className='text-center' style={{ margin: '30px 20px', wordWrap: 'break-word' }}>
            {mailToken && <>
              <strong>URL: </strong> {mailToken && mailToken}
            </>}
          </div>

          {companyUsers && companyUsers.map((user, index) => {
            return <div key={index} style={{ paddingLeft: '15px', marginBottom: '25px' }}>
              <Card style={{ border: '2px solid black' }}>
                <Row className="my-2">
                  <Col xs={4} sm={4} md={2} lg={2}>
                    <Avatar size={64} className="user_svg"
                      src={user?.profileImage &&
                        user?.profileImage?.includes("http")
                        ? user?.profileImage
                        : `/${user?.profileImage}`
                      }
                      icon={<UserOutlined />} />
                  </Col>
                  <Col xs={15} sm={15} md={18} lg={18} className="mt-3">
                    <h5>{user.fullName}, {user.title}</h5>
                  </Col>
                  <Col xs={3} sm={3} md={2} lg={2} className="mt-3">
                    {user.role === 'admin' && <Tag color="blue" >ADMIN</Tag>}
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} >
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} >
                    {currentUser?.role === 'admin' && <Menu mode='vertical' className="anchorStyle">
                      <SubMenu title={
                        <span >
                          <MoreOutlined style={{ fontSize: '32px', color: 'black' }} />
                        </span>
                      }>
                        <Menu.Item key='authorization' onClick={() => showAuthModal(user)}>Edit Authorizations</Menu.Item>
                        {user.role === 'moderator' && <Menu.Item key='appoint-admin' onClick={() => showAdminModal(user._id)}>Appoint as Admin</Menu.Item>}
                      </SubMenu>
                    </Menu>}
                  </Col>

                  {/* <Col xs={11} sm={11} md={11} lg={11}>
          <Button type='danger' onClick={() => showDeleteUserModal(user._id)} loading={btnLoading}>
            Remove User
          </Button>
          </Col> */}
                </Row>
                <Row className="my-2">
                  <Col xs={3} sm={3} md={2} lg={2}>
                    <MailOutlined style={{ fontSize: '36px', color: 'black', marginLeft: '13px' }} />
                  </Col>
                  <Col xs={11} sm={11} md={11} lg={11}>
                    <Paragraph>{user.email}</Paragraph>
                  </Col>
                  <Col xs={11} sm={11} md={11} lg={11}>
                    {user.authorizations?.length > 0 && <b>Authorizations:</b>}
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col xs={3} sm={3} md={2} lg={2}>
                    <PhoneOutlined style={{ fontSize: '36px', color: 'black', marginLeft: '13px' }} />
                  </Col>
                  <Col xs={11} sm={11} md={11} lg={11}>
                    <Paragraph>{user.phone}</Paragraph>
                  </Col>
                  <Col xs={11} sm={11} md={11} lg={11}>
                    <Row> {user.authorizations?.map((authRole, index) => {
                      return <div key={index}> {authRole === 'hire' ? <Tag color="orange" >Recruit</Tag> : ''} {authRole === 'manage' ? <Tag color="green" >Manage</Tag> : ''}
                      </div>
                    })}</Row>

                  </Col>
                </Row>
              </Card>
            </div>
          })}

        </Col>
        <Col xs={0} sm={0} md={3} lg={3} />

      </Row>
      <Modal className="lg-modal"
        title="Invite a New User"
        visible={inviteModal}
        onOk={handleInviteModalOk}
        onCancel={handleInviteModalCancel}
      >
        <Row>
          <Col xs={24} sm={24} md={10} lg={10} className="my-3">
            Email : <Input type='email' value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          </Col>
          <Col xs={0} sm={0} md={1} lg={1} />

          <Col xs={24} sm={24} md={13} lg={13} className="my-3">
            <b>Authorizations : </b><br />
            <br />
            <Checkbox checked={hireCheckBox} onChange={(e) => onChangeNewUser(e, 'hire')}>Recruit - find and interview candidates</Checkbox><br />
            <Checkbox checked={manageCheckBox} onChange={(e) => onChangeNewUser(e, 'manage')} >Manage - manage payroll</Checkbox>

          </Col>
        </Row>
      </Modal>
      <Modal
        title="Delete User"
        visible={deleteUserModal}
        onOk={handleDeleteUserModalOk}
        onCancel={handleDeleteUserModalCancel}
      >
        <h6>Are you sure to delete this User???</h6>
      </Modal>

      <Modal className="lg-modal"
        title="Edit Authorizations"
        visible={authorizationModal}
        onOk={handleAuthorizationModalOk}
        onCancel={handleAuthorizationModalCancel}
      >
        <Row>

          <Col xs={2} sm={2} md={4} lg={4} />

          <Col xs={20} sm={20} md={16} lg={16} className="my-3">
            <b>Authorizations : </b><br />
            <br />
            <Checkbox checked={hireCheckBox} onChange={(e) => onChangeEditUser(e, 'hire')}>Recruit - find and interview candidates</Checkbox><br />
            <Checkbox checked={manageCheckBox} onChange={(e) => onChangeEditUser(e, 'manage')} >Manage - manage payroll</Checkbox>

          </Col>
          <Col xs={2} sm={2} md={4} lg={4} />

        </Row>
      </Modal>

      <Modal
        title="Appoint as Admin"
        visible={adminModal}
        onOk={handleAdminModalOk}
        onCancel={handleAdminModalCancel}
      >
        <h6>Are you sure to appoint this User as Admin?</h6>
      </Modal>
    </div>
  )
}

export default ManagerUsers;
