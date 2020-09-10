import React, { useState } from "react";
import "../evaluation.scss";
import { Typography, Row, Col, Progress, Button } from "antd";
import { ReconciliationOutlined, LaptopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import QualifiedTalentPic from '../../../../assets/img/QualifiedTalent.png'
import { useSelector } from 'react-redux'


const { Title, Paragraph } = Typography;

function InterviewPassed({ proceedCodingStep }) {

  const user = useSelector(state => state.auth.user);
  const testResultDetails = useSelector(state => state.auth.evaluationDetails.data);
  const [codingChallengeScores] = useState(user && user.isDeveloper && testResultDetails.codingChallenge.categoriesScores)
  const [websiteLink] = useState(user && user.isDeveloper && testResultDetails.codingChallenge.websiteLink)
  const [videoInterview] = useState(testResultDetails.videoInterview)
  // const [codingChallenge] = useState(testResultDetails.codingChallenge)
  return (
    // <div style={{backgroundColor:'#F0F2F5'}}>
    //   <div className="evaluation-title" style={{textAlign:'center'}}>
    //       <img src={QualifiedTalentPic} alt={'qualified-talent'} className='mt-2'/>
    //     <Title level={2} className='text-success mt-3'>BrightForce Qualified Talent</Title>
    //   </div>
    //   <hr className='qualified-line'/>
    //   {user && user.isDeveloper &&
    //     <>
    //     <div className="evaluation-title" style={{textAlign:'center'}}>
    //     <Title level={3}>
    //       {" "}
    //       <ReconciliationOutlined style={{ fontSize: "40px" }} /> Your Code
    //       Challenge Results
    //     </Title>
    //   </div>

    //   <div className="progress-bar-disclaimer">
    //     <Row justify="space-between">
    //       <Col xs={24} sm={24} md={10} lg={10}>
    //         <Paragraph className="disclaimer ">
    //           result of coding challenge will be defined by supplier and the
    //           score they present {<br />}
    //           Written assessment <br />
    //           Measurable parameters (ranked pairs of{" "}
    //           <span>
    //             <Link to="">parameter</Link>
    //           </span>
    //           ,
    //           <span>
    //             <Link to="">score</Link>
    //           </span>
    //           ) <br />A Video Recording <br />
    //           -------------------
    //         </Paragraph>
    //         <Paragraph className="disclaimer">
    //           lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
    //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
    //           enim ad minim veniam, quis nostrud exercitation ullamco laboris
    //           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    //         </Paragraph>
    //       </Col>
    //       <Col xs={24} sm={24} md={10} lg={10}>
    //         {codingChallengeScores && codingChallengeScores.map((item, ind) => {
    //           return (
    //             <Row justify="space-between" key={ind}>
    //               <Col xs={24} sm={24} md={10} lg={10}>
    //                 <Progress percent={item.percentage} size="small" />
    //               </Col>
    //               <Col xs={24} sm={24} md={8} lg={8}>
    //                 <Paragraph>{item.name}</Paragraph>
    //               </Col>
    //             </Row>
    //           );
    //         })}
    //         <Row justify='center'>
    //        <Col xs={24} sm={24} md={24} lg={24}>
    //        <Button type='link'><a href={websiteLink && websiteLink} target='_blank' rel="noopener noreferrer">Code Challenge Link</a></Button>
    //        </Col>
    //        </Row>
    //       </Col>
    //     </Row>
    //   </div>
    //   </>
    //   }
    //   <div className="evaluation-title" style={{textAlign:'center'}}>
    //     <Title level={3}>
    //       {" "}
    //       <LaptopOutlined style={{ fontSize: "40px",marginTop:'50px' }} /> 
    //       Your Video Interview Result
    //     </Title>
    //   </div>
    //   <div className="progress-bar-disclaimer">
    //     <Row justify="space-between">
    //       <Col xs={24} sm={24} md={10} lg={10}>
    //         <Paragraph className="disclaimer ">
    //           Your interview recording:
    //           <br />
    //           <Button type='link'><a href={videoInterview && videoInterview.videoLink && videoInterview.videoLink} target='_blank' rel="noopener noreferrer">Video Interview Link</a></Button> <br />
    //           -------------------
    //         </Paragraph>
    //         <Paragraph className="disclaimer">
    //           {videoInterview && videoInterview.resultDetails && videoInterview.resultDetails}
    //         </Paragraph>
    //         <Paragraph className="disclaimer">
    //           lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
    //           eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
    //           enim ad minim veniam, quis nostrud exercitation ullamco laboris
    //           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    //         </Paragraph>
    //       </Col>
    //       <Col xs={24} sm={24} md={10} lg={10}>

    //       </Col>
    //     </Row>
    //   </div>

    // </div>






    <div className="evaluation-container">

      <div className="welcome-info-paragraph mt-5">
        <Row>
          {/* <Col xs={24} sm={24} md={12} lg={12}>
            <img src={meetingPic} alt={'meetingPic'} />
          </Col> */}
          <Col xs={24} sm={24} md={24} lg={24} className="my-4" style={{ textAlign: 'center' }}>
            <Paragraph style={{ fontWeight: 'bold', marginTop: '10px' }}>Congratulations Your Have Passed The Video Interview Stage!</Paragraph>
            <Paragraph style={{ marginTop: '10px' }}>
              You can view your video interview on the following link.
              </Paragraph>
            <Button type='primary' ><a href={videoInterview.resultLink && videoInterview.resultLink} target='_blank' rel="noopener noreferrer">View Video Interview  </a></Button>
            <Paragraph style={{ marginTop: '10px' }}>
              you may now proceed to the coding challenge stage and showcase your abilities as a developer
              </Paragraph>
            {/* <Paragraph style={{ marginTop: '10px' }}>Interview tips and FAQ  <u><a target='_blank' rel="noopener noreferrer">Brightforce video interview FAQ</a></u></Paragraph> */}

            <Button type='primary' onClick={() => proceedCodingStep('codingChallengePending', 3)} >Proceed To The Coding Challenge </Button>
          </Col>
        </Row>
      </div>

    </div>
  );
}

export default InterviewPassed;
