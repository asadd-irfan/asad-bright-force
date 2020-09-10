import React from "react";
import { Col, Row } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./calendar.scss";

function TalentDetailCalendar (props) {
    return (
      <div className="animated fadeIn p-4 demo-app">
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div>
              <FullCalendar
                  defaultView="timeGridWeek"
                  header={{
                    left: "prev,next today",
                    center: "title",
                    right: ""
                  }}
                  firstDay={moment().day()}
                  rerenderDelay={10}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  events={props.events}
                  minTime='08:00:00'
                  maxTime='20:00:00'
                  slotDuration={{ hours: 1 }}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  
}

export default TalentDetailCalendar;