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

function Summary(props) {
  const userId = useSelector(state => state.auth.user._id);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  // const aboutMe = useSelector(state => state.auth.user.aboutMe);
  // const myAchievements = useSelector(state => state.auth.user.myAchievements);
  const mySummary = useSelector(state => state.auth.user.summary);

  const [aboutData, setAboutData] = useState({
    // aboutMe: aboutMe,
    // myAchievements: myAchievements
    summary: mySummary
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
        <div className="my-2">
          <h2>Summary </h2>
          <p>A short description of your professional self</p>
          <Form.Item>
            <div >
                <TextArea
                  rows={5}
                  name="summary"
                  onChange={e => inputChangeHandler(e)}
                value={aboutData.summary}
                />
            </div>
          </Form.Item>
        </div>
        
        

        <Row className="my-2">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item>
              <Button
                type="primary"
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

export default Summary;
