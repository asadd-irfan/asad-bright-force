import React, { useState, useEffect } from "react";

import { Typography, Row, Col } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import WelcomeDeveloper from "./Welcome/WelcomeDeveloper";
import ProfileSubmitted from "./Welcome/ProfileSubmitted";
import WelcomeNonDeveloper from "./Welcome/WelcomeNonDeveloper";
import InterviewPending from "./VideoInterview/InterviewPending";
import InterviewPassed from "./VideoInterview/InterviewPassed";
import InterviewFailed from "./VideoInterview/InterviewFailed";
import { loadAppConfigs } from "../../../actions/auth";

import "./evaluation.scss";

import { getTalentEvaluation } from "../../../actions/evaluation";

import { useSelector, useDispatch } from "react-redux";

const { Title, Paragraph } = Typography

function Evaluation() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);
  const evaluationDetails = useSelector(state => state.auth.evaluationDetails);
  const [currentStep, setCurrentStep] = useState("");
  const [isEvaluationErrorMessage, setEvaluationErrorMessage] = useState(false);
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);
  const [activeProfileOutlined, setActiveProfileOutlined] = useState(1);

  const [secondBoxValue, setSecondBoxValue] = useState('Pending');
  const [secondBoxColor, setSecondBoxColor] = useState('orange');

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);

  useEffect(() => {
    if (user && user.profileApproved.status && user.profileApproved.approveDate) {
      dispatch(getTalentEvaluation())
    }
    else {
      setEvaluationErrorMessage(true);
      if (user && user.currentStatus === 'profile-submitted-for-approval') {
        setIsProfileSubmitted(true)
      }
    }

  }, []);

  useEffect(() => {
    if (user && user.currentStatus === 'profile-submitted-for-approval') {
      setIsProfileSubmitted(true)
    }
  }, [user]);

  useEffect(() => {
    if (user && !user.isDeveloper && user.currentStatus === 'profile-completed') {
      setCurrentStep('welcomeNonDeveloper')
    }
    else if (user && user.isDeveloper && user.currentStatus === 'profile-completed') {
      setCurrentStep('welcomeDeveloper')
    }
    else if (user && user.currentStatus === 'profile-submitted-for-approval') {
      setCurrentStep('profileNeedApproval')
    }
    else {
      if (user && user.profileApproved.status && evaluationDetails && evaluationDetails.data.videoInterview.result === 'pending') {
        setCurrentStep('interviewPending');
        setSecondBoxValue('Pending')
        setSecondBoxColor('orange')
      }
      else if (evaluationDetails && evaluationDetails.data.videoInterview.result === 'pass') {
        setCurrentStep('interviewPassed')
        setSecondBoxValue('Passed')
        setSecondBoxColor('green')
      }
      else if (evaluationDetails && evaluationDetails.data.videoInterview.result === 'fail') {
        setCurrentStep('interviewFailed')
      }
    }
  }, [user, evaluationDetails])


  return (
    <div className="mt-5 " style={{ height: '100vh' }}>
      {evaluationDetails && evaluationDetails.data &&
        user && user.profileApproved.status &&
        evaluationDetails.data.videoInterview && evaluationDetails.data.videoInterview.result !== 'fail' &&
        evaluationDetails.data.videoInterview.result !== 'pass' &&
        <div className="status-icons" style={{ marginBottom: '20px' }}>
          <Row justify="space-around">

            <Col xs={0} sm={0} md={6} lg={6}></Col>
            <Col xs={8} sm={8} md={4} lg={4}>
              <ProfileOutlined style={{ fontSize: "80px" }} className={activeProfileOutlined === 1 && 'activeProfileOutlined'} />
              <br />
              <br />
              <Paragraph>Profile Approval</Paragraph>
              <Paragraph style={{ color: "green" }}>Approved</Paragraph>
            </Col>
            <Col xs={8} sm={8} md={4} lg={4} style={{ marginTop: "-50px" }}>
              <span style={{ fontSize: "100px" }}>&#8596;</span>
            </Col>

            <Col xs={8} sm={8} md={4} lg={4}>
              <ProfileOutlined style={{ fontSize: "80px" }}
                className={activeProfileOutlined === 3 && 'activeProfileOutlined'}
              />
              <br />
              <br />
              <Paragraph>Video Interview</Paragraph>
              <Paragraph style={{ color: 'orange' }}>Pending</Paragraph>
            </Col>
            <Col xs={0} sm={0} md={6} lg={6}></Col>

          </Row>
        </div>}

      {
        (!isProfileSubmitted && isEvaluationErrorMessage) ?
          (
            <div className="evaluation-title mt-5">
              {user && user.currentStatus === 'profile-not-completed' ? <><div style={{ textAlign: 'center' }}><Title level={2}>
                Please Complete your profile and submit to Bright force first!
          </Title> </div></> :
                user && user.isDeveloper && user.currentStatus === 'profile-completed' && currentStep === 'welcomeDeveloper' ? (
                  <WelcomeDeveloper />
                )
                  : user && !user.isDeveloper && user.currentStatus === 'profile-completed' && currentStep === 'welcomeNonDeveloper' ? (
                    <WelcomeNonDeveloper />
                  ) : <div></div>
              }
            </div>
          ) : currentStep === "profileNeedApproval" ? (
            <ProfileSubmitted />
          ) : currentStep === "interviewPending" ? (
            <InterviewPending />
          ) : currentStep === "interviewPassed" ? (
            <InterviewPassed />
          ) : currentStep === "interviewFailed" ? (
            <InterviewFailed />
          ) : <div></div>}
    </div>
  );
}

export default Evaluation;
