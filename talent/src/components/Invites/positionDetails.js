import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, Avatar, Tag, Timeline, Button, Modal } from "antd";
import OfferResponse from "./OfferResponse";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { getOfferDetailOfInvite, getPositionDetailOfInvite, getInterviewDetailsById, getRecruitmentDetailsById } from '../../actions/invites'
import {
  LinkedinFilled,
  GlobalOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  InfoCircleFilled,
  MailOutlined,
  EditOutlined,
  CalendarOutlined,
  SmileFilled,
  FrownFilled,
  UserOutlined,
} from "@ant-design/icons";
import moment from 'moment';
import { useHistory } from 'react-router-dom'
import { MOMENT_DATE_FORMAT } from '../../common/constants'

const { Title, Paragraph } = Typography;

function PositionDetails() {
  const dispatch = useDispatch();
  let { id } = useParams();
  const history = useHistory();
  let offerId = id
  const inviteOfferDetails = useSelector(state => state.invites.inviteOfferDetails)
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const currencyOptions = appConfigs && appConfigs['currency']
  const positionOfferOptions = appConfigs && appConfigs['position-offer']
  const positionFeatureOptions = appConfigs && appConfigs['role-features']
  const recruitmentDetails = useSelector(state => state.invites.recruitmentDetails);
  const interviewDetails = useSelector(state => state.invites.interviewDetails);
  const invitePositionDetails = useSelector(state => state.invites.invitePositionDetails)
  const [skills, setSkills] = useState([])
  const [roleFeatures, setRoleFeatures] = useState([])
  const [signingBonus, setSigningBonus] = useState()
  const [equity, setEquity] = useState()
  const skillsOptions = appConfigs && appConfigs['skills']
  const [showInterviewModal, setInterviewModal] = useState(false)

  useEffect(() => {
    dispatch(getOfferDetailOfInvite(offerId))
  }, [])

  useEffect(() => {
    let selectedSkills = [];
    let positionSkills = invitePositionDetails?.skills;
    if (positionSkills) {
      positionSkills.map(skill => {
        let res = skillsOptions && skillsOptions.find(el => el._id == skill);
        selectedSkills.push(res);
        return res;
      })
      setSkills(selectedSkills)
    }
    let selectedFeatures = [];
    let positionFeatures = invitePositionDetails?.positionFeatures;
    if (positionFeatures) {
      positionFeatures.map(item => {
        let res = positionFeatureOptions && positionFeatureOptions.find(el => el._id == item.feature);
        selectedFeatures.push(res);
        return res;
      })
      setRoleFeatures(selectedFeatures)
    }

    if (positionOfferOptions?.length > 0 && inviteOfferDetails?.equity) {
      const equityObj = positionOfferOptions.find(element => element._id === inviteOfferDetails?.equity);
      setEquity(equityObj.name)
    }
    if (positionOfferOptions?.length > 0 && inviteOfferDetails?.signingBonus) {
      const signingBonusObj = positionOfferOptions.find(element => element._id === inviteOfferDetails?.signingBonus);
      setSigningBonus(signingBonusObj.name)
    }

  }, [invitePositionDetails, skillsOptions, positionFeatureOptions, positionOfferOptions])

  useEffect(() => {
    if (inviteOfferDetails) {
      let positionId = inviteOfferDetails?.position
      dispatch(getPositionDetailOfInvite(positionId))
      dispatch(getRecruitmentDetailsById(inviteOfferDetails?.recruitmentId))
    }
  }, [inviteOfferDetails])

  useEffect(() => {
    let interviewId = recruitmentDetails?.interviewId
    if (interviewId) {
      dispatch(getInterviewDetailsById(interviewId))
    }
  }, [recruitmentDetails])
  // console.log('invitePositionDetails', invitePositionDetails)

  const OpenInterviewModal = () => {
    setInterviewModal(true)
  }
  const handleInterviewModalCancel = () => {
    setInterviewModal(false)
  }




  return (
    <div>
      <Row className="my-5">
        <Col xs={0} sm={0} md={1} lg={1} />

        <Col xs={24} sm={24} md={8} lg={8} className="m-1 p-2">
          <Timeline>
            <Timeline.Item dot={<InfoCircleFilled style={{ fontSize: 26 }} />}  >
              <h2 className="m-2"> General Information</h2>
              <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
                <Paragraph >Take note that salary and salary elements are still negotiable
                if you are interested accept the company request for an interview
companies appreciate a response in 48 hours. </Paragraph>

                <Paragraph>if you are interested but not content with the proposed terms, use the text box below to request the company for a revised offer.
            </Paragraph>
                <Paragraph>
                  note: the system will automatically decline if no response has been given within 7 days.
            </Paragraph>
                <Link to='/talent/calendar'>
                  <Row>

                    <Button block type="primary">
                      Set Interview Availability
                  </Button>
                  </Row>
                </Link>


              </Card>
            </Timeline.Item>
            {recruitmentDetails?.status === 'short-list' && <> <Timeline.Item dot={<MailOutlined style={{ fontSize: 26 }} />}  >
              <h2 className="m-2">Personal Note</h2>
              <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
                <Paragraph >

                  lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                  non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                   </Paragraph>




              </Card>
            </Timeline.Item>
              <Timeline.Item dot={<EditOutlined style={{ fontSize: 26 }} />}  >
                <h2 className="m-2"> Your Response</h2>

                <OfferResponse recruitmentDetails={recruitmentDetails} offerDetails={inviteOfferDetails} companyName={invitePositionDetails?.companyId?.name} />
              </Timeline.Item>
            </>}
            {recruitmentDetails?.status === 'interview' && <Timeline.Item dot={<CalendarOutlined style={{ fontSize: 26 }} />}  >
              <h2 className="m-2">Interview Scheduled</h2>
              <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
                <h5>Your Interview has Been Scheduled:</h5>
                <Paragraph >Interview with company: <b>{invitePositionDetails?.companyId?.name}</b> has been scheduled at <b>{moment(recruitmentDetails?.interviewDetails?.startTime).format(`${MOMENT_DATE_FORMAT} hh:mm a`)}</b>, good luck!</Paragraph>

                <Row>

                  <Button type='primary' block
                    onClick={() => OpenInterviewModal()}
                  >
                    View Interview Details
            </Button>
                </Row>


              </Card>
            </Timeline.Item>}
            {(recruitmentDetails?.interviewStatus === 'pass' || recruitmentDetails?.interviewStatus === 'hired') && <Timeline.Item dot={<SmileFilled style={{ fontSize: 26 }} />}  >
              <h2 className="m-2">Interview Passed</h2>
              <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
                <Paragraph >

                  <b>Congratulations!</b>
                  You have passed the interview with  <b>{invitePositionDetails?.companyId?.name} </b>.
                  Company will continue the process internally.
                   </Paragraph>





              </Card>
            </Timeline.Item>}
            {recruitmentDetails?.interviewStatus === 'fail' && <Timeline.Item dot={<FrownFilled style={{ fontSize: 26 }} />}  >
              <h2 className="m-2">Interview Failed</h2>
              <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
                <Paragraph >

                  Unfortunately, <b> {invitePositionDetails?.companyId?.name}</b>
                    has decided not to continue the hiring process
                   </Paragraph>



              </Card>
            </Timeline.Item>}
            {recruitmentDetails?.interviewStatus === 'hired' && <Timeline.Item dot={<UserOutlined style={{ fontSize: 26 }} />}  >
              <h2 className="m-2">Hired</h2>
              <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
                <Paragraph >

                  Congratulations, you have been hired!
                  Please continue your hire process on the <u >payroll section </u>
                  <b>{invitePositionDetails?.companyId?.name} </b>will reach out with details
                   </Paragraph>




              </Card>
            </Timeline.Item>}
          </Timeline>

        </Col>
        <Col xs={0} sm={0} md={1} lg={1} />

        <Col xs={24} sm={24} md={13} lg={13}>

          <Row className="my-5">
            <Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'center' }}>
              <Avatar size={120} src={invitePositionDetails?.companyId?.logo.includes('http') ? invitePositionDetails?.companyId?.logo : `/${invitePositionDetails?.companyId?.logo}`}
              />
            </Col>
            <Col xs={18} sm={18} md={18} lg={18}>

              <div className="evaluation-title">
                <Row>
                  <Title className="mt-2" style={{ color: '#085394' }} level={3}>{invitePositionDetails?.title} </Title>
                  <Tag style={{ margin: '12px' }} color="blue">{invitePositionDetails?.employmentType?.name}</Tag>
                </Row>

                <Row>
                  <Title className="mt-2" level={4}> {invitePositionDetails?.companyId?.name}</Title>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1d7dd4" }}
                    href={invitePositionDetails?.companyId?.linkedIn}
                  >
                    {" "}
                    <LinkedinFilled className="m-2" style={{ fontSize: 26 }} />{" "}
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1d7dd4" }}
                    href={invitePositionDetails?.companyId?.website}
                  >
                    {" "}
                    <GlobalOutlined className="m-2" style={{ fontSize: 26 }} />{" "}
                  </a>


                </Row>
                {/* <Paragraph >Location:  <b>{invitePositionDetails?.companyId?.location}</b></Paragraph> */}
                {/* <Paragraph >Engagement:  <b>{invitePositionDetails?.employmentType?.name}</b></Paragraph> */}

              </div>
            </Col>
          </Row>
          <Row className="my-4 p-2">
            <Row >
              <Title className="mt-2" style={{ color: '#085394' }} level={3}>About {invitePositionDetails?.companyId?.name} </Title>


            </Row>
            <p>
              {invitePositionDetails?.companyId?.about}
            </p>
          </Row>
          <Row className="my-3 p-2">
            <Col xs={4} sm={4} md={4} lg={4} />
            <Col xs={8} sm={8} md={8} lg={8}>
              <h5>Company Size</h5>
              <p>{invitePositionDetails?.companyId?.size?.name}</p>

            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <h5>Location</h5>
              <p>{invitePositionDetails?.companyId?.location}</p>


            </Col>

          </Row>
          <Row className="my-2 p-2">
            <Col xs={8} sm={8} md={8} lg={8} />
            <Col xs={8} sm={8} md={8} lg={8} >
              <h5>Industry</h5>
              <p>
                {invitePositionDetails?.companyId?.industries && invitePositionDetails?.companyId?.industries.map((industry, index) => (
                  <span key={index}>{index > 0 && ','} {industry.name} </span>
                ))}
              </p>

            </Col>

          </Row>

          <Row className="my-3 p-2">
            <Col xs={12} sm={12} md={12} lg={12}>
              <h6>Company Value</h6>
              <p>{invitePositionDetails?.companyId?.companyValues && invitePositionDetails?.companyId?.companyValues.map((value, index) => (
                <Tag key={index}> {value.name} </Tag>
              ))}</p>

            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h6>Company Features</h6>
              <p>{invitePositionDetails?.companyId?.companyFeatures && invitePositionDetails?.companyId?.companyFeatures.map((item, index) => (
                <Tag key={index}> {item.name} </Tag>
              ))}</p>

            </Col>

          </Row>

          <Row className="my-4 p-2">
            <Title level={2}>Position Details</Title>
          </Row>
          <Row className="my-1 p-2">

            <Col xs={24} sm={24} md={24} lg={24}>
              <Title level={4}>Required Skills </Title>

              <Paragraph >
                {skills.map((skill, index) => {
                  return <span key={index}>{index > 0 && ','} {skill.name}</span>
                })}
              </Paragraph>

            </Col>
          </Row>

          {invitePositionDetails?.managementExperience?.status && <Row className="my-1 p-2">

            <Col xs={24} sm={24} md={20} lg={20}>

              <Title level={4}>Required Management Experience</Title>
              <Paragraph >
                {invitePositionDetails?.managementExperience?.yearsOfExperience} years
              </Paragraph>

            </Col>
          </Row>}
          <Row className="my-1 p-2">

            <Col xs={24} sm={24} md={20} lg={20}>

              <Title level={4}>Main Responsibilities</Title>
              <Paragraph >
                {invitePositionDetails?.mainResponsibilities}
              </Paragraph>

            </Col>
          </Row>
          <Row className="my-1 p-2">

            <Col xs={24} sm={24} md={24} lg={24}>
              <Title level={4}>Position Features </Title>

              <Paragraph >
                {roleFeatures.map((feature, index) => {
                  return <span key={index} className="m-2"><CheckOutlined className="m-2" />{feature.name}</span>
                })}
              </Paragraph>

            </Col>
          </Row>

          <Row className="my-3 p-2">
            <Title level={2}>This Position Offers</Title>
          </Row>

          <Row className="p-2">

            <Col xs={24} sm={24} md={20} lg={20}>

              <div >

                <Row className="m-2">
                  <Col xs={3} sm={3} md={2} lg={2}>
                    <CheckCircleOutlined style={{ fontSize: 28 }} />
                  </Col>
                  <Col xs={21} sm={21} md={22} lg={22}>
                    <b>A salary of {inviteOfferDetails?.salary} {currencyOptions && currencyOptions.map((currency, index) => {
                      if (currency._id === inviteOfferDetails?.currency) {
                        return <span key={index}>{currency.name} </span>
                      }
                    })} / year</b>
                  </Col>
                </Row>

                {equity === 'Offered' && <Row className="m-2">
                  <Col xs={3} sm={3} md={2} lg={2}>
                    <CheckCircleOutlined style={{ fontSize: 28 }} />
                  </Col>
                  <Col xs={21} sm={21} md={22} lg={22}>
                    <b>Equity Options</b>
                  </Col>
                </Row>}
                {inviteOfferDetails?.performanceBonus > 0 && <Row className="m-2">
                  <Col xs={3} sm={3} md={2} lg={2}>
                    <CheckCircleOutlined style={{ fontSize: 28 }} />
                  </Col>
                  <Col xs={21} sm={21} md={22} lg={22}>
                    <b>Performance Bonus of {inviteOfferDetails?.performanceBonus}{inviteOfferDetails?.performanceBonus ? inviteOfferDetails?.performanceBonus === 0 ? '' : '%' : '%'}</b>
                  </Col>
                </Row>}

                {signingBonus === 'Offered' && <Row className="m-2">
                  <Col xs={3} sm={3} md={2} lg={2}>
                    <CheckCircleOutlined style={{ fontSize: 28 }} />
                  </Col>
                  <Col xs={21} sm={21} md={22} lg={22}>
                    <b>A Signing Bonus</b>
                  </Col>
                </Row>}


              </div>
            </Col>
          </Row>




        </Col>


      </Row>
      <Modal
        title="Interview Details"
        onCancel={handleInterviewModalCancel}
        visible={showInterviewModal}
        footer={null}
        style={{ top: 20 }}
      >
        <Row className="m-2">
          <h4>Interview with {invitePositionDetails?.companyId?.name}</h4>

        </Row>
        <Row className="m-2">
          <h6>Position Title: {invitePositionDetails?.title}</h6>

        </Row>
        <Row className="m-2">
          <b >Your interview is scheduled on {moment(interviewDetails?.startTime).format(MOMENT_DATE_FORMAT)} at {moment(interviewDetails?.startTime).format('hh:mm a')}</b>

        </Row>
        <Row className="my-4 mx-2">
          <h6>Company Contact Details:</h6>

        </Row>



        <Row className="m-2">
          <Col span={5}>
            <Avatar size={50} icon={<img src={
              invitePositionDetails?.positionCreatedBy?.profileImage.includes("http")
                ? invitePositionDetails?.positionCreatedBy?.profileImage
                : `/${invitePositionDetails?.positionCreatedBy?.profileImage}`
            } width='90px' height='80px' />}
            />
          </Col>
          <Col span={18} className="mt-3">
            <h6>{invitePositionDetails?.positionCreatedBy?.fullName}, {invitePositionDetails?.positionCreatedBy?.title}</h6>
          </Col>
        </Row>
        <Row className="m-2">
          <Col span={5} style={{ marginLeft: 5 }}>
            <MailOutlined style={{ fontSize: 40 }} />

          </Col>
          <Col span={18} className="mt-2">
            <h6>{invitePositionDetails?.positionCreatedBy?.email} </h6>
          </Col>
        </Row>

        <div>
          {interviewDetails !== null ?
            <div>
              <>
                <div style={{ marginTop: '5px', padding: '10px', borderTop: '1px solid' }}>



                  <Row className="m-2">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <b>Format</b><br />
                      {interviewDetails?.format}


                    </Col>

                    <Col xs={12} sm={12} md={12} lg={12}>
                      <b>Duration</b><br />
                      {interviewDetails?.duration}

                    </Col>

                  </Row>

                  <Row className="m-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <b>Meeting Details</b>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {interviewDetails?.meetingDetails}
                    </Col>
                  </Row>
                  <Row className="m-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <b>Notes</b>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {interviewDetails?.notes}
                    </Col>
                  </Row>
                  <Row justify='center' className="my-5">
                    <Button
                      type='primary'
                      block
                      onClick={() => {
                        history.push('/talent/calendar')
                      }}
                    >
                      View Meetings on Calendar
					</Button>
                  </Row>

                </div>

              </>
            </div>
            : <h6>Loading...</h6>
          }
        </div>


      </Modal>
    </div>
  )
}

export default PositionDetails