import React, { useState, useEffect } from "react";
import {
  Layout,
  Col,
  Row,
  Modal,
  Button,
  Form,
  Input,
  Select,
  notification,
  Typography,
} from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@ant-design/compatible/assets/index.css";
// import moment from "moment";
import moment from "moment-timezone/builds/moment-timezone-with-data";
import { useSelector, useDispatch } from "react-redux";
import { scheduleInterviewWithTalent } from "../../../../actions/talent";
import "../../recruitment.scss";
import "../../../Calendar/calendar.scss";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const interviewDurations = [
  { hours: 1, name: "1 hour" },
  { hours: 2, name: "2 hour" },
  { hours: 3, name: "3 hour" },
];
const interviewFormat = ["phone", "video", "online test"];
const MeetingCalendar = ({ onChangeShowCalendar, timezoneName }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [meetingEndTime, setMeetingEndTime] = useState(null);
  const [availabilityEndTime, setAvailabilityEndTime] = useState(null);
  const [showScheduleInterviewModal, setShowScheduleInterviewModal] = useState(
    false
  );
  const selectedTalent = useSelector((state) => state.talents.selectedTalent);
  const selectedTalentCalendar = useSelector(
    (state) => state.talents.selectedTalentCalendar
  );
  const btnLoading = useSelector((state) => state.company.btnLoading);
  const selectedPositionRecruitment = useSelector(
    (state) => state.positions.selectedPositionRecruitment
  );

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTalentCalendar) {
      let eventsArray = [];
      if (selectedTalentCalendar?.meetingCalender?.length > 0) {
        let objArr = [];
        objArr = selectedTalentCalendar?.meetingCalender.map((event) => {
          let obj = {
            id: event._id,
            title: "Meeting",
            // start: event.startTime,
            // end: event.endTime,
            start: moment.tz(event.startTime, timezoneName).format(),
            end: moment.tz(event.endTime, timezoneName).format(),
            color: "#76a5af",
          };
          eventsArray.push(obj);
          return obj;
        });
      }
      if (selectedTalentCalendar?.availabilityCalender?.length > 0) {
        let objArr = [];
        objArr = selectedTalentCalendar?.availabilityCalender.map((event) => {
          let obj = {
            id: event._id,
            title: "Available",
            // start: event.startDateTime,
            // end: event.endDateTime,
            start: moment.tz(event.startDateTime, timezoneName).format(),
            end: moment.tz(event.endDateTime, timezoneName).format(),
            color: "#00FFFF",
            rendering: "background",
          };
          eventsArray.push(obj);
          return obj;
        });
      }
      setCalendarEvents(eventsArray);
    }
  }, [selectedTalentCalendar, timezoneName]);

  const handleEventClick = (eventClick) => {
    let availabilityEndTime = eventClick?.event?.end;
    setAvailabilityEndTime(availabilityEndTime);
  };

  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
  };

  const handleDateClick = (dateArg) => {
    calendarEvents.map((event) => {
      let selectedDate = moment.tz(dateArg.dateStr, timezoneName).format();
      let startDateTime = moment.tz(event.start, timezoneName).format();
      let endDateTime = moment.tz(event.end, timezoneName).format();
      if (selectedDate >= startDateTime && selectedDate <= endDateTime) {
        let todayDate = new Date();
        if (dateArg.date >= todayDate) {
          setMeetingStartTime(dateArg.dateStr);
          setMeetingEndTime(dateArg.dateStr);
          form.setFieldsValue({
            startTime: moment(dateArg.dateStr).format("YYYY-MM-DD HH:mm"),
            endTime: moment(dateArg.dateStr).format("YYYY-MM-DD HH:mm"),
          });
          setShowScheduleInterviewModal(true);
        } else {
          notification.error({
            message: "Error",
            description: "Minimum date should be current date",
          });
        }
      }
    });
  };

  const handleScheduleInterviewModalCancel = () => {
    setShowScheduleInterviewModal(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    let durationName = interviewDurations.filter(
      (duration) => duration.hours === values.duration
    );
    let obj = {
      startTime: moment.tz(values.startTime, timezoneName).format(),
      endTime: moment.tz(values.endTime, timezoneName).format(),
      duration: durationName[0].name,
      format: values.format,
      meetingDetails: values.meetingDetails,
      notes: values.notes,
    };
    dispatch(
      scheduleInterviewWithTalent(obj, selectedPositionRecruitment?._id)
    ).then(() => {
      setShowScheduleInterviewModal(false);
      onChangeShowCalendar(false);
    });
  };

  const onChangeDuration = (hours) => {
    let meetingEndTimeAfterDuration = moment(meetingEndTime).add(
      hours,
      "hours"
    );
    if (meetingEndTimeAfterDuration > availabilityEndTime) {
      notification.error({
        message: "Error",
        description: "Time should be in between Candidate Availability",
      });
      form.setFieldsValue({
        duration: null,
      });
    } else {
      form.setFieldsValue({
        endTime: moment(meetingEndTimeAfterDuration).format("YYYY-MM-DD HH:mm"),
      });
    }
  };

  return (
    <div>
      <Row style={{ border: "1px solid" }}>
        <Col
          xs={24}
          sm={24}
          md={8}
          lg={8}
          style={{ border: "1px solid", padding: "10px" }}
        >
          <div>
            <h5>Schedule an Interview</h5>
            <p>
              choose when would you like to schedule an interview with the
              talent
            </p>
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={16}
          lg={16}
          style={{ border: "1px solid", padding: "10px" }}
        >
          <Row>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Row justify="center">
                <Col xs={24} sm={24} md={6} lg={6}>
                  <div
                    style={{
                      backgroundColor: "rgb(0, 255, 255)",
                    }}
                    className="left-status-box"
                  ></div>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18}>
                  <Title level={4}>Available</Title>
                  <Paragraph>
                    The talent's is available for an Interview on those times
                  </Paragraph>
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1}></Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Row justify="center">
                <Col xs={24} sm={24} md={6} lg={6}>
                  <div
                    style={{ backgroundColor: "#76A5AF" }}
                    className="left-status-box"
                  ></div>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18}>
                  <Title level={4}>Interview</Title>

                  <Paragraph>Scheduled Interviews</Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ padding: "20px", backgroundColor: "white" }}>
        <FullCalendar
          firstDay={1}
          defaultView="timeGridWeek"
          header={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          rerenderDelay={10}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={calendarEvents}
          eventClick={handleEventClick}
          slotDuration={{ hours: 1 }}
          dateClick={handleDateClick}
          timeZone={timezoneName ? timezoneName : "local"}
        />
      </div>

      <Modal
        title="Schedule Interview"
        onCancel={handleScheduleInterviewModalCancel}
        visible={showScheduleInterviewModal}
        footer={[]}
        style={{ top: 20 }}
      >
        <Form
          {...formItemLayout}
          onFinish={handleSubmit}
          form={form}
          style={{ margin: "5px 5px" }}
        >
          <div style={{ textAlign: "center" }}>
            <h5>Schedule Interview with {selectedTalent?.name}</h5>
          </div>
          <div>
            <Form.Item
              label="Start Date And Time"
              name="startTime"
              rules={[
                {
                  required: true,
                  message: "Please input Date Time",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="End Date And Time"
              name="endTime"
              rules={[
                {
                  required: true,
                  message: "Please input Date Time",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Durations"
              name="duration"
              rules={[
                {
                  required: true,
                  message: "Please input meeting Durations",
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select Meeting Duration"
                optionFilterProp="children"
                style={{ width: 193 }}
                onChange={onChangeDuration}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {interviewDurations &&
                  interviewDurations.map((duration, index) => {
                    return (
                      <Option key={index} value={duration.hours}>
                        {duration.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Format"
              name="format"
              rules={[
                {
                  required: true,
                  message: "Please input meeting Format",
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Select Meeting Format"
                optionFilterProp="children"
                style={{ width: 193 }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {interviewFormat &&
                  interviewFormat.map((format, index) => {
                    return (
                      <Option key={index} value={format}>
                        {format}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Meeting Details"
              name="meetingDetails"
              rules={[
                {
                  required: true,
                  message: "Please input meeting Details",
                },
              ]}
            >
              <TextArea rows={5} />
            </Form.Item>

            <Form.Item label="Notes (Optional)" name="notes">
              <TextArea rows={5} />
            </Form.Item>

            <Row style={{ textAlign: "center" }}>
              <Col xs={2} sm={2} md={6} lg={6}></Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <Button
                  key="cancel"
                  style={{ marginLeft: "5px" }}
                  onClick={handleScheduleInterviewModalCancel}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={10} sm={10} md={10} lg={10}>
                <Button
                  key="submit"
                  style={{ marginLeft: "5px" }}
                  htmlType="submit"
                  type="primary"
                  loading={btnLoading}
                >
                  Schedule Interview
                </Button>
              </Col>
              <Col xs={2} sm={2} md={2} lg={2}></Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
export default MeetingCalendar;
