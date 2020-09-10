import React from "react";
import { Typography, Button, Row, Col } from "antd";
import { useSelector } from 'react-redux'

const { Paragraph } = Typography;

function TestPending({ proceedCodingStep }) {
    const codingChallenge = useSelector(state => state.auth.evaluationDetails.data.codingChallenge);

    return (
        <div className="evaluation-container">
            <div className="welcome-info-paragraph mt-4 mb-3" style={{ textAlign: 'center' }}>
                <h3 className="m-3">Coding Challenge</h3>
                {/* <Paragraph>
          A precondition to joining the platform is passing an online coding
          challenge upon completion and your job search status, you will be
          invited to the next steps
        </Paragraph> */}
                <Paragraph >
                    The coding challenge is aimed to highlight your strengths and reduce unnecessary technical interviews which typically create hiring bottlenecks.


        </Paragraph>
                <Paragraph style={{ marginTop: '10px' }}>Preparation tips and FAQ  <u><a target='_blank' rel="noopener noreferrer">Brightforce coding challenge FAQ</a></u></Paragraph>

            </div>

            <div className=" my-3 " style={{ textAlign: 'center' }}>

                <Button type='primary'><a href={codingChallenge.websiteLink && codingChallenge.websiteLink} target='_blank' rel="noopener noreferrer"> Start your coding challenge Now  </a></Button>

            </div>
        </div>
    );
}

export default TestPending;
