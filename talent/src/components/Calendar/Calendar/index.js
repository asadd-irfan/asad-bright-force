import React, { useEffect, useState } from "react";
import { Row, Card, Col, Typography, Select } from "antd";
import "./calendar.scss";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { setCurrentNavbarButton } from "../../../actions/common";
import { getTimeZoneName } from "../../../actions/calendar";
import { useSelector, useDispatch } from "react-redux";

const { Paragraph, Title } = Typography;
const { Option } = Select;

function TalentCalendar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const timezoneName = useSelector(
    (state) => state.talentCalendar.timezoneName
  );
  const appConfigs = useSelector((state) => state.auth.appConfigs);
  const timeZoneOptions = appConfigs && appConfigs["timezone"];
  const [currentTimezone, setCurrentTimezone] = useState(
    timezoneName && timezoneName
  );

  useEffect(() => {
    dispatch(setCurrentNavbarButton("calendar"));
    if (user) {
      dispatch(getTimeZoneName(user?.timezone));
    }
  }, []);

  useEffect(() => {
    setCurrentTimezone(timezoneName);
  }, [timezoneName]);

  const onChangeTimeZone = (id) => {
    dispatch(getTimeZoneName(id));
  };
  return (
    <div className="calendar-container">
      <Row justify="end">
        <b className="m-1">Timezone: </b>
        <Select
          style={{ width: "300px", marginBottom: "20px" }}
          showSearch
          showArrow={false}
          defaultValue={user?.timezone}
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
                <Title level={4}>Calendar</Title>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={24}>
                <Paragraph>
                  Manage your interviews by managing your availability through
                  our calendar tool, here you can specify to to employers when
                  are available for interviews.
                </Paragraph>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={24} sm={24} md={8} lg={8}>
                <div
                  style={{ backgroundColor: "#3788D8" }}
                  className="left-status-box"
                ></div>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16}>
                <Title level={4}>Available</Title>

                <Paragraph>
                  Times on which your available for an interview{" "}
                </Paragraph>
              </Col>
            </Row>

            {/* <Row justify='center'>
							<Col xs={24} sm={24} md={8} lg={8}>
								<div style={{ backgroundColor: '#00FFFF' }} className='left-status-box'>

								</div>
							</Col>
							<Col xs={24} sm={24} md={16} lg={16}>
								<Title level={4}  >Busy</Title>

								<Paragraph  >Time shown to employers and to our testers</Paragraph>
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
            <AvailabilityCalendar timezoneName={currentTimezone} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TalentCalendar;
