import React from 'react';
import '@ant-design/compatible/assets/index.css';
import Education from './Education';
import EmploymentAndEducation from './EmploymentAndEducation';
import WorkExperience from './WorkExperience';
import UploadResume from './../About/UploadResume';
import Languages from './../Languages/index';
import Summary from '../About/Summary';
import { Typography } from "antd";
const {  Title } = Typography;

function WorkEducation() {
  
  return (
    <div>
      <div className='main-heading-wrapper'>
				<Title level={1}>Experience
        </Title>
			</div>

      <div style={{margin: '30px 0px', }}>
      <Summary />
      </div>
       {/* <div style={{margin: '30px 0px', }}>
      <WorkExperience />
      </div>

      <div style={{margin: '30px 0px', }} id='education'>
      <Education />
      </div> */}
      <div style={{margin: '30px 0px', }} id='education'>
      <EmploymentAndEducation />
      </div>
      <div style={{margin: '30px 0px', }} id='languages'>
      <Languages />
      </div>
      <div style={{margin: '30px 0px', }} id='resume'>
      <UploadResume />
      </div>
    </div>

  );
}

export default WorkEducation;
