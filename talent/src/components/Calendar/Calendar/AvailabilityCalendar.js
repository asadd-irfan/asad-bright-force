import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Modal, Avatar, Button } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import moment from "moment";
import moment from "moment-timezone/builds/moment-timezone-with-data";
import Alert from "sweetalert2";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import "./calendar.scss";
import {
  getTalentScheduleEvents,
  deleteTalentScheduledEvent,
  editTalentScheduledEvent,
  addTalentScheduledEvent,
} from "../../../actions/talentCalendar";
import { getPositionDetailOfInvite } from "../../../actions/invites";
import { mergeTwoEvents } from "../../../actions/calendar";
import { MOMENT_DATE_FORMAT } from "../../../common/constants";
import { MailOutlined } from "@ant-design/icons";

function AvailabilityCalendar({ timezoneName }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const talentScheduleEvents = useSelector(
    (state) => state.talentCalendar.talentScheduleEvents
  );
  const invitePositionDetails = useSelector(
    (state) => state.invites.invitePositionDetails
  );
  const user = useSelector((state) => state.auth.user);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(false);
  const [allMeetings, setAllMeetings] = useState([]);

  useEffect(() => {
    dispatch(getTalentScheduleEvents());
  }, []);

  useEffect(() => {
    setAllMeetings(talentScheduleEvents?.meetingCalender);
    let availabilityCalendarTime =
      talentScheduleEvents &&
      talentScheduleEvents.availabilityCalender &&
      talentScheduleEvents.availabilityCalender.map((meeting) => {
        let obj = {
          start: moment.tz(meeting.startDateTime, timezoneName).format(),
          end: moment.tz(meeting.endDateTime, timezoneName).format(),
          id: meeting._id,
          title: `Available`,
        };
        return obj;
      });

    let meetingCalendarTime =
      talentScheduleEvents &&
      talentScheduleEvents.meetingCalender &&
      talentScheduleEvents.meetingCalender.map((meeting) => {
        let todayDate = new Date();
        let meetingColor = "#76A5AF";
        if (new Date(meeting.startTime) <= todayDate) {
          meetingColor = "#b0b32c";
        }
        let obj = {
          start: moment.tz(meeting.startTime, timezoneName).format(),
          end: moment.tz(meeting.endTime, timezoneName).format(),
          id: meeting._id,
          title: `Interview with ${meeting?.positionId?.companyId?.name} for ${meeting?.positionId?.title}`,
          backgroundColor: meetingColor,
          editable: false,
          groupId: meeting.positionId?._id,
        };
        return obj;
      });
    if (availabilityCalendarTime !== null) {
      const mergedArray = [
        ...calendarEvents,
        ...availabilityCalendarTime,
        ...meetingCalendarTime,
      ];
      let uniqueArray = [
        ...new Map(
          mergedArray.map((item) => {
            return [item.id, item];
          })
        ).values(),
      ];
      uniqueArray = uniqueArray.map((element) => {
        if (element.id !== undefined) {
          return element;
        }
      });
      uniqueArray = uniqueArray.filter(Boolean);
      setCalendarEvents(uniqueArray);
    }
  }, [talentScheduleEvents, timezoneName]);

  const handleEventClick = (eventClick) => {
    if (eventClick?.event?.title === "Available") {
      Alert.fire({
        title: eventClick.event.title,
        html:
          `<div class="table-responsive">
        <table class="table">
        <tbody>
        <td>Start Time</td>
        <td><strong>
        ` +
          moment(eventClick.event.start).format("llll") +
          `
        </strong></td>
        </tr>
        </tbody>
        </table>
        </div>`,

        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Remove Event",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.value) {
          eventClick.event.remove();
          dispatch(deleteTalentScheduledEvent(eventClick.event.id));
          let selectedEvent = calendarEvents.map((eve) => {
            if (eve.id === eventClick.event.id) return eve;
            else return null;
          });
          selectedEvent = selectedEvent.filter(Boolean);
          var updatedEvents = calendarEvents.filter(function (eve) {
            return eve.id !== selectedEvent[0].id;
          });
          setCalendarEvents(updatedEvents);
          Alert.fire("Deleted!", "Your Event has been deleted.", "success");
        }
      });
    } else {
      dispatch(getPositionDetailOfInvite(eventClick?.event?.groupId));
      let userMeeting = null;
      allMeetings &&
        allMeetings.map((meeting) => {
          if (meeting._id === eventClick?.event?.id) {
            userMeeting = meeting;
          }
        });
      setSelectedMeeting(userMeeting);
      setShowInterviewModal(true);
    }
  };

  const handleDateClick = (dateArg) => {
    // console.log("dateArg", dateArg);
    let dateTimezoneStr = moment.tz(dateArg.dateStr, timezoneName).format();
    let todayDate = new Date();
    if (dateArg.date >= todayDate) {
      setCalendarEvents([
        ...calendarEvents,
        {
          start: dateTimezoneStr,
          end: dateTimezoneStr,
        },
      ]);
      dispatch(
        addTalentScheduledEvent([
          {
            startDateTime: dateTimezoneStr,
            endDateTime: dateTimezoneStr,
          },
        ])
      );
    }
  };

  const onEventUpdate = (info) => {
    const eventId = info.event.id;
    let selectedEvent = calendarEvents.map((eve) => {
      if (eve.id === eventId) return eve;
      else return null;
    });
    selectedEvent = selectedEvent.filter(Boolean);
    let calendarEventsInState = [...calendarEvents];
    var removeIndex = calendarEventsInState
      .map(function (item) {
        return item.id;
      })
      .indexOf(eventId);
    calendarEventsInState.splice(removeIndex, 1);
    // console.log("info", info);
    let dateTimezoneStr = moment
      .tz(moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss"), timezoneName)
      .format();
    // console.log("dateTimezoneStr", dateTimezoneStr);
    // console.log("toISOString", new Date(dateTimezoneStr).toISOString());
    // console.log(
    //   'moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss")',
    //   moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss")
    // );
    // console.log(
    //   "timezone",
    //   moment
    //     .tz(
    //       moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss"),
    //       timezoneName
    //     )
    //     .format()
    // );

    setCalendarEvents([
      ...calendarEventsInState,
      {
        start: moment.tz(
          moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss"),
          timezoneName
        ),
        end: info.event.end
          ? moment(info.event.end).format("YYYY-MM-DDTHH:mm:ss")
          : selectedEvent[0].end,
        id: eventId,
      },
    ]);
    dispatch(
      editTalentScheduledEvent(eventId, {
        startDateTime: moment.tz(
          moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss"),
          timezoneName
        ),
        endDateTime: info.event.end
          ? moment
            .tz(
              moment(info.event.end).format("YYYY-MM-DDTHH:mm:ss"),
              timezoneName
            )
            .format()
          : selectedEvent[0].end,
      })
    );
  };

  const handleInterviewModalCancel = () => {
    setShowInterviewModal(false);
  };
  const goToDetailsPage = () => {
    history.push(`/talent/opportunities`);
  };

  const onEventOverlap = (stillEvent, movingEvent) => {
    let obj = {
      firstEventId: stillEvent?.id,
      secondEventId: movingEvent?.id,
    };
    dispatch(mergeTwoEvents(obj)).then(() => {
      dispatch(getTalentScheduleEvents());
    });
    return true;
  };

  return (
    <div className="animated fadeIn p-4 demo-app">
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div>
            <FullCalendar
              defaultView="timeGrid"
              header={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              timeZone={timezoneName ? timezoneName : "local"}
              firstDay={moment().day()}
              rerenderDelay={10}
              // hiddenDays={[6]}
              editable={true}
              droppable={true}
              eventDurationEditable={true}
              eventStartEditable={true}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              events={calendarEvents}
              eventClick={handleEventClick}
              eventDrop={onEventUpdate}
              eventResize={onEventUpdate}
              // minTime="08:00:00"
              // maxTime="20:00:00"
              slotDuration={{ hours: 0.5 }}
              dateClick={handleDateClick}
              duration={{ days: 5 }}
              eventOverlap={onEventOverlap}
            />
          </div>
        </Col>
      </Row>

      <Modal
        title="Interview Details"
        onCancel={handleInterviewModalCancel}
        visible={showInterviewModal}
        footer={[]}
        style={{ top: 20 }}
      >
        <Row className="m-2">
          <h4>Interview with: {invitePositionDetails?.companyId?.name}</h4>
        </Row>
        <Row className="m-2">
          <h5>Position Title: {invitePositionDetails?.title}</h5>
        </Row>
        <Row className="m-2">
          <b>
            Your interview is scheduled on at{" "}
            {moment(selectedMeeting?.startTime).format(MOMENT_DATE_FORMAT)} at{" "}
            {moment
              .tz(moment(selectedMeeting?.startTime), timezoneName)
              .format("hh:mm a")}
          </b>
        </Row>
        <Row className="my-4 mx-2">
          <h5>Company Contact Details:</h5>
        </Row>

        <Row className="m-2">
          <Col span={5}>
            <Avatar
              size={50}
              icon={
                <img
                  src={
                    invitePositionDetails?.positionCreatedBy?.profileImage.includes(
                      "http"
                    )
                      ? invitePositionDetails?.positionCreatedBy?.profileImage
                      : `/${invitePositionDetails?.positionCreatedBy?.profileImage}`
                  }
                  width="90px"
                  height="80px"
                />
              }
            />
          </Col>
          <Col span={18} className="mt-3">
            <h6>
              {invitePositionDetails?.positionCreatedBy?.fullName},{" "}
              {invitePositionDetails?.positionCreatedBy?.title}
            </h6>
          </Col>
        </Row>
        <Row className="m-2">
          <Col span={5} style={{ marginLeft: 5 }}>
            <MailOutlined style={{ fontSize: 40 }} />
          </Col>
          <Col span={18} className="mt-2">
            <h6>{invitePositionDetails?.positionCreatedBy?.email} </h6>
          </Col>
        </Row>

        <div>
          {selectedMeeting !== null ? (
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
                      <h5>Format</h5>
                      <p>{selectedMeeting?.format}</p>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={12}>
                      <h5>Duration</h5>
                      <p>{selectedMeeting?.duration}</p>
                    </Col>
                  </Row>

                  <Row className="m-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <h5>Meeting Details</h5>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {selectedMeeting?.meetingDetails}
                    </Col>
                  </Row>
                  <Row className="m-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <h5>Notes</h5>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      {selectedMeeting?.notes}
                    </Col>
                  </Row>
                  <Row className="m-2">
                    <a style={{ color: "blue" }}>
                      <u>How to prepare to first job interview</u>
                    </a>
                  </Row>
                  <Row justify="center" className="mt-5 mb-3">
                    <Button
                      type="primary"
                      block
                      onClick={() => goToDetailsPage()}
                    >
                      View on Opportunities
                    </Button>
                  </Row>
                </div>
              </>
            </div>
          ) : (
              <h6>Loading...</h6>
            )}
        </div>
        <br />
      </Modal>
    </div>
  );
}

export default AvailabilityCalendar;
