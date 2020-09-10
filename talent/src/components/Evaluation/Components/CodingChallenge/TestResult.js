import React, { useState } from "react";
import "../evaluation.scss";

import { Typography, Button, Row, Col, Progress } from "antd";
import { CodeOutlined, VideoCameraOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import QualifiedTalentPic from '../../../../assets/img/QualifiedTalent.png'


const { Title, Paragraph } = Typography;

function TestResult(props) {
  const user = useSelector(state => state.auth.user);

  // const websiteLink = useSelector(state => state.auth.evaluationDetails.data.codingChallenge.websiteLink);
  // const codingChallengeResult = useSelector(state => state.auth.evaluationDetails.data.codingChallenge.result);
  // const [testDetails] = useState(testResultDetails)

  const testResultDetails = useSelector(state => state.auth.evaluationDetails.data);
  const [codingChallengeScores] = useState(user && user.isDeveloper && testResultDetails.codingChallenge.categoriesScores)
  const [websiteLink] = useState(user && user.isDeveloper && testResultDetails.codingChallenge.websiteLink)
  const [videoInterview] = useState(testResultDetails.videoInterview)
  const [codingChallenge] = useState(testResultDetails.codingChallenge)

  // codingChallengeScores && codingChallengeScores.sort(function (a, b) { return a - b });
  codingChallengeScores && codingChallengeScores.sort((a, b) => b.percentage - a.percentage);

  // console.log('codingChallengeScores', codingChallengeScores)
  // const onHandleVideoInterview = () => {
  //   if (codingChallengeResult === 'pass') {
  //     props.challengesIconClickHandler('interviewPending', 3);
  //   }
  // }

  return (
    <div>
      <div className="evaluation-title">
        <div className="evaluation-title" style={{ textAlign: 'center' }}>
          <img src={QualifiedTalentPic} alt={'qualified-talent'} className='mt-2' />
          <Title level={2} className='text-success mt-3'>BrightForce Qualified Talent</Title>
        </div>
      </div>
      {/* <div className="progress-bar-disclaimer">
        <Row justify="space-between">
          <Col xs={24} sm={24} md={10} lg={10}>
            <Paragraph className="disclaimer">
              result of coding challenge will be defined by supplier and the
              score they present {<br />}
              Written assessment <br />
              Measurable parameters (ranked pairs of{" "}
              <span>
                <Link to="">parameter</Link>
              </span>
              ,
              <span>
                <Link to="">score</Link>
              </span>
              ) <br />A Video Recording <br />
              -------------------
            </Paragraph>
            <Paragraph className="disclaimer">
              lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            </Paragraph>
          </Col>
          <Col xs={24} sm={24} md={10} lg={10}>
            {testDetails && testDetails.map((item, ind) => {
              return (
                <Row justify="space-between" key={ind}>
                  <Col xs={24} sm={24} md={10} lg={10}>
                    <Progress percent={item.percentage} size="small" />
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <Paragraph>{item.name}</Paragraph>
                  </Col>
                </Row>
              );
            })}
            <Row justify='center'>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Button type='link'><a href={websiteLink && websiteLink} target='_blank' rel="noopener noreferrer">Code Challenge Link</a></Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {user && user.currentStatus === 'coding-challenge-pass' && <div className="schedule-meeting-btn" style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={onHandleVideoInterview}>
          Proceed To The Video Interview
        </Button>
      </div>} */}
      <div className="my-3">
        <Row className="my-3">
          <Col xs={6} sm={6} md={6} lg={6} />
          <Col xs={4} sm={4} md={4} lg={4} style={{ textAlign: 'center' }}>
            <VideoCameraOutlined
              style={{ fontSize: "80px" }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }} >
            <h3 style={{ marginTop: '30px' }}>
              Your video interview result.
              </h3>
          </Col>
        </Row>
        <div style={{ textAlign: 'center' }} className="mb-5">

          <Button type='primary' ><a href={videoInterview.resultLink && videoInterview.resultLink} target='_blank' rel="noopener noreferrer">View Video Interview  </a></Button>
        </div>
      </div>
      <div>
        <Row className="my-3">
          <Col xs={6} sm={6} md={6} lg={6} />
          <Col xs={4} sm={4} md={4} lg={4} style={{ textAlign: 'center' }}>
            <CodeOutlined
              style={{ fontSize: "80px" }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }} >
            <h3 style={{ marginTop: '30px' }}>
              Your Coding Challenge result.
              </h3>
          </Col>
        </Row>

        <div className="progress-bar-disclaimer">
          <Row justify="space-between">
            <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center' }}>

              <Paragraph >
                {codingChallenge?.resultDetails}
              </Paragraph>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center' }}>
              {codingChallengeScores && codingChallengeScores.map((item, ind) => {
                return (
                  <Row justify="space-between" key={ind}>
                    <Col xs={24} sm={24} md={10} lg={10}>
                      <Progress percent={item.percentage} />
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                      <Paragraph>{item.name}</Paragraph>
                    </Col>
                  </Row>
                );
              })}

            </Col>
          </Row>
        </div>

      </div>
    </div>
  );
}

export default TestResult;
