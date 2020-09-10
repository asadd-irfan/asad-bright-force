import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import DetailsInfo from '../../Talent/DetailsInfo'

const { Paragraph } = Typography;

function InterviewCandidates({
  interviewCandidates
}) {

  const [talents, setTalents] = useState(interviewCandidates)

  useEffect(() => {
    setTalents(interviewCandidates)
  }, [interviewCandidates])

  return (
    <div style={{ margin: '10px 0px' }}>
      {talents && talents.map((talentData, index) => {
        let talent = talentData?.candidateId
        return <div key={index} style={{ border: '2px solid', margin: '10px 0px', backgroundColor: 'white' }}>
          <Row className='vertical-middle-align'>
            <Col xs={7} sm={7} md={5} lg={5} style={{ textAlign: 'center' }}>
            <Paragraph>
              <b>Number (Rank):</b> {index+1}
              </Paragraph>
              <Paragraph>
                <b>Matching Score:</b> {talentData.matchingScore}
              </Paragraph>
            </Col>
            <Col xs={17} sm={17} md={19} lg={19} style={{ borderLeft: '2px solid', padding: '15px' }}>
              <DetailsInfo talent={talent} />

              <Paragraph>
                {talentData?.interviewStatus == 'scheduled' &&
                  <Button type="primary"
                    style={{ background: "#F1C232", borderColor: "#F1C232", float: 'right', margin: '5px' }}>
                    Interview Scheduled
										</Button>}
                {talentData?.interviewStatus == 'time-passed' &&
                  <Button type="primary"
                    style={{ background: "#E69138", borderColor: "#E69138", float: 'right', margin: '5px' }}>
                    Interview Time Passed
										</Button>}
                {talentData?.interviewStatus == 'pass' &&
                  <Button type="primary"
                    style={{ background: "#B6D7A8", borderColor: "#B6D7A8", float: 'right', margin: '5px' }}>
                    Passed Interview
										</Button>}
                {talentData?.interviewStatus == 'fail' &&
                  <Button type="primary"
                    style={{ background: "#E06666", borderColor: "#E06666", float: 'right', margin: '5px' }}>
                    Failed Interview
										</Button>}
                {talentData?.interviewStatus == 'hired' &&
                  <Button type="primary"
                    style={{ background: "#38761D", borderColor: "#38761D", float: 'right', margin: '5px' }}>
                    Hired
										</Button>}

              </Paragraph>
            </Col>
          </Row>
        </div>
      })}
    </div>
  )
}

export default InterviewCandidates
