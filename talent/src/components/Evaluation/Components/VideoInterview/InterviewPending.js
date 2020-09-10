import React, { useEffect } from "react";
import "../evaluation.scss";
import { Typography, Row, Col, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  clearServerErrors
} from "../../../../actions/auth";
import { resetNotificationSetting } from '../../../../actions/common';
import { errorNotification, successNotification } from "../../../../common/commonMethods";
import meetingPic from "../../../../assets/img/meetingPic.png";

const { Paragraph } = Typography;

function InterviewPending(props) {

  const serverErrors = useSelector(state => state.auth.serverErrors);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const showSuccessNotification = useSelector(
    state => state.auth.showSuccessNotification
  );
  const videoInterview = useSelector(state => state.auth.evaluationDetails.data.videoInterview);

  const dispatch = useDispatch();

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification]);

  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };

  return (
    <div className="evaluation-container">

      <div className="welcome-info-paragraph mt-5">
        <Row>
          {/* <Col xs={24} sm={24} md={12} lg={12}>
            <img src={meetingPic} alt={'meetingPic'} />
          </Col> */}
          <Col xs={24} sm={24} md={24} lg={24} className="my-4" style={{ textAlign: 'center' }}>
            <Paragraph style={{ fontWeight: 'bold', marginTop: '10px' }}>One Sided Video Interview</Paragraph>
            <Paragraph style={{ marginTop: '10px' }}>
              Adding a video increases your chances of getting hired by 71% ! it is your way of showing future remote employers a little bit about yourself, enhance your digital brand and show the person behind the CV.
              </Paragraph>
            <Paragraph style={{ marginTop: '10px' }}>Interview tips and FAQ  <u><a target='_blank' rel="noopener noreferrer">Brightforce video interview FAQ</a></u></Paragraph>
            {videoInterview?.videoLink && <Button type='primary' ><a href={videoInterview.videoLink && videoInterview.videoLink} target='_blank' rel="noopener noreferrer">Start Your Video Interview Now </a></Button>

            }</Col>
        </Row>
      </div>

    </div>
  );
}

export default InterviewPending;
