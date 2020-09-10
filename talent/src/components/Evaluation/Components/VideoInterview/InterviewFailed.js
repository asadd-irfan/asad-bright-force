import React from 'react'
import "../evaluation.scss";
import { Typography,Row } from "antd";

const { Title, Paragraph } = Typography;

function InterviewFailed() {
    return (
        <div className="evaluation-container">
        <div className="evaluation-title mt-5">
          <Title level={2} style={{textAlign: 'center'}}>
          Unfortunately your Video interview did not achieve the desired score
          </Title>
        </div>
        <Row justify="center">
          <Paragraph className="evaluation-paragraph-center">
            No worries, you can try three months from now we are rooting for you !
          </Paragraph>
        </Row>
        <Row justify="center">
        <Paragraph className="evaluation-paragraph-center">
          Good luck and see you next time!
          <br />
          BrightForce Team
        </Paragraph>
      </Row>
        </div>
    )
}

export default InterviewFailed
