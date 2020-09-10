import React, { useState, useEffect } from "react";
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button, Input, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  clearServerErrors,
} from "../../../../actions/auth";
import { resetNotificationSetting } from '../../../../actions/common';
import { updateTalentProfile } from '../../../../actions/talent';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";

import './../BlockedCompanies/blockedCompanies.scss'

const { TextArea } = Input;

function AboutMe(props) {
  const userId = useSelector(state => state.auth.user._id);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const aboutMe = useSelector(state => state.auth.user.aboutMe);
  const myAchievements = useSelector(state => state.auth.user.myAchievements);

  const [aboutData, setAboutData] = useState({
    aboutMe: aboutMe,
    myAchievements: myAchievements
  });

  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(
    state => state.auth.showSuccessNotification
  );
  const btnLoading = useSelector(state => state.auth.btnLoading);

  const dispatch = useDispatch();
  
  const openErrorNotification = () => {
		errorNotification(serverErrors);
		dispatch(clearServerErrors());
  }

  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };
  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification]);


  const inputChangeHandler = (e) => {
    setAboutData({...aboutData, [e.target.name]: e.target.value });
  };

  const handleSubmit = values => {
    dispatch(updateTalentProfile(userId,aboutData));
  };
  return (
    <div>
      <Form 
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <div className="padding_2rem">
          <h2>About me</h2>
          <Form.Item>
            <div className="margin_2rem">
                <TextArea
                  rows={12}
                  name="aboutMe"
                  onChange={e => inputChangeHandler(e)}
                value={aboutData.aboutMe}
                />
            </div>
          </Form.Item>
        </div>
        <div className="padding_2rem" id='my-achievements'>
          <h2>My greatest achievements are:</h2>
          <Form.Item>
            <div className="margin_2rem">
                <TextArea
                  rows={12}
                  name='myAchievements'
                  onChange={e => inputChangeHandler(e)}
                  value={aboutData.myAchievements}
                />
            </div>
          </Form.Item>
        </div>
        <Row>
          <Col xs={16} sm={16} md={20} lg={20}></Col>
          <Col xs={8} sm={8} md={4} lg={4}>
            <Form.Item>
              <Button
                type="primary"
                block
                style={{ float: "right" }}
                loading={btnLoading}
                htmlType="submit"
              >
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      
        </div>
  );
}

export default AboutMe;
