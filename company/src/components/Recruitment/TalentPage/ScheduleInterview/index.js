import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Select } from "antd";
import "@ant-design/compatible/assets/index.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ApprovedRequestState from "./ApprovedRequestState";
import ScheduledInterviewSidePanel from "./ScheduledInterviewSidePanel";
import MeetingCalendar from "./MeetingCalendar";
import TalentDetails from "../TalentDetails";
import EditInfo from "../SidePanels/EditInfo";
import OfferDetails from "../SidePanels/OfferDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosCandidateById,
  getCompanyPositionDetails,
} from "../../../../actions/positions";
import {
  getTalentById,
  getTalentCalendarById,
} from "../../../../actions/talent";
import { getTimeZoneName } from "../../../../actions/company";
import { useParams, useHistory } from "react-router";

const { Content, Sider } = Layout;
const { Option } = Select;

const ScheduleInterview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const posCandidateId = id;
  const appConfigs = useSelector((state) => state.auth.appConfigs);
  const companyPositionDetails = useSelector(
    (state) => state.positions.companyPositionDetails
  );
  const selectedPositionRecruitment = useSelector(
    (state) => state.positions.selectedPositionRecruitment
  );
  const timezoneName = useSelector((state) => state.company.timezoneName);
  const companyDetails = useSelector((state) => state.company.companyDetails);

  const configRoleOptions = appConfigs && appConfigs["roles"];
  const employmentOptions = appConfigs && appConfigs["employment-type"];
  const timeZoneOptions = appConfigs && appConfigs["timezone"];
  const [posRole, setPosRole] = useState();
  const [posEmpType, setPosEmpType] = useState();
  const [showCalendar, setShowCalender] = useState(false);
  const [currentTimezone, setCurrentTimezone] = useState(
    timezoneName && timezoneName
  );

  useEffect(() => {
    dispatch(getPosCandidateById(posCandidateId));
    if (companyDetails) {
      dispatch(getTimeZoneName(companyDetails?.timezone));
    }
  }, []);

  useEffect(() => {
    if (selectedPositionRecruitment) {
      dispatch(
        getCompanyPositionDetails(selectedPositionRecruitment?.position)
      );
      dispatch(getTalentById(selectedPositionRecruitment?.candidateId?._id));
      dispatch(
        getTalentCalendarById(selectedPositionRecruitment?.candidateId?._id)
      );
    }
  }, [selectedPositionRecruitment]);

  useEffect(() => {
    setCurrentTimezone(timezoneName);
  }, [timezoneName]);

  useEffect(() => {
    if (companyPositionDetails) {
      configRoleOptions &&
        configRoleOptions.filter((role) => {
          if (role._id === companyPositionDetails?.name._id) {
            setPosRole(role.name);
          }
        });
      employmentOptions &&
        employmentOptions.filter((emp) => {
          if (emp._id === companyPositionDetails?.employmentType?._id) {
            setPosEmpType(emp.name);
          }
        });
    }
  }, [companyPositionDetails]);

  const onChangeShowCalendar = (value) => {
    setShowCalender(value);
  };

  const onChangeTimeZone = (id) => {
    dispatch(getTimeZoneName(id));
  };

  return (
    <div>
      <div style={{ padding: "0px 15px" }}>
        <Row>
          <Col xs={2} sm={2} md={6} lg={6}></Col>
          <Col xs={22} sm={22} md={5} lg={5}>
            <div style={{ padding: "5px" }}>
              <span
                className="go-back"
                onClick={() => {
                  history.goBack();
                }}
              >
                <ArrowLeftOutlined /> &nbsp;&nbsp;<strong>Back</strong>
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <div style={{ padding: "5px 15px" }}>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            theme="light"
            width={300}
          >
            <EditInfo
              companyPositionDetails={companyPositionDetails}
              posEmployment={posEmpType}
              posRole={posRole}
            />
            {selectedPositionRecruitment?.status === "short-list" && (
              <ApprovedRequestState
                onChangeShowCalendar={onChangeShowCalendar}
              />
            )}
            {selectedPositionRecruitment?.status === "interview" && (
              <ScheduledInterviewSidePanel />
            )}
            <OfferDetails companyPositionDetails={companyPositionDetails} />
          </Sider>
          <Layout>
            <Content style={{ padding: "0px 0px 0px 10px", margin: "0" }}>
              {showCalendar && (
                <Row justify="end">
                  <b className="m-1">Timezone: </b>
                  <Select
                    style={{ width: "300px", marginBottom: "20px" }}
                    showSearch
                    showArrow={false}
                    defaultValue={companyDetails?.timezone}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => onChangeTimeZone(value)}
                    placeholder="Type your timezone, e.g. Asia/Karachi"
                  >
                    {timeZoneOptions &&
                      timeZoneOptions.map((item, index) => {
                        let timezone = (
                          "(UTC " +
                          item.timezoneUTC +
                          ") " +
                          item.name
                        ).toString();
                        return (
                          <Option key={index} value={item._id}>
                            {timezone}
                          </Option>
                        );
                      })}
                  </Select>
                </Row>
              )}
              <div
                style={{
                  backgroundColor: "white",
                  marginLeft: "25px",
                  borderRadius: "7px",
                  padding: "15px",
                }}
              >
                {!showCalendar && <TalentDetails />}
                {showCalendar && (
                  <MeetingCalendar
                    onChangeShowCalendar={onChangeShowCalendar}
                    timezoneName={currentTimezone}
                  />
                )}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};
export default ScheduleInterview;
