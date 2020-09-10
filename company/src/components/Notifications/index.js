import React, { Fragment, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllCompanyNotifications } from '../../actions/notifications'
import { MOMENT_DATE_FORMAT } from '../../common/constants'
import '@ant-design/compatible/assets/index.css';
import './notifications.scss';
import moment from 'moment'
import { Link } from 'react-router-dom';

const { Paragraph } = Typography
const Notifications = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const allCompanyNotifications = useSelector(state => state.notifications.allCompanyNotifications);

  useEffect(() => {
    dispatch(getAllCompanyNotifications())
  }, [])


  return (
    <Row>

      <Col xs={24} sm={24} md={24} lg={24}>
        {/* <div style={{ padding: '25px 15px' }}> */}
        <div className="mb-5" style={{ textAlign: 'center' }}>
          <h2>Notifications</h2>
        </div>
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
        {/* </div> */}
      </Col>


    </Row>
  );
}
export default Notifications;

