import React, { Fragment, useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getPositionNotifications } from '../../../actions/notifications'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { MOMENT_DATE_FORMAT } from '../../../common/constants'

const { Paragraph } = Typography;

function AccountManagerCard({
  positionId
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const allPositionNotifications = useSelector(state => state.notifications.allPositionNotifications);

  useEffect(() => {
    dispatch(getPositionNotifications(positionId))
  }, [])



  return (
    allPositionNotifications && allPositionNotifications.length > 0 ? <div style={{ border: '2px solid black', borderRadius: '5px', margin: '20px 0px' }}>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center', borderBottom: '2px solid black' }}>
          <h6 style={{ margin: '18px 0px' }}>Latest Messages</h6>
        </Col>
      </Row>

      <Fragment>
        <Row>

          <Col xs={24} sm={24} md={24} lg={24}>
            <div style={{ padding: '25px 15px' }}>
              {allPositionNotifications && allPositionNotifications.map((notification, index) => {
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
            </div>
          </Col>

        </Row>
      </Fragment>

    </div>
      : <div></div>
  )
}


export default AccountManagerCard
