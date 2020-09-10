import React, { useState, useEffect } from 'react';
import { Menu, Row, Col, Switch, Button, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentNavbarButton } from '../../actions/common';
import { updateAvailabilityStatus } from '../../actions/talent';
import styles from './Navbar.module.scss';
const { Paragraph } = Typography;



export default function SubNavbarButtons() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [status, setStatus] = useState()

  const currentNavbarButton = useSelector(state => state.auth.currentNavbarButton);
  const user = useSelector(state => state.auth.user);
  // console.log('user', user)
  useEffect(() => {
    if (currentNavbarButton === '') {
      if (history?.location?.pathname.includes('calendar')) {
        dispatch(setCurrentNavbarButton('calendar'))
      }
      if (history?.location?.pathname.includes('profile')) {
        dispatch(setCurrentNavbarButton('profile'))
      }
      if (history?.location?.pathname.includes('evaluation')) {
        dispatch(setCurrentNavbarButton('evaluation'))
      }
      if (history?.location?.pathname.includes('invites')) {
        dispatch(setCurrentNavbarButton('invites'))
      }
    }
  }, [])

  useEffect(() => {

    if (user?.availabilityStatus === 'live') {
      setStatus(true)
    }
    else {
      setStatus(false)
    }
  }, [user])

  function onChangeSwitch(checked) {
    let date = new Date()
    if (checked) {
      let obj = {
        availabilityStatus: 'live',
        statusLiveDate: date
      }
      dispatch(updateAvailabilityStatus(obj))
      setStatus(true)

    } else {
      let obj = {
        availabilityStatus: 'inactive',
        statusInactiveDate: date
      }
      dispatch(updateAvailabilityStatus(obj))
      setStatus(false)
    }
  }
  return (
    <Row style={{ margin: '10px' }}>
      <Col xs={16} sm={16} md={16} lg={16}>

        <Button style={{ margin: '10px' }} type={currentNavbarButton === 'profile' ? "primary" : "default"} size='large' onClick={() => {
          history.push('/talent/profile')
          dispatch(setCurrentNavbarButton('profile'))
        }}>
          Profile
        </Button>
        <Button style={{ margin: '10px' }} type={currentNavbarButton === 'evaluation' ? "primary" : "default"} size='large' onClick={() => {
          history.push('/talent/evaluation')
          dispatch(setCurrentNavbarButton('evaluation'))
        }}>
          Evaluations
        </Button>
        <Button style={{ margin: '10px' }} type={currentNavbarButton === 'opportunities' ? "primary" : "default"} size='large' onClick={() => {
          history.push('/talent/opportunities')
          dispatch(setCurrentNavbarButton('opportunities'))
        }}>
          Opportunities
        </Button>
        <Button style={{ margin: '10px' }} type={currentNavbarButton === 'calendar' ? "primary" : "default"} size='large' onClick={() => {
          history.push('/talent/calendar')
          dispatch(setCurrentNavbarButton('calendar'))
        }}>
          Calendar
        </Button>
      </Col>
      <Col xs={0} sm={0} md={4} lg={4} />
      <Col xs={8} sm={8} md={4} lg={4} style={{ textAlign: 'center' }} >
        {user?.profileApproved.status === true && <>
          <Menu mode='horizontal' className={`${styles.anchorStyle}`} style={{ backgroundColor: '#F0F2F5' }} >

            {user && <Menu.SubMenu style={{ border: '1px solid grey', backgroundColor: '#F0F2F5' }} title={<span>{user?.availabilityStatus === 'live' ?
              <Row>
                <span style={{ borderRadius: '50%', backgroundColor: 'green', width: '12px', height: '12px', marginTop: '18px', marginRight: '7px' }}>
                </span>
                <span>Live</span> </Row> :
              <Row>
                <span style={{ borderRadius: '50%', backgroundColor: 'red', width: '12px', height: '12px', marginTop: '18px', marginRight: '7px', marginLeft: '7px' }}>
                </span>
                <span>Inactive</span> </Row>
            }</span>}>
              <Menu.Item key='available' style={{ height: '100%', border: '3px solid black', borderRadius: '25px' }}>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>

                    {user?.availabilityStatus === 'live' && <><Row> <span> You are now       </span>
                      <span style={{ borderRadius: '50%', backgroundColor: 'green', width: '12px', height: '12px', marginTop: '14px', marginRight: '7px', marginLeft: '7px' }}>
                      </span>
                      <span>Live</span> </Row>
                      <Paragraph>
                        You will get new opportunities periodically
                        and will be apply to them
                      </Paragraph>
                      <Paragraph>
                        *If your account is unused for two month
                        your status will automatically become Inactive
                      </Paragraph></>}

                    {user?.availabilityStatus === 'inactive' && <><Row> <span> You are now       </span>
                      <span style={{ borderRadius: '50%', backgroundColor: 'red', width: '12px', height: '12px', marginTop: '14px', marginRight: '7px', marginLeft: '7px' }}>
                      </span>
                      <span>Inactive</span> </Row>
                      <Paragraph>
                        You will not receive new opportunities.
                      </Paragraph>
                      <Paragraph>
                        You may change your status at any time,
                        in order to receive new opportunities
                      </Paragraph></>}

                    <Row> <b className="mx-3">
                      Status :
                      </b> <span> <Switch onChange={onChangeSwitch} checked={status} /></span> </Row>

                  </Col>

                </Row>
              </Menu.Item>


            </Menu.SubMenu>
            }

          </Menu>
        </>}
      </Col>


    </Row>
  );
}

