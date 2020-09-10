import React from "react";
import "../evaluation.scss";
import { Typography,Button } from "antd";
import {Link} from 'react-router-dom'


const { Title, Paragraph } = Typography;

function ProfileSubmitted() {
  return (
    <div className='review-profile-container'>
      <div className="page-title-wrapper">
        <Title level={2}>Welcome to BrightForce</Title>
        <hr className="title-line" />
      </div>
      <div className="review-info-paragraph">
        <Paragraph>
          You Profile has been submitted for review but you can still update or
          add to it as you like. we will send you an email with next steps in
          the next 24 hours.
        </Paragraph>
      </div>
      <div className="refer-info-paragraph2">
        <Paragraph>
          Know someone who might like BrightForce? refer them with their email
          and earn 500$, up to 7,500$ once they get hired
        </Paragraph>
      </div>
      <div className="review-info-paragraph">
        <Paragraph>
        please refer to our <Link to={'#'}>terms of service</Link> for more 
        </Paragraph>
      </div>
      <div>
          <Button type='primary'>Add email address</Button>
      </div>
      <div className="review-info-paragraph mt-4">
        <Paragraph>
        Questions? email us at anytime at <Link to={'#'}>Talents@BrightForce.io</Link>
        </Paragraph>
      </div>
    </div>
  );
}

export default ProfileSubmitted;
