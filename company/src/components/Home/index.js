import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Collapse, Button, Typography, Row, Col, Avatar, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { getActivePositions, setSelectedPositionId } from '../../actions/positions'
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getAllCompanyNotifications } from '../../actions/notifications'
import { MOMENT_DATE_FORMAT } from '../../common/constants'

import moment from 'moment'
// import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { UserOutlined, UserAddOutlined } from '@ant-design/icons'
import '../Company/manage_user.scss';
// import CreatePositionModal from "../Recruitment/PositionType/CreatePositionModal"

const { Panel } = Collapse;
const { Paragraph } = Typography

export default function HomePage() {
  const history = useHistory();
  const [positions, setPositions] = useState(null);
  const companyPositions = useSelector(state => state.positions.activePositions);
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const rolesOptions = appConfigs && appConfigs['roles']
  const dispatch = useDispatch()
  const allCompanyNotifications = useSelector(state => state.notifications.allCompanyNotifications);
  const companyUsers = useSelector(state => state.company.companyUsers);
  const user = useSelector(state => state.auth.user);
  const [positionModal, setPositionModal] = useState(false);
  const [haveOneRole, setHaveOneRole] = useState(false);


  useEffect(() => {
    dispatch(getAllCompanyNotifications())
    dispatch(getActivePositions())
  }, [])

  useEffect(() => {
    if (user) {
      if (user?.authorizations.includes("hire") && !(user?.authorizations.includes("manage"))) {
        setHaveOneRole(true)
      } else
        if (user?.authorizations.includes("manage") && !(user?.authorizations.includes("hire"))) {
          setHaveOneRole(true)
        } else {
          setHaveOneRole(false)
        }

    }

  }, [user])
  // console.log('haveOneRole', haveOneRole)
  useEffect(() => {
    let positionsArr = []
    companyPositions && companyPositions.map((pos) => {
      rolesOptions && rolesOptions.filter((role) => {
        if (role._id === pos.name._id) {
          positionsArr.push({
            id: pos._id,
            name: role.name,
            title: pos.title,
            employment: pos.employmentType
          })
        }
      })

    })
    setPositions(positionsArr)
  }, [companyPositions, rolesOptions])
  // console.log('companyPositions', companyPositions)
  // console.log('positions', positions)
  // console.log('companyUsers', companyUsers)

  const goToDetails = (key) => {
    history.push(`/company/hire/recruitment/details/${key}`);
    dispatch(setSelectedPositionId(key))
  }
  const openPositionModal = () => {
    setPositionModal(true)
  };
  const ManageUsersPage = () => {
    history.push(`/company/settings/manage-users`);
  }
  const goToCreatePosition = () => {
    history.push(`/company/hire/position`);
  };

  return (
    <div>
      <Row>
        {(user?.authorizations.includes("hire") || user?.role === 'admin') && <> <Col xs={2} sm={2} md={haveOneRole ? 6 : 1} >
        </Col>
          <Col xs={20} sm={20} md={10} lg={10} className="mx-3">
            <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '40px' }}>
              <h1>Recruit</h1>
              <p>
                Get access to ready to interview talent's
              with pre recorded video interviews and tech talent evaluations.<br />
              while utlizing better coordination with scheduling integration


        </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Collapse style={{ border: '1px solid black' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
              >
                <Panel header="Active Positions" key="1" style={{ border: '1px solid black' }}>
                  <div>
                    {positions?.length === 0 &&
                      <div style={{ textAlign: 'center' }}>
                        {/* <h5>No Positions Found!</h5> */}
                        <h5 className="mb-3">You don't have any active positions</h5>
                        <Button className="my-3" icon={<UserAddOutlined />} onClick={goToCreatePosition}>Post a Position</Button>
                      </div>}
                    {positions && positions.map((pos, index) => {
                      // console.log('position',pos)
                      return <div style={{ margin: '30px 0px', }} key={index} onClick={() => goToDetails(pos?.id)} className='position-heading' >
                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.title}
                        </h6><br />

                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.name}
                        </h6>, &nbsp;

                <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.employment?.name}

                        </h6>

                        <hr style={{ border: '1px solid black' }} />
                      </div>

                    })}
                  </div>

                </Panel>
              </Collapse>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Collapse style={{ border: '1px solid black' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
              >
                <Panel header="Latest Notifications" key="1" style={{ border: '1px solid black' }}>

                  {allCompanyNotifications == null &&
                    <div style={{ textAlign: 'center' }}>
                      <h5>No Notifications Found!</h5>
                    </div>}
                  {allCompanyNotifications && allCompanyNotifications.map((notification, index) => {
                    return (
                      <div
                        key={index}
                        style={{ margin: '25px 15px' }}

                      >
                        <h6>{notification.title}</h6>
                        <Paragraph style={{ marginBottom: '0.5em' }}>{notification.description} <u><Link to={notification.referenceLink}>{notification.referenceTitle}</Link></u></Paragraph>
                        <Paragraph className="my-2" style={{ float: 'right' }}>Date: {moment(notification.updatedAt).format(`${MOMENT_DATE_FORMAT} hh:mm a`)}</Paragraph>
                        <br />
                        <hr style={{ border: '1px solid black' }} />
                      </div>
                    )
                  })}

                </Panel>
              </Collapse>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Collapse style={{ border: '1px solid black' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
              >
                <Panel header="Users" key="1" style={{ border: '1px solid black' }}>
                  <div className="my-3">
                    <Button type="primary"
                      onClick={ManageUsersPage}>Manage Users</Button>
                  </div>
                  {companyUsers && companyUsers.map((user, index) => {


                    return <div key={index} style={{ paddingLeft: '15px', marginBottom: '10px' }}>

                      <Row>
                        <Col xs={6} sm={6} md={4} lg={4}>
                          <Avatar className="user_svg" size={64}
                            src={user?.profileImage &&
                              user?.profileImage?.includes("http")
                              ? user?.profileImage
                              : `/${user?.profileImage}`
                            }
                            icon={<UserOutlined />} />
                        </Col>

                        <Col xs={14} sm={14} md={16} lg={16}>
                          <Paragraph>{user.fullName}, {user.title}</Paragraph>
                          <Paragraph>{user.email}</Paragraph>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                          {user.role === 'admin' && <Tag color="blue">ADMIN</Tag>}

                        </Col>

                      </Row>
                      <hr style={{ border: '1px solid black' }} />

                    </div>
                  })}

                </Panel>
              </Collapse>
            </div>

          </Col>
        </>}
        {(user?.authorizations.includes("manage") || user?.role === 'admin') && <> <Col xs={2} sm={2} md={haveOneRole ? 6 : 1} />

          <Col xs={20} sm={20} md={10} lg={10} className="mx-3">
            <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '40px' }}>
              <h1>Manage</h1>
              <p>
                Employ without the need to open local legal entity
                if you have a local legal entity, we process your employee's payroll, taxes and benefits management.
        </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Collapse style={{ border: '1px solid black' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
              >
                <Panel header="Management summary" key="1" style={{ border: '1px solid black' }}>
                  <div>
                    <div >
                      <h5>Management summary and shortcuts</h5>
                    </div>

                  </div>

                </Panel>
              </Collapse>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Collapse style={{ border: '1px solid black' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
              >
                <Panel header="Latest Notifications" key="1" style={{ border: '1px solid black' }}>

                  {allCompanyNotifications == null &&
                    <div style={{ textAlign: 'center' }}>
                      <h5>No Notifications Found!</h5>
                    </div>}
                  {allCompanyNotifications && allCompanyNotifications.map((notification, index) => {
                    return (
                      <div
                        key={index}
                        style={{ margin: '25px 15px' }}

                      >
                        <h6>{notification.title}</h6>
                        <Paragraph style={{ marginBottom: '0.5em' }}>{notification.description} <u><Link to={notification.referenceLink}>{notification.referenceTitle}</Link></u></Paragraph>
                        <Paragraph className="my-2" style={{ float: 'right' }}>Date: {moment(notification.updatedAt).format(`${MOMENT_DATE_FORMAT} hh:mm a`)}</Paragraph>
                        <br />
                        <hr style={{ border: '1px solid black' }} />
                      </div>
                    )
                  })}

                </Panel>
              </Collapse>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Collapse style={{ border: '1px solid black' }}
                defaultActiveKey={['1']}
                expandIconPosition={'right'}
              >
                <Panel header="Users" key="1" style={{ border: '1px solid black' }}>
                  <div className="my-3">
                    <Button type="primary"
                      onClick={ManageUsersPage}>Manage Users</Button>
                  </div>
                  {companyUsers && companyUsers.map((user, index) => {


                    return <div key={index} style={{ paddingLeft: '15px', marginBottom: '10px' }}>

                      <Row>
                        <Col xs={6} sm={6} md={4} lg={4}>
                          <Avatar className="user_svg" size={64} src={user?.profileImage &&
                            user?.profileImage?.includes("http")
                            ? user?.profileImage
                            : `/${user?.profileImage}`
                          } icon={<UserOutlined />} />
                        </Col>

                        <Col xs={14} sm={14} md={16} lg={16}>
                          <Paragraph>{user.fullName}, {user.title}</Paragraph>
                          <Paragraph>{user.email}</Paragraph>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                          {user.role === 'admin' && <Tag color="blue">ADMIN</Tag>}

                        </Col>

                      </Row>
                      <hr style={{ border: '1px solid black' }} />

                    </div>
                  })}

                </Panel>
              </Collapse>
            </div>

          </Col>

          <Col xs={2} sm={2} md={1} lg={1} >
          </Col> </>}
      </Row>
      {/* <CreatePositionModal positionModal={positionModal} setPositionModal={setPositionModal} /> */}

    </div>
  )
}

