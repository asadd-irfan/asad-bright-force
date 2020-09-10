import React, { useState } from 'react';
import { Button, Modal, Input, notification, Col, Row, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router";
import '../../companies.scss'
import { inviteNewUserToCompany, deleteCompanyUser } from '../../../../../../actions/company';
const { Paragraph } = Typography;

function ManagerUsers() {
  let { id } = useParams();

  const dispatch = useDispatch();
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [inviteModal, setInviteModal] = useState(false)
  const [deleteUserModal, setDeleteUserModal] = useState(false)
  const mailToken = useSelector(state => state.auth.inviteMailToken);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const companyUsers = useSelector(state => state.company.companyUsers);

  const showInviteNewUserModal = () => {
    setInviteModal(true);
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
        let obj = {
          email: inviteEmail
        }
        dispatch(inviteNewUserToCompany(obj, id));
        setInviteModal(false);
        setInviteEmail('')
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


  return (
    <div style={{ padding: '25px 15px' }}>
      <Row>
        <Col xs={0} sm={0} md={3} lg={3} />
        <Col xs={24} sm={24} md={18} lg={18}>

          <div style={{ margin: '30px 20px' }}>
            <Button type='primary' onClick={showInviteNewUserModal} loading={btnLoading}>
              Invite a New User
      </Button>
          </div>


          <div className='text-center' style={{ margin: '30px 20px', wordWrap: 'break-word' }}>
            {mailToken && <>
              <strong>URL: </strong> {mailToken && mailToken}
            </>}
          </div>

          {companyUsers && companyUsers.map((user, index) => {
            return <div key={index} style={{ borderLeft: '2px solid', paddingLeft: '15px', marginBottom: '25px' }}>

              <Row>
                <Col xs={3} sm={3} md={2} lg={2}>
                  <UserOutlined style={{ fontSize: '26px' }} />
                </Col>
                <Col xs={10} sm={10} md={11} lg={11}>
                  <Paragraph>{user.fullName}, {user.title.name}</Paragraph>
                </Col>
                <Col xs={11} sm={11} md={11} lg={11}>
                  <Button type='danger' onClick={() => showDeleteUserModal(user._id)} loading={btnLoading}>
                    Remove User
          </Button>
                </Col>
              </Row>
              <Row>
                <Col xs={3} sm={3} md={2} lg={2}>
                  <MailOutlined style={{ fontSize: '26px' }} />
                </Col>
                <Col xs={21} sm={21} md={21} lg={21}>
                  <Paragraph>{user.email}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={3} sm={3} md={2} lg={2}>
                  <PhoneOutlined style={{ fontSize: '26px' }} />
                </Col>
                <Col xs={21} sm={21} md={21} lg={21}>
                  <Paragraph>{user.phone}</Paragraph>
                </Col>
              </Row>
            </div>
          })}

        </Col>
        <Col xs={0} sm={0} md={3} lg={3} />

      </Row>
      <Modal
        title="Invite User"
        visible={inviteModal}
        onOk={handleInviteModalOk}
        onCancel={handleInviteModalCancel}
      >
        <h6>Add a new user to this company</h6>
        Email : <Input type='email' value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
      </Modal>
      <Modal
        title="Delete User"
        visible={deleteUserModal}
        onOk={handleDeleteUserModalOk}
        onCancel={handleDeleteUserModalCancel}
      >
        <h6>Are you sure to delete this User???</h6>
      </Modal>

    </div>
  )
}

export default ManagerUsers;
