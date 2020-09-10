import React, { useEffect, lazy } from "react";
import BasicInfoCard from './BasicInfoCard'
import TalentEducationCard from './TalentEducationCard'
import BlockedCompaniesCard from './BlockedCompaniesCard'
// import ExperienceCard from "./ExperienceCard";
// import WorkHourCard from "./WorkHourCard";
import WorkHistoryCard from './WorkHistoryCard';
import WorkPlaceFeaturesCard from './WorkPlaceFeaturesCard'
import { Row, Card, Col, Typography, Button } from "antd";
import { ExclamationCircleTwoTone, CheckCircleFilled } from "@ant-design/icons";
import './viewProfile.scss'
import { useDispatch, useSelector } from "react-redux";
import { loadAppConfigs } from "../../../../actions/auth";
import { useHistory } from 'react-router-dom'
import { setCurrentNavbarButton } from '../../../../actions/common';
const WorkHourCard = lazy(() => import('./WorkHourCard'));
const ExperienceCard = lazy(() => import('./ExperienceCard'));

const { Paragraph } = Typography

const ViewProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);
  const goToEvaluationPage = () => {
    history.push('/talent/evaluation');
    dispatch(setCurrentNavbarButton('evaluation'))

  }

  return (
    <div className='view-profile-container'>
      {user && user.currentStatus === 'profile-submitted-for-approval' && <Card style={{ margin: "8px 0px" }}>
        <Row>
          <Col xs={4} sm={3} md={3} lg={3} className='text-center icon'>
            <ExclamationCircleTwoTone />
          </Col>
          <Col xs={20} sm={21} md={21} lg={21}>
            <Paragraph>
              Your profile was sent for talent manager review, (it will take 24 hours), during which you may edit it.
              <br />
              <span style={{ color: 'red' }}>* </span> After the review some of your technical experience info will not be editable because your evaluations are based on it
              or something...
                </Paragraph>
            <Paragraph>
              {/* Profile Status : <strong>{user && user.currentStatus}</strong> */}
            </Paragraph>
          </Col>
        </Row>
      </Card>}
      {user && user.currentStatus === 'profile-completed' && <Card style={{ margin: "8px 0px" }}>
        <Row>
          <Col xs={3} sm={3} md={3} lg={3} className='text-center icon-tick' >
            <CheckCircleFilled />
          </Col>
          <Col xs={18} sm={18} md={13} lg={13}>
            <Paragraph>
              Congratulations, You have completed your profile!<br />
            You can review and edit your profile and start the evaluation phase when you are up for it.
            </Paragraph>
            <Paragraph>
              <span style={{ color: 'red' }}>* </span>Note that without completing your evaluation you won't be able to recive job opportunities.            </Paragraph>
          </Col>
          <Col xs={0} sm={0} md={1} lg={1} />
          <Col xs={24} sm={24} md={7} lg={7}  >
            <Button type="primary" onClick={goToEvaluationPage}>Proceed The Evaluation Process Now</Button>
          </Col>

        </Row>
      </Card>}

      <BasicInfoCard />
      <ExperienceCard />
      <WorkHourCard />
      <WorkPlaceFeaturesCard />
      <WorkHistoryCard />
      <TalentEducationCard />
      {/* <BlockedCompaniesCard /> */}
    </div>
  );
};

export default ViewProfile;
