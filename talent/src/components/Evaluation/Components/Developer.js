import React, { useState, useEffect } from "react";
import { Typography, Row, Col } from "antd";
import { ProfileOutlined, VideoCameraOutlined, FileDoneOutlined, CodeOutlined } from "@ant-design/icons";
import ProfileApproved from "./ProfileApproval/ProfileApproved";
import WelcomeDeveloper from "./Welcome/WelcomeDeveloper";
import ProfileSubmitted from "./Welcome/ProfileSubmitted";
import WelcomeNonDeveloper from "./Welcome/WelcomeNonDeveloper";
import CodingChallengePass from "./CodingChallenge/TestResult";
import CodingChallengePending from "./CodingChallenge/TestPending";
import InterviewPending from "./VideoInterview/InterviewPending";
import CodingChallengeFail from "./CodingChallenge/TestFailed";
import InterviewPassed from "./VideoInterview/InterviewPassed";
import InterviewFailed from "./VideoInterview/InterviewFailed";
import { loadAppConfigs } from "../../../actions/auth";
import { getTalentEvaluation } from "../../../actions/evaluation";
import { useSelector, useDispatch } from "react-redux";
import "./evaluation.scss";

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
  const [thirdBoxValue, setThirdBoxValue] = useState('Pending');
  const [secondBoxColor, setSecondBoxColor] = useState('orange');
  const [thirdBoxColor, setThirdBoxColor] = useState('orange');

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);

  useEffect(() => {
    if (user && (user.currentStatus === 'profile-approved' || user.currentStatus === 'video-interview-pending')) {
      setActiveProfileOutlined(1)
    }
    if (user && (user.currentStatus === 'video-interview-pass' || user.currentStatus === 'coding-challenge-pending')) {
      setActiveProfileOutlined(2)
    }
    if ((user && user.currentStatus === 'coding-challenge-pass')) {
      setActiveProfileOutlined(3)
    }

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
      if (user && user.profileApproved.status) {
        setCurrentStep('profileApproved');
        if (evaluationDetails && evaluationDetails.data.videoInterview.result === 'pending') {
          setCurrentStep('profileApproved');
          setSecondBoxValue('Pending')
          setSecondBoxColor('orange')
        }

        else if (evaluationDetails && evaluationDetails.data.videoInterview.result === 'pass') {
          setCurrentStep('interviewPassed')
          setSecondBoxValue('Passed')
          setSecondBoxColor('green')

          if (evaluationDetails && evaluationDetails.data.videoInterview.isCompleted === true) {
            if (user && user.availabilityStatus === 'live') {
              if (evaluationDetails && evaluationDetails.data.codingChallenge.result === 'pending') {
                setCurrentStep('interviewPassed')
                setThirdBoxValue('Pending')
                setThirdBoxColor('orange')
              }
              else {
                if (evaluationDetails && evaluationDetails.data.codingChallenge.result === 'pass') {
                  setCurrentStep('codingChallengePass')
                  setThirdBoxValue('Passed')
                  setThirdBoxColor('green')

                }
                else if (evaluationDetails && evaluationDetails.data.codingChallenge.result === 'fail') {
                  setCurrentStep('codingChallengeFail')
                }
              }

            }
          }
        }
        else if (evaluationDetails && evaluationDetails.data.videoInterview.result === 'fail') {
          setCurrentStep('interviewFailed')
        }
      }
    }
  }, [user, evaluationDetails])

  const changeCurrentStep = (step, activeBox) => {
    setCurrentStep(step)
    setActiveProfileOutlined(activeBox)
  }
  console.log('currentStep', currentStep)
  return (
    <div className="mt-5 " style={{ height: '100vh' }}>
      {evaluationDetails && evaluationDetails.data &&
        user && user.profileApproved.status &&
        evaluationDetails.data.videoInterview && evaluationDetails.data.videoInterview.result !== 'fail' &&
        evaluationDetails.data.codingChallenge && evaluationDetails.data.codingChallenge.result !== 'fail' &&
        evaluationDetails.data.codingChallenge.result !== 'pass' &&
        <div className="status-icons" style={{ marginBottom: '20px' }}>
          <Row justify="space-around">

            <Col xs={24} sm={6} md={6} lg={6} style={{ textAlign: 'center' }}>
              <FileDoneOutlined style={{ fontSize: "80px" }} className={activeProfileOutlined === 1 && 'activeProfileOutlined'}
                onClick={
                  () => changeCurrentStep('profileApproved', 1)
                }
              />
              <br />
              <br />
              <Paragraph>Profile Approval</Paragraph>
              <Paragraph style={{ color: "green" }}>Approved</Paragraph>
            </Col>
            <Col xs={0} sm={2} md={2} lg={2} style={{ marginTop: "-25px" }}>
              <span style={{ fontSize: "80px" }}>&#8596;</span>
            </Col>
            <Col xs={24} sm={6} md={6} lg={6} style={{ textAlign: 'center' }}>
              <VideoCameraOutlined
                style={{ fontSize: "80px" }}
                className={activeProfileOutlined === 2 && 'activeProfileOutlined'}
                onClick={
                  secondBoxValue === "Pending" ? (
                    () => changeCurrentStep('interviewPending', 2)
                  ) : secondBoxValue === "Passed" ? (
                    () => changeCurrentStep('interviewPassed', 2)
                  ) : null
                } />
              <br />
              <br />
              <Paragraph>Video Interview</Paragraph>
              <Paragraph style={{ color: secondBoxColor }}>{secondBoxValue}</Paragraph>
            </Col>

            {/* {evaluationDetails && evaluationDetails.data.codingChallenge.result === 'pass' && */}
            <>
              <Col xs={0} sm={2} md={2} lg={2} style={{ marginTop: "-25px" }}>
                <span style={{ fontSize: "80px" }}>&#8596;</span>
              </Col>
              <Col xs={24} sm={6} md={6} lg={6} style={{ textAlign: 'center' }}>
                <CodeOutlined onClick={
                  thirdBoxValue === "Pending" ? (
                    () => changeCurrentStep('codingChallengePending', 3)
                  ) : thirdBoxValue === "Passed" ? (
                    () => changeCurrentStep('codingChallengePass', 3)
                  ) : null
                }
                  style={{ fontSize: "80px" }}
                  className={activeProfileOutlined === 3 && 'activeProfileOutlined'} />
                <br />
                <br />
                <Paragraph>Coding Challenge</Paragraph>
                <Paragraph style={{ color: thirdBoxColor }}>{thirdBoxValue}</Paragraph>
              </Col>
            </>

          </Row>
        </div>
      }

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
          ) : currentStep === "profileApproved" ? (
            <ProfileApproved proceedVideoStep={changeCurrentStep} />
          ) : currentStep === "codingChallengePass" ? (
            <CodingChallengePass challengesIconClickHandler={changeCurrentStep} />
          ) : currentStep === "codingChallengePending" ? (
            <CodingChallengePending />
          ) : currentStep === "codingChallengeFail" ? (
            <CodingChallengeFail />
          ) : currentStep === "interviewPending" ? (
            <InterviewPending />
          ) : currentStep === "interviewPassed" ? (
            <InterviewPassed proceedCodingStep={changeCurrentStep} />
          ) : currentStep === "interviewFailed" ? (
            <InterviewFailed />
          ) : <div></div>}
    </div>
  );
}

export default Evaluation;
