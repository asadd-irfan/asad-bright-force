import React, { useState, useEffect } from "react";
import { Avatar, Row, Col, Typography, Tag } from "antd";
// import { TalentOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import "./mainSection.scss";
import { BASE_URL } from "../../../../../../common/constants";
import { getTalentById } from "../../../../../../actions/talent";
import {
  UserOutlined,
  PhoneOutlined,
  LinkedinFilled,
  FileTextOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  GithubOutlined,
  MailOutlined,
} from "@ant-design/icons";
const { Paragraph } = Typography;

function BasicInfo() {
  const dispatch = useDispatch();
  let { id } = useParams();
  useEffect(() => {
    dispatch(getTalentById(id));
  }, []);

  const talent = useSelector(
    (state) => state.talents.selectedTalent && state.talents.selectedTalent
  );
  // console.log('talent', talent)
  const appConfigsEmploymentType = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["employment-type"]
  );
  const appConfigsCurrency = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["currency"]
  );
  const appConfigsRoles = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["roles"]
  );

  const aboutMe = talent && talent.aboutMe && talent.aboutMe;
  const role = talent?.role;

  const myAchievements =
    talent && talent.myAchievements && talent.myAchievements;
  const preferredRolesDescription =
    talent &&
    talent.preferredRoles &&
    talent.preferredRoles.description &&
    talent.preferredRoles.description;
  const salary =
    talent &&
    talent.salary &&
    talent.salary.minSalary &&
    talent.salary.minSalary;
  const talentCv = talent && talent.resume && talent.resume;
  const linkedIn = talent && talent.linkedIn && talent.linkedIn;
  const github = talent && talent.github && talent.github;
  const profilePicURL = talent && talent.profileImage && talent.profileImage;
  const employmentType =
    talent && talent.employmentType && talent.employmentType;

  const convertConfigsIdToName = (ConfigsOptions, selectedConfigs) => {
    let namesArrayOfConfigs = [];
    ConfigsOptions && ConfigsOptions.filter((item) => {
      selectedConfigs.filter((selectedItem) => {
        if (selectedItem === item._id) {
          return namesArrayOfConfigs.push(item.name);
        }
      });
    });
    return namesArrayOfConfigs;
  };
  const convertAppConfigIdToName = (ConfigsOptions, selectedConfigs) => {
    let name;

    ConfigsOptions && ConfigsOptions.map((item) => {
      if (selectedConfigs === item._id) {
        name = item.name;
      }
    });
    return name;
  };

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <Row justify="space-between">
        <Col xs={24} sm={24} md={6} lg={6}>
          <Avatar
            shape="square"
            size={140}
            src={
              profilePicURL && profilePicURL.includes("http")
                ? profilePicURL
                : `/${profilePicURL}`
            }
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} sm={24} md={18} lg={18}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row>
              <h2>{talent && talent.name}</h2>{" "}
              <Tag style={{ padding: 7 }} className="ml-5 m-2" color="blue">
                {convertAppConfigIdToName(appConfigsRoles, role)}
              </Tag>
            </Row>
          </Col>

          <Row justify="space-between" className="mt-3">
            <Col xs={24} sm={24} md={5} lg={5}>
              <Paragraph className="font-weight-bold">
                <span className="font-weight-bold">Location : </span>
                {" " + talent?.location?.city
                  ? talent?.location?.city
                  : "" + " " + talent?.location?.country
                    ? ", " + talent?.location?.country
                    : ""}
              </Paragraph>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify="start">
        <Col xs={24} sm={24} md={6} lg={6} />
        <Col xs={24} sm={24} md={2} lg={2} className="text-align">
          <span className="font-weight-bold">Summary :</span>
        </Col>
        <Col xs={24} sm={24} md={15} lg={15} className="text-align">
          <Paragraph>{talent?.summary}</Paragraph>
        </Col>
      </Row>

      <Row justify="start">
        <Col xs={24} sm={24} md={6} lg={6} />
        <Col xs={24} sm={24} md={18} lg={18} className="text-align">
          Looking for a{" "}
          <b>
            {appConfigsEmploymentType &&
              employmentType &&
              convertConfigsIdToName(
                appConfigsEmploymentType,
                employmentType
              ).map((item, ind) => {
                return <div key={ind}> {item}</div>;
              })}
          </b>{" "}
          job, at a base salary of{" "}
          <b>
            {talent?.salary?.minSalary}{" "}
            {" " + appConfigsCurrency &&
              talent?.currency &&
              convertAppConfigIdToName(appConfigsCurrency, talent?.currency)}
          </b>
        </Col>
      </Row>

      <hr className="font-weight-bold hr-line" />
      {/* <Row justify="center">
        {talent && talent.resume && (
          <Col xs={12} sm={12} md={4} lg={4}>
            <a
              style={{ color: "blue" }}
              onClick={(e) => {
                e.preventDefault();
                window.open(`${BASE_URL}/${talentCv}`, "_blank");
              }}
            >
              Resume
            </a>
          </Col>
        )}

        {talent && talent.linkedIn && (
          <Col xs={12} sm={12} md={4} lg={4}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={linkedIn && linkedIn}
            >
              Linkedin
            </a>
          </Col>
        )}
        {talent && talent.github && (
          <Col xs={12} sm={12} md={4} lg={4}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={github && github}
            >
              GitHub
            </a>
          </Col>
        )}
        {talent && talent.stackOverflow && (
          <Col xs={12} sm={12} md={4} lg={4}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={talent.stackOverflow && talent.stackOverflow}
            >
              stackOverflow
            </a>
          </Col>
        )}
        {talent && talent.personalWebsite && (
          <Col xs={12} sm={12} md={4} lg={4}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={talent.personalWebsite && talent.personalWebsite}
            >
              Portfolio
            </a>
          </Col>
        )}
      </Row> */}
      <Row>
        {talent?.email && (
          <Col xs={12} sm={12} md={7} lg={7}>
            <MailOutlined className="font-18" />{" "}
            <span style={{ color: "blue" }}>{talent?.email}</span>
          </Col>
        )}
        {talent?.phone && (
          <Col xs={12} sm={12} md={5} lg={5}>
            <PhoneOutlined className="font-18" />{" "}
            <span style={{ color: "blue" }}>{talent?.phone}</span>
          </Col>
        )}

        {talent?.resume && (
          <Col xs={12} sm={12} md={3} lg={3}>
            <FileTextOutlined className="font-18" />{" "}
            <a
              style={{ color: "blue" }}
              onClick={(e) => {
                e.preventDefault();
                window.open(`${BASE_URL}/${talentCv}`, "_blank");
              }}
            >
              Resume
            </a>
          </Col>
        )}
        <Col xs={0} sm={0} md={4} lg={4} />
        {talent?.linkedIn && (
          <Col xs={6} sm={6} md={1} lg={1}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={linkedIn && linkedIn}
            >
              {" "}
              <LinkedinFilled className="font-18" />{" "}
            </a>
          </Col>
        )}
        {talent?.github && (
          <Col xs={6} sm={6} md={1} lg={1}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={github && github}
            >
              {" "}
              <GithubOutlined className="font-18" />{" "}
            </a>
          </Col>
        )}
        {talent?.stackOverflow && (
          <Col xs={6} sm={6} md={1} lg={1}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={talent.stackOverflow && talent.stackOverflow}
            >
              {" "}
              <DatabaseOutlined className="font-18" />
            </a>
          </Col>
        )}
        {talent?.personalWebsite && (
          <Col xs={6} sm={6} md={1} lg={1}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
              href={talent.personalWebsite && talent.personalWebsite}
            >
              {" "}
              <GlobalOutlined className="font-18" />{" "}
            </a>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default BasicInfo;
