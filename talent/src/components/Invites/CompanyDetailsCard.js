import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Avatar } from 'antd';
import { CheckOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setCurrentNavbarButton } from '../../actions/common';
import { loadAppConfigs } from '../../actions/auth';
import moment from 'moment';
import axios from 'axios';
import { MOMENT_DATE_FORMAT } from '../../common/constants'

function CompanyDetailsCard({
  inviteDetails,
  positionDetails
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const currencyOptions = appConfigs && appConfigs['currency']
  const positionOfferOptions = appConfigs && appConfigs['position-offer']
  const [recruitmentDetails, setRecruitmentDetails] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('/api/talent/recruitment/' + inviteDetails?.recruitmentId);
      if (res?.data?.result) {
        let recruitment = res?.data?.result
        setRecruitmentDetails(recruitment)
      }

    }
    fetchData();
  }, [inviteDetails]);
  console.log('recruitmentDetails', recruitmentDetails)
  useEffect(() => {
    dispatch(loadAppConfigs())
  }, [])
  return (<>
    <div style={{
      border: '1px solid',
      margin: '15px',
      // textAlign: 'center',
      paddingTop: '20px',
      backgroundColor: 'white',
      width: '380px'
    }}>
      <Row justify="center" className="m-2">
        <Avatar size={100} src={positionDetails?.companyId?.logo.includes('http') ? positionDetails?.companyId?.logo : `/${positionDetails?.companyId?.logo}`}
        // src={`/${positionDetails?.companyId?.logo}`} 

        />
      </Row>
      <Row justify="center" className="m-2">
        <h3>{positionDetails?.title}</h3>

      </Row>
      <Row justify="center" className="m-2">
        <h4>{positionDetails?.companyId?.name}</h4>

      </Row>
      <br />
      <Row className="m-2">
        <Col span={2} />
        <Col span={10}>
          <h5>Engagement</h5>
          <p>{positionDetails?.employmentType?.name}</p>

        </Col>
        <Col span={12}>
          <h5>Industry</h5>
          <p>
            {positionDetails?.companyId?.industries && positionDetails?.companyId?.industries.map((industry, index) => (
              <span key={index}>{index > 0 && ','} {industry.name} </span>
            ))}
          </p>
        </Col>

      </Row>

      {/* <br />
      <h6>Location</h6>
      <p>{positionDetails?.companyId?.location}</p>


      <br />
      <h6>Company Tech Stack</h6>
      <p>
        {positionDetails?.companyId?.technologiesUsed && positionDetails?.companyId?.technologiesUsed.map((tech, index) => (
          <span key={index}>{index > 0 && ','} {tech.name} </span>
        ))}
      </p>

      <br />
      <h6>Company Size</h6>
      <p>{positionDetails?.companyId?.size?.name}</p>

      <br />
      <h6>Industry</h6>
      <p>
        {positionDetails?.companyId?.industries && positionDetails?.companyId?.industries.map((industry, index) => (
          <span key={index}>{index > 0 && ','} {industry.name} </span>
        ))}
      </p> */}



      <br />
      <div>
        <Row justify="center" className="m-2" >
          <h5>Top Benefits</h5>
        </Row>
        <div style={{ textAlign: "left", margin: 10 }}>
          <Row>
            <div>
              <div style={{ marginTop: '5px', padding: '10px' }}>
                {positionDetails?.companyId?.companyFeatures && positionDetails?.companyId?.companyFeatures.map((benefit, index) => (

                  <Row key={index}>
                    <Col xs={4} sm={4} md={4} lg={4}>
                      <CheckOutlined />
                    </Col>
                    <Col xs={20} sm={20} md={20} lg={20}>
                      <p>{benefit.name}</p>
                    </Col>
                  </Row>
                ))}


              </div>
            </div>
          </Row>
        </div>
      </div>
      <br />






      <Row justify="center" className="m-2" >
        <h5>Position Offer Details</h5>
      </Row>

      <div style={{ textAlign: "center", marginTop: '5px', padding: '10px' }}>

        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            Salary
					</Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {inviteDetails?.salary}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            Currency
				</Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {currencyOptions && currencyOptions.map((currency, index) => {
              if (currency._id === inviteDetails?.currency) {
                return <span key={index}>{currency.name} </span>
              }

            })}
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            Equity
				</Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {positionOfferOptions && positionOfferOptions.map((pos, index) => {
              if (pos._id === inviteDetails?.equity) {
                return <span key={index}>{pos.name} </span>
              }

            })}
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            Performance Bonus
				</Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {inviteDetails?.performanceBonus} {inviteDetails?.performanceBonus && '%'}

          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            Sign Bonus
				</Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {positionOfferOptions && positionOfferOptions.map((pos, index) => {
              if (pos._id === inviteDetails?.signingBonus) {
                return <span key={index}>{pos.name} </span>
              }

            })}
          </Col>
        </Row>

      </div>



      {recruitmentDetails?.shortListStatus === 'pending' && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          <b>{positionDetails?.companyId?.name}</b> has made you an offer and requested to interview you!
    </div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#597EAA", borderColor: "#597EAA" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Apply Now
			</Button>

        </Row>
      </>}
      {recruitmentDetails?.shortListStatus === 'accepted' && recruitmentDetails?.interviewStatus === undefined && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          You have applied to this position, you will be notified when the company <b>{positionDetails?.companyId?.name}</b> schedules an interview on your calendar available time slots {<Button type='link' onClick={() => {
            history.push('/talent/calendar')
            dispatch(setCurrentNavbarButton('calendar'))
          }}>
            View Calendar
            </Button>}.
			</div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#6AA84F", borderColor: "#6AA84F" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Applied
			</Button>

        </Row>

      </>}
      {recruitmentDetails?.shortListStatus === 'rejected' && recruitmentDetails?.interviewStatus === undefined && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          You have declined the offer from  <b>{positionDetails?.companyId?.name}</b>.
          Company may responded with a revised offer.
			</div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#E06666", borderColor: "#E06666" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Declined
			</Button>

        </Row>
      </>}
      {(recruitmentDetails?.interviewStatus === 'scheduled' || recruitmentDetails?.interviewStatus === 'time-passed') && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          Your Interview with <b>{positionDetails?.companyId?.name}</b> has been scheduled.

        Your Interview is scheduled to:
        Date: {moment(recruitmentDetails?.interviewDetails?.startTime).format(MOMENT_DATE_FORMAT)}, Time: {moment(recruitmentDetails?.interviewDetails?.startTime).format('hh:mm a')}, good luck! <u>{<Button type='link' onClick={() => {
            history.push('/talent/calendar')
            dispatch(setCurrentNavbarButton('calendar'))
          }}>
            View Calendar
            </Button>} </u>
        </div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#6AA84F", borderColor: "#6AA84F" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Interview Scheduled
			</Button>

        </Row>
      </>}
      {recruitmentDetails?.interviewStatus === 'pass' && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          You have passed the interview, the company: <b>{positionDetails?.companyId?.name}</b>  will continue the recruitment process internally, should you be hired you will be able to continue the hire process on the payroll section
			</div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#6AA84F", borderColor: "#6AA84F" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Interview Passed
			</Button>

        </Row>
      </>}
      {recruitmentDetails?.interviewStatus === 'fail' && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          Unfortunately, <b>{positionDetails?.companyId?.name}</b> has decided to discontinue the hiring process

				</div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#E06666", borderColor: "#E06666" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Interview Failed
			</Button>

        </Row>
      </>}
      {recruitmentDetails?.interviewStatus === 'hired' && <>
        <div style={{
          border: '1px solid',
          padding: '15px',
          margin: '15px'
        }}>
          Congratulations, you have been hired!
          Please continue your hire process on the <u>payroll section.</u><br />
          Company: <b>{positionDetails?.companyId?.name}</b> will reach out with details


    </div>
        <Row justify="center" className="mt-3">
          <Button type='primary' style={{ background: "#6AA84F", borderColor: "#6AA84F" }} block onClick={() => {
            history.push('/talent/opportunities-details/' + inviteDetails?._id)
          }}>
            Hired
			</Button>
        </Row>
      </>
      }

    </div>
  </>
  );
}

export default CompanyDetailsCard;
