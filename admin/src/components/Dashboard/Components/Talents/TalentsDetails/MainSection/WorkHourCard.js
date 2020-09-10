import React, { useState, useEffect } from "react";
import { Row, Card, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import TimeRangeSlider from "react-time-range-slider";

const { Title, Paragraph } = Typography;

function WorkHourCard() {
  const user = useSelector((state) => state.talents.selectedTalent);
  const employmentType = user && user.employmentType && user.employmentType;
  const [timezoneName, setTimezoneName] = useState(null);
  const [timezoneUTC, setTimezoneUTC] = useState(null);
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("18:00");
  const appConfigsEmploymentType = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["employment-type"]
  );
  const timezoneOptions = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["timezone"]
  );
  console.log("user", user);

  useEffect(() => {
    timezoneOptions &&
      timezoneOptions.map((time) => {
        if (time._id === user?.timezone) {
          setTimezoneName(time.name);
          setTimezoneUTC(time.timezoneUTC);
        }
      });
    if (user.workingHours) {
      let start = (user.workingHours.startingHour + ":00").toString();
      let end = (user.workingHours.endingHour + ":00").toString();
      setStartHour(start);
      setEndHour(end);
    }
  }, [user, timezoneOptions]);

  let namesArrayOfConfigs = [];
  const convertConfigsIdToName = (ConfigsOptions, selectedConfigs) => {
    namesArrayOfConfigs = [];
    ConfigsOptions.filter((item) => {
      selectedConfigs.filter((selectedItem) => {
        if (selectedItem === item._id) {
          return namesArrayOfConfigs.push(item.name);
        }
      });
    });

    return namesArrayOfConfigs;
  };
  const timeChangeHandler = (time) => {
    // console.log(time);
  };

  return (
    <div>
      <Card style={{ margin: "12px 0px", minHeight: "300px" }}>
        <Row>
          <Title level={2}>Work Hours </Title>
        </Row>
        <Row className="mt-3">
          <Paragraph>
            {user?.name} is ready to work a{" "}
            {appConfigsEmploymentType &&
              employmentType &&
              convertConfigsIdToName(
                appConfigsEmploymentType,
                employmentType
              ).map((item) => {
                return <> {item}</>;
              })}{" "}
            position between:
          </Paragraph>

          <Col xs={24} sm={24} md={24} lg={24}>
            <Paragraph>
              {" "}
              <span style={{ color: "red" }}>* </span> Note the following hours
              are presented according to your timezone is UTC {timezoneUTC}{" "}
              {timezoneName}
            </Paragraph>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} className="my-3 py-2">
            {user && user.workingHours && (
              <TimeRangeSlider
                disabled={false}
                minValue={"00:00"}
                maxValue={"23:59"}
                format={24}
                onChange={timeChangeHandler}
                //   value={{ start: startHour ? startHour : "09:00", end: endHour  ? endHour : "18:00" }}
                value={{ start: startHour, end: endHour }}
                step={60}
              />
            )}
            <Paragraph>
              Start Time: {startHour} , End Time: {endHour}
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default WorkHourCard;
