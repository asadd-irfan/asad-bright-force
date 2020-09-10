import React, { useState, useEffect } from "react";
import { Button, Input, Row, Col, notification, Card, Typography } from "antd";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { acceptRejectJobOffer } from '../../actions/invites'
import { errorNotification, successNotification } from "../../common/commonMethods";
import { resetNotificationSetting } from '../../actions/common';
import { clearServerErrors } from '../../actions/auth';

const { Paragraph } = Typography;
const { TextArea } = Input;

function OfferResponse({
  offerDetails,
  companyName,
  recruitmentDetails
}) {

  const history = useHistory();
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.auth.btnLoading)
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const [reason, setReason] = useState('')



  const onAcceptOffer = () => {
    if (reason === '') {
      notification.error({
        message: 'Error',
        description: 'Please input some reason'
      })
    }
    else {
      let obj = {
        "candidateMessage": reason,
        "status": "talent-accepted"
      }
      dispatch(acceptRejectJobOffer(obj, offerDetails))
    }
  }
  const onDeclineOffer = () => {
    if (reason === '') {
      notification.error({
        message: 'Error',
        description: 'Please input some reason'
      })
    }
    else {
      let obj = {
        "candidateMessage": reason,
        "status": "talent-rejected"
      }
      dispatch(acceptRejectJobOffer(obj, offerDetails))
    }

  }


  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }

  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };
  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification]);

  return (
    <div >

      {offerDetails?.status === 'pending' &&
        <div>
          {/* <div style={{ width: 300, textAlign: 'center' }} className="my-3">
            Response
        </div> */}
          <TextArea style={{ width: '90%', margin: 10, border: '2px solid black' }} placeholder="
          Reason for Accept/Decline"
            value={reason} rows={8} onChange={(e) => {
              setReason(e.target.value)
            }} />
          <Row className="my-1">
            <Col xs={11} sm={11} md={11} lg={11} className="m-2 p-2">
              <Button block type="danger" onClick={onDeclineOffer} loading={btnLoading}>DECLINE </Button>
            </Col>
            <Col xs={11} sm={11} md={11} lg={11} className="m-2 p-2">
              <Button block type="primary" onClick={onAcceptOffer} loading={btnLoading}> ACCEPT</Button>
            </Col>
          </Row>
        </div>}
      {offerDetails?.status === 'talent-accepted' && recruitmentDetails?.status === 'short-list' && <>
        <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
          <Paragraph >You have accepted the Job Offer with <b>{companyName}</b>. The company will schedule an interview with you based on your
        calendar availability.
        </Paragraph>

          <div className="mb-3">

          </div>

        </Card>
        {/* <div style={{ width: '90%', margin: 10, textAlign: 'center' }} className="my-2">
          <CheckOutlined style={{
            color: 'green'
          }} /> Applied
  </div> */}
        <Row justify="center" style={{ width: '90%', margin: 10, }} >
          <Button type='primary' style={{ background: "#6AA84F", borderColor: "#6AA84F" }} block >
            Applied
			</Button>

        </Row>

      </>}
      {offerDetails?.status === 'talent-rejected' && recruitmentDetails?.status === 'short-list' && <>
        <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
          <Paragraph >
            You have declined the offer from <b>{companyName}. </b>
              Company may responded with a revised offer.

        </Paragraph>

          <div className="mb-3">

          </div>

        </Card>

        {/* <div style={{ width: '90%', margin: 10, textAlign: 'center' }} className="my-2">
          <CloseOutlined style={{
            color: 'red'
          }} /> Rejected
</div>  */}
        <Row justify="center" style={{ width: '90%', margin: 10, }} >
          <Button type='primary' style={{ background: "#E06666", borderColor: "#E06666" }} block >
            Declined
			</Button>

        </Row>
      </>}

      {/* 
      {recruitmentDetails?.interviewStatus === 'scheduled' && offerDetails?.status === 'talent-accepted' &&
        <>
          <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
            <h5>Your Interview has Been Scheduled:</h5>
            <Paragraph >Interview with <b>{companyName}</b> has been scheduled at <b>{moment(recruitmentDetails?.interviewDate).format('YYYY-MM-DD HH:mm')}</b>, good luck!</Paragraph>
            <Button type='primary' onClick={() => {
              history.push('/talent/calendar')
            }}>
              View Calendar
            </Button>
          </Card>
        </>}
    
      {recruitmentDetails?.interviewStatus === 'pass' &&
        <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
          <Paragraph >You have passed the interview, the company: <b>{companyName}</b> will continue the process internally.
          </Paragraph>
          <div className="mb-3"></div>
        </Card>}

      {recruitmentDetails?.interviewStatus === 'fail' &&
        <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
          <Paragraph >Unfortunately, <b>{companyName}</b> has decided not to continue the hiring process
          </Paragraph>
          <div className="mb-3"></div>
        </Card>}

      {recruitmentDetails?.interviewStatus === 'hired' &&
        <Card style={{ width: '90%', margin: 10, border: '2px solid black' }} >
          <Paragraph > Congratulations, you have been hired! <b>{companyName}</b> will reach out with details.
          </Paragraph>
          <div className="mb-3"></div>
        </Card>} */}


    </div>
  )
}

export default OfferResponse