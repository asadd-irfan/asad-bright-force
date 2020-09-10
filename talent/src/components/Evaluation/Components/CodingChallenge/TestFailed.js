import React from "react";
import "../evaluation.scss";
import { Typography,Row } from "antd";

const { Title, Paragraph } = Typography;

function TestFailed() {
  return (
    <div className="evaluation-container">
      <div className="evaluation-title mt-5" style={{textAlign: 'center'}}>
        <Title level={2}>
          Unfortunately your coding challenge did not achieve the desired score
        </Title>
      </div>
      <Row justify="center">
        <Paragraph className="evaluation-paragraph-center">
          No worries, you can try three months from now we are rooting for you !
        </Paragraph>
      </Row>
      <Row justify="center">
        <Paragraph className="evaluation-paragraph">
          There are various training programs online such as: <br /> Leetcodes{" "}
          <a target="_blank" href="https://leetcode.com/" rel="noopener noreferrer">
            {" "}
            https://leetcode.com/
          </a>
          <br />
          Codewars{" "}
          <a target="_blank" href="https://www.codewars.com/" rel="noopener noreferrer">
            {" "}
            https://www.codewars.com/
          </a>
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
  );
}

export default TestFailed;
