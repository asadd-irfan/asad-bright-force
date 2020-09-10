import React, { useState, useEffect } from "react";
import { CheckCircleFilled } from '@ant-design/icons';
import { Row, Col, Card, Button, Tooltip, Typography } from "antd";
import {
  clearServerErrors
} from "../../../../actions/auth";

import { resetNotificationSetting } from '../../../../actions/common';
import { updateTalentProfile } from '../../../../actions/talent';
import { useSelector, useDispatch } from "react-redux";
import { errorNotification, successNotification } from "../../../../common/commonMethods";

import "./jobsearch.scss";

const { Title } = Typography
const text = (
  <span>
    we will keep your profile anonyms and only skills and preferences will be
    available to potential employers
    <br />
    <br />
    You will be evaluated only in an online coding challenge, should you opt to
    actively look for a new role you will enter the professional interview
    evaluation.
  </span>
);
const tooltipTExt = (
  <span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur.{" "}
  </span>
);

const CheckIcon = () => {
  return <CheckCircleFilled style={{ color: "green", fontSize: "22px" }} />;
};

export default function JobSearch() {

  const [selectedCard, setSelectedCard] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const evaluationDetails = useSelector(state => state.auth.evaluationDetails);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(
    state => state.auth.showSuccessNotification
  );
  const btnLoading = useSelector(state => state.auth.btnLoading);

  useEffect(() => {
    setSelectedCard(user.jobSearchStatus);
  }, [user]);

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

  const submitHandler = () => {
    dispatch(
      updateTalentProfile(user._id, { jobSearchStatus: selectedCard })
    );
  };
  return (
    <div className="container px-3 mx-lg-3 mx-0">
      <h1 style={{ marginBottom: "3rem" }}>Job Search Status </h1>
      <hr style={{ border: "1px solid black" }} />

      {(user && 
        user.profileApproved.status && 
          ((user.isDeveloper && evaluationDetails?.data?.codingChallenge.result === 'pass') || (!user.isDeveloper && user.jobSearchStatus !== 'actively-looking'))
          ) &&
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Title level={4}>Only actively looking candidates can move to video interview at the time that you wish to change your preferences to actively looking you'll be able to schedule a video interview</Title>
          </Col>
        </Row>}
      <Row>
        <Col xs={24} sm={24} md={12} lg={10}>
          <Tooltip placement="right" title={tooltipTExt}>
            <Card
              onClick={() => setSelectedCard("actively-looking")}
              className={
                selectedCard === "actively-looking"
                  ? "selectedCard shadow"
                  : "normalCard"
              }
              style={{
                marginBottom: "1rem",
                marginTop: "1rem",
                cursor: "pointer"
              }}
            >
              <Row>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <h3 className="margin_1rem">Actively looking </h3>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2}></Col>
                <Col xs={20} sm={20} md={12} lg={12}>
                  <p className="margin_1rem">
                    Ready to interview and actively searching{" "}
                  </p>
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={2}
                  lg={2}
                  style={{ paddingLeft: "20px", marginTop: "2rem" }}
                >
                  {selectedCard === "actively-looking" && <CheckIcon />}
                </Col>
              </Row>
            </Card>
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={12} lg={10}>
          <Tooltip placement="right" title={text}>
            <Card
              onClick={() => setSelectedCard("exploring")}
              className={
                selectedCard === "exploring"
                  ? "selectedCard shadow"
                  : "normalCard"
              }
              style={{
                marginBottom: "1rem",
                marginTop: "1rem",
                cursor: "pointer"
              }}
            >
              <Row>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <h3 className="margin_1rem">Exploring </h3>
                </Col>
                <Col xs={24} sm={24} md={2} lg={2}></Col>
                <Col xs={20} sm={20} md={12} lg={12}>
                  <p className="margin_1rem">
                    open to explore new opportunities{" "}
                  </p>
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={2}
                  lg={2}
                  style={{ paddingLeft: "20px", marginTop: "2rem" }}
                >
                  {selectedCard === "exploring" && <CheckIcon />}
                </Col>
              </Row>
            </Card>
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={12} lg={10}>
          <Tooltip placement="right" title={tooltipTExt}>
            <Card
              onClick={() => setSelectedCard("not-looking")}
              className={
                selectedCard === "not-looking"
                  ? "selectedCard shadow"
                  : "normalCard"
              }
              style={{
                marginBottom: "2rem",
                marginTop: "1rem",
                cursor: "pointer"
              }}
            >
              <Row>
                <Col xs={24} sm={24} md={10} lg={10}>
                  <h3 className="margin_1rem">Not looking </h3>
                </Col>
                <Col xs={24} sm={24} md={1} lg={1}></Col>
                <Col xs={20} sm={20} md={11} lg={11}>
                  <p className="margin_1rem">
                    Just curious, not open right now to considering new
                    opportunities{" "}
                  </p>
                </Col>
                <Col
                  xs={4}
                  sm={4}
                  md={2}
                  lg={2}
                  style={{ paddingLeft: "20px", marginTop: "2rem" }}
                >
                  {selectedCard === "not-looking" && <CheckIcon />}
                </Col>
              </Row>
            </Card>
          </Tooltip>
        </Col>
      </Row>
      <div className='float-right d-block mr-3 mt-3' >

        <Button
          type="primary"
          htmlType="submit"
          onClick={submitHandler}
          loading={btnLoading}
        >
          Save
      </Button>
      </div>
    </div>
  );
}
