import React, { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Typography,
  Modal,
  Avatar,
  Button,
  Select,
} from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import momentPlugin from "@fullcalendar/moment";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@ant-design/compatible/assets/index.css";
// import moment from "moment";
import moment from "moment-timezone/builds/moment-timezone-with-data";
import { useSelector, useDispatch } from "react-redux";
import { getCalendarOfCompany, getTimeZoneName } from "../../actions/company";
import { setCurrentHireSNavbarButton } from "../../actions/common";
import { MOMENT_DATE_FORMAT } from "../../common/constants";
import {
  getPosCandidateById,
  getPosOfferById,
  getPosInterviewById,
  getCompanyPositionDetails,
} from "../../actions/positions";
import "./calendar.scss";
import { MailOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;
const { Option } = Select;

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const selectedPositionRecruitment = useSelector(
    (state) => state.positions.selectedPositionRecruitment
  );
  const companyPositionOffer = useSelector(
    (state) => state.positions.companyPositionOffer
  );
  const companyPositionInterview = useSelector(
    (state) => state.positions.companyPositionInterview
  );
  const companyPositionDetails = useSelector(
    (state) => state.positions.companyPositionDetails
  );
  const companyCalendar = useSelector((state) => state.company.companyCalendar);
  const companyDetails = useSelector((state) => state.company.companyDetails);
  const timezoneName = useSelector((state) => state.company.timezoneName);
  const dispatch = useDispatch();

  const appConfigs = useSelector((state) => state.auth.appConfigs);
  const timeZoneOptions = appConfigs && appConfigs["timezone"];

  const [currentTimezone, setCurrentTimezone] = useState(
    timezoneName && timezoneName
  );

  useEffect(() => {
    dispatch(getCalendarOfCompany());
    dispatch(setCurrentHireSNavbarButton("calender"));
    if (companyDetails) {
      dispatch(getTimeZoneName(companyDetails?.timezone));
    }
  }, []);

  useEffect(() => {
    dispatch(getPosOfferById(selectedPositionRecruitment?.positionOffer));
    dispatch(getPosInterviewById(selectedPositionRecruitment?.interviewId));
    dispatch(getCompanyPositionDetails(selectedPositionRecruitment?.position));
  }, [selectedPositionRecruitment]);

  useEffect(() => {
    setCurrentTimezone(timezoneName);
  }, [timezoneName]);

  useEffect(() => {
    if (companyCalendar?.length > 0) {
      let eventsArray = [];
      companyCalendar.map((event) => {
        let todayDate = new Date();
        let meetingColor = "#76A5AF";
        if (new Date(event.startTime) <= todayDate) {
          meetingColor = "#b0b32c";
        }
        let obj = {
          id: event.recruitmentId,
          title: `Interview with ${event?.talentId?.name} for ${event?.positionId?.title}`,
          start: moment.tz(event.startTime, timezoneName).format(),
          end: moment.tz(event.endTime, timezoneName).format(),
          color: meetingColor,
        };
        eventsArray.push(obj);
      });
      setCalendarEvents(eventsArray);
    }
  }, [companyCalendar]);

  const handleEventClick = (eventClick) => {
    dispatch(getPosCandidateById(eventClick.event.id)).then(() => {
      setShowInterviewModal(true);
    });
  };

  const handleInterviewModalCancel = () => {
    setShowInterviewModal(false);
  };

  const onChangeTimeZone = (id) => {
    dispatch(getTimeZoneName(id));
  };

  return (
    <div>
      <div className="calendar-container">
        <Row justify="end">
          <b className="m-1">Timezone: </b>
          <Select
            style={{ width: "300px", marginBottom: "20px" }}
            showSearch
            showArrow={false}
            defaultValue={companyDetails?.timezone}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        <Row justify="space-between">
          <Col xs={9} sm={9} md={6} lg={6}>
            <Card className="calendar-left-container">
              <Row justify="center">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Title level={2}>Calendar</Title>
                </Col>
              </Row>
              <Row justify="center">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Paragraph>
                    View and manage your scheduled interviews{" "}
                  </Paragraph>
                </Col>
              </Row>
              {/* <Row justify='center'>
                                <Col xs={24} sm={24} md={8} lg={8}>
                                    <div className='left-status-box'>

                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={16}>
                                    <Title level={4} >Available</Title>

                                    <Paragraph>Time shown to employers and to our testers </Paragraph>
                                </Col>
                            </Row>
                            <Row justify='center'>
                                <Col xs={24} sm={24} md={8} lg={8}>
                                    <div style={{ backgroundColor: '#00FFFF' }} className='left-status-box'>

                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={16} lg={16}>
                                    <Title level={4}  >Busy</Title>

                                    <Paragraph>Time shown to employers and to our testers</Paragraph>
                                </Col>
                            </Row> */}
              <Row justify="center">
                <Col xs={24} sm={24} md={8} lg={8}>
                  <div
                    style={{ backgroundColor: "#76A5AF" }}
                    className="left-status-box"
                  ></div>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                  <Title level={4}>Interview</Title>

                  <Paragraph>Scheduled Interviews</Paragraph>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={15} sm={15} md={18} lg={18}>
            <Card className="calendar-right-container ml-1">
              <div style={{ padding: "20px", backgroundColor: "white" }}>
                <FullCalendar
                  firstDay={1}
                  defaultView="timeGrid"
                  header={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                  }}
                  rerenderDelay={10}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  slotDuration={{ hours: 0.5 }}
                  duration={{ days: 5 }}
                  timeZone={currentTimezone ? currentTimezone : "local"}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        title="Interview Details"
        onCancel={handleInterviewModalCancel}
        visible={showInterviewModal}
        footer={null}
        style={{ top: 20 }}
      >
        <Row className="m-2">
          <h4>
            Interview with: {selectedPositionRecruitment?.candidateId?.name}
          </h4>
        </Row>
        <Row className="m-2">
          <h6>Position Title: {companyPositionDetails?.title}</h6>
        </Row>
        <Row className="m-2">
          <b>
            Your interview is scheduled on{" "}
            {moment(companyPositionInterview?.startTime).format(MOMENT_DATE_FORMAT)} at{" "}
            {moment(companyPositionInterview?.startTime).format("hh:mm a")}
          </b>
        </Row>
        <Row className="my-4 mx-2">
          <h6>Company Contact Details:</h6>
        </Row>

        <Row className="m-2">
          <Col span={5}>
            <Avatar
              size={50}
              icon={
                <img
                  src={
                    companyPositionDetails &&
                      companyPositionDetails?.positionCreatedBy?.profileImage?.includes(
                        "http"
                      )
                      ? companyPositionDetails?.positionCreatedBy?.profileImage
                      : `/${companyPositionDetails?.positionCreatedBy?.profileImage}`
                  }
                  width="90px"
                  height="80px"
                />
              }
            />
          </Col>
          <Col span={18} className="mt-3">
            <h6>
              {companyPositionDetails?.positionCreatedBy?.fullName},{" "}
              {companyPositionDetails?.positionCreatedBy?.title}
            </h6>
          </Col>
        </Row>
        <Row className="m-2">
          <Col span={5} style={{ marginLeft: 5 }}>
            <MailOutlined style={{ fontSize: 40 }} />
          </Col>
          <Col span={18} className="mt-2">
            <h6>{companyPositionDetails?.positionCreatedBy?.email} </h6>
          </Col>
        </Row>
        <div>
          {companyPositionInterview !== null ? (
            <div>
              <>
                <div
                  style={{
                    marginTop: "5px",
                    padding: "10px",
                    borderTop: "1px solid",
                  }}
                >
                  <Row className="m-2">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <b>Format</b>
                      <br />
                      {companyPositionInterview?.format}
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={12}>
                      <b>Duration</b>
                      <br />
                      {companyPositionInterview?.duration}
                    </Col>
                  </Row>

                  <Row className="m-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <b>Meeting Details</b>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {companyPositionInterview?.meetingDetails}
                    </Col>
                  </Row>
                  <Row className="m-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <b>Notes</b>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {companyPositionInterview?.notes}
                    </Col>
                  </Row>
                  <Row justify="center" className="my-5">
                    <Button
                      type="primary"
                      block
                    // onClick={() => goToCalendarPage()}
                    >
                      View Talent on Page
                    </Button>
                  </Row>
                </div>
              </>
            </div>
          ) : (
              <h6>Loading...</h6>
            )}
        </div>
      </Modal>
    </div>
  );
};
export default Calendar;
