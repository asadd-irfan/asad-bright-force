import React, { useEffect, useState } from 'react';
import { Avatar, Row, Card, Col, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom"
import axios from 'axios';
import moment from 'moment';
import Sider from "../sidebar";
import { useDispatch } from "react-redux";
import { setAccountManager } from '../../../../../actions/talentManager';
import { MOMENT_DATE_FORMAT } from '../../../../../common/constants';
const { Paragraph } = Typography


function AccountManagerDetails() {
  const dispatch = useDispatch()
  let params = useParams();

  const [managerDetails, setManagerDetails] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('/api/admin/staff/' + params.id);
      // console.log(res)
      if (res?.data?.result) {
        setManagerDetails(res?.data?.result)
        dispatch(setAccountManager(res?.data?.result))
      }

    }
    fetchData();
  }, []);

  const linkedIn = managerDetails?.linkedIn
  const github = managerDetails?.github

  const profilePicURL = managerDetails?.profileImage


  return (
    <Sider>
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        <Card style={{ margin: "8px 0px" }}>
          <Row justify='space-between'>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Avatar shape="square" size={140} src={profilePicURL && `/${profilePicURL}`} icon={<UserOutlined />} />
            </Col>
            <Col xs={24} sm={24} md={18} lg={18}>
              <Row justify='space-between'>
                <Col xs={24} sm={24} md={14} lg={14}>
                  <h2>{managerDetails?.name}</h2>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10}>
                </Col>
              </Row>

              <Row justify='start' className='mt-3'>
                <Col xs={24} sm={24} md={14} lg={14}>
                  <Paragraph className="font-weight-bold"> <b>Email: &nbsp;</b>{managerDetails?.email}</Paragraph >
                </Col>
                <Col xs={24} sm={24} md={14} lg={14}>
                  <Paragraph className="font-weight-bold"> <b>Phone: &nbsp;</b> {managerDetails?.phone}</Paragraph >
                </Col>
                <Col xs={24} sm={24} md={14} lg={14}>
                  <Paragraph className="font-weight-bold"> <b>Place of residence: &nbsp;</b> {managerDetails?.location && managerDetails?.location?.city + ", " + managerDetails?.location?.country}</Paragraph >
                </Col>


              </Row>
            </Col>
          </Row>



          <hr className='font-weight-bold hr-line' />
          <Row justify='center'>

            {
              managerDetails?.linkedIn && <Col xs={6} sm={6} md={4} lg={4}>
                <a target='_blank' rel="noopener noreferrer" style={{ color: 'blue' }} href={linkedIn && linkedIn}>LinkedIn</a>
              </Col>
            }
            {
              managerDetails?.github && <Col xs={6} sm={6} md={4} lg={4}>
                <a target='_blank' rel="noopener noreferrer" style={{ color: 'blue' }} href={github && github}>GitHub</a>
              </Col>
            }
            <Col xs={4} sm={4} md={6} lg={6}></Col>

            <Col xs={8} sm={8} md={6} lg={6}>
              <Paragraph className="font-weight-bold"> <b>Registered On: &nbsp;</b> {moment(managerDetails?.createdAt).format(MOMENT_DATE_FORMAT)}</Paragraph>

            </Col>
          </Row>
        </Card>

      </div>
    </Sider>
  )
}

export default AccountManagerDetails;
