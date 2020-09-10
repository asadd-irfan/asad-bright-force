import React from "react";
import { Typography, Button, Row, Col } from "antd";
import "../evaluation.scss";
import startPic from "../../../../assets/img/start.png";
import { useSelector } from 'react-redux'

const { Paragraph } = Typography;

function WelcomeEvaluation({ proceedVideoStep }) {
  // const codingChallenge = useSelector(state => state.auth.evaluationDetails && state.auth.evaluationDetails.data.codingChallenge);
  const videoInterview = useSelector(state => state.auth.evaluationDetails && state.auth.evaluationDetails.data.videoInterview);

  return (
    <div className="evaluation-container">
      <div className="welcome-info-paragraph mt-4 mb-3" style={{ textAlign: 'center' }}>
        <h3 className="m-3">Congratulations Your Profile has been approved!</h3>
        {/* <Paragraph>
          A precondition to joining the platform is passing an online coding
          challenge upon completion and your job search status, you will be
          invited to the next steps
        </Paragraph> */}
        <Paragraph >
          Welcome to your Evaluation Phase.<br />
          Our Evaluation process enhance your relevance and attractiveness and speed up the recruitment process.<br />
          Once passed, you will have the opportunity to showcase your abilities to multiple future employers in one Evaluation.


        </Paragraph>
      </div>

      <div className=" my-3 " style={{ textAlign: 'center' }}>

        {videoInterview?.result === 'pending' && <Button type='primary' onClick={() => proceedVideoStep('interviewPending', 2)}>Proceed To The Video Interview  </Button>}

      </div>
    </div>
  );
}

export default WelcomeEvaluation;
