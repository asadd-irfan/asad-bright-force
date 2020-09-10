import React from "react";
import { Avatar, Row, Card, Col, Tag, Typography } from "antd";
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
import { useSelector } from "react-redux";
import "./viewProfile.scss";
import { BASE_URL } from "../../../../common/constants";

const { Paragraph } = Typography;

function BasicInfoCard() {
  const user = useSelector((state) => state.auth.user);
  const employmentType = user && user.employmentType && user.employmentType;
  const currency = user && user.currency;
  const role = user && user.role;
  const appConfigsEmploymentType = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["employment-type"]
  );
  const appConfigsCurrency = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["currency"]
  );
  const appConfigsRoles = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["roles"]
  );
  const aboutMe = useSelector(
    (state) => state.auth.user && state.auth.user.aboutMe
  );
  const myAchievements = useSelector(
    (state) => state.auth.user && state.auth.user.myAchievements
  );
  // const salary = useSelector(state => state.auth.user && state.auth.user.salary && state.auth.user.salary.minSalary);
  const talentCv = useSelector(
    (state) => state.auth.user && state.auth.user.resume
  );
  const linkedIn = useSelector(
    (state) => state.auth.user && state.auth.user.linkedIn
  );
  const github = useSelector(
    (state) => state.auth.user && state.auth.user.github
  );

  const profilePicURL = useSelector(
    (state) => state.auth.user && user.profileImage
  );

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
  const convertAppConfigIdToName = (ConfigsOptions, selectedConfigs) => {
    let name;
    // console.log('ConfigsOptions',ConfigsOptions)
    // console.log('selectedConfigs',selectedConfigs)
    ConfigsOptions.map((item) => {
      if (selectedConfigs === item._id) {
        name = item.name;
      }
    });
    return name;
  };

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <Card style={{ margin: "8px 0px" }}>
        <Row justify="space-between">
          <Col xs={24} sm={24} md={6} lg={6}>
            <Avatar
              shape="square"
              size={140}
              //   src={profilePicURL && `/${profilePicURL}`}
              src={
                profilePicURL?.includes("http")
                  ? profilePicURL
                  : `/${profilePicURL}`
              }
              icon={<UserOutlined />}
            />
          </Col>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Row>
              <h2 className="m-2">{user.name}</h2>{" "}
              <Tag style={{ padding: 7 }} className="ml-5 m-2" color="blue">
                {appConfigsRoles &&
                  role &&
                  convertAppConfigIdToName(appConfigsRoles, role)}
              </Tag>
            </Row>

            <Row justify="space-between" className="mt-3">
              <Col xs={24} sm={24} md={8} lg={8}>
                {/* <Paragraph className="font-weight-bold">{user && user.location && user.location.city + ", " + user.location.country}</Paragraph > */}
                <Paragraph className="font-weight-bold">
                  <span className="font-weight-bold">Location : </span>
                  {" " + user?.location?.city
                    ? user?.location?.city
                    : "" + " " + user?.location?.country
                      ? ", " + user?.location?.country
                      : ""}
                </Paragraph>
              </Col>
              {/* <Col xs={24} sm={24} md={12} lg={12} className='text-align'>
                                    <Paragraph ><span className="font-weight-bold">
                                        Type of employment:
                                            </span>
                                        {
                                            appConfigsEmploymentType && employmentType &&
                                            convertConfigsIdToName(appConfigsEmploymentType, employmentType).map(item => {
                                                return <>  {item}</>

                                            })
                                        }
                                    </Paragraph>
                                </Col> */}
            </Row>
          </Col>
        </Row>
        {/* <Row justify='start'>
                    <Col xs={24} sm={24} md={6} lg={6}>

                    </Col>
                    <Col xs={24} sm={24} md={2} lg={2} className='text-align'>
                        <span className="font-weight-bold">About Me :</span>
                    </Col>
                    <Col xs={24} sm={24} md={15} lg={15} className='text-align'>
                        <Paragraph >{aboutMe && aboutMe}</Paragraph>
                    </Col>
                </Row>
                <Row justify='start'>
                    <Col xs={24} sm={24} md={6} lg={6}>

                    </Col>
                    <Col xs={24} sm={24} md={4} lg={4} className='text-align'>
                        <span className="font-weight-bold">Greatest achievements:</span>
                    </Col>
                    <Col xs={24} sm={24} md={14} lg={14} className='text-align'>
                        <Paragraph >{myAchievements && myAchievements}</Paragraph>
                    </Col>
                </Row> */}
        <Row justify="start">
          <Col xs={24} sm={24} md={6} lg={6} />
          <Col xs={24} sm={24} md={2} lg={2} className="text-align">
            <span className="font-weight-bold">summary :</span>
          </Col>
          <Col xs={24} sm={24} md={15} lg={15} className="text-align">
            <Paragraph>{user?.summary}</Paragraph>
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
                ).map((item) => {
                  return <> {item}</>;
                })}
            </b>{" "}
            job, at a base salary of{" "}
            <b>
              {user?.salary?.minSalary}{" "}
              {" " + appConfigsCurrency &&
                currency &&
                convertAppConfigIdToName(appConfigsCurrency, currency)}
            </b>
          </Col>
        </Row>
        <Row justify="start">
          <Col xs={24} sm={24} md={6} lg={6} />
          <Col xs={24} sm={24} md={8} lg={8} className="text-align">
            {/* <Paragraph >
                                <span className="font-weight-bold">Preference: </span>
                                {
                                          appConfigsRoles && role &&
                                          convertConfigIdToName(appConfigsRoles, role).map(item => {
                                              return <> {item}</>
                                          })
                                      }</Paragraph> */}
          </Col>
          <Col xs={24} sm={24} md={9} lg={9} className="text-align">
            {/* <Paragraph >
                                <span className="font-weight-bold">At a base salary of :</span>
                                <span>{salary && salary} 
                                {
                                          appConfigsCurrency && currency &&
                                          convertConfigIdToName(appConfigsCurrency, currency).map(item => {
                                              console.log('item',item)
                                              return <> {item}</>
                                          })
                                      }
                                      </span></Paragraph> */}
          </Col>
        </Row>

        <hr className="font-weight-bold hr-line" />
        <Row>
          {user.email && (
            <Col xs={12} sm={12} md={7} lg={7}>
              <MailOutlined className="font-18" />{" "}
              <span style={{ color: "blue" }}>{user?.email}</span>
            </Col>
          )}
          {user.phone && (
            <Col xs={12} sm={12} md={5} lg={5}>
              <PhoneOutlined className="font-18" />{" "}
              <span style={{ color: "blue" }}>{user?.phone}</span>
            </Col>
          )}

          {user.resume && (
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
          {user.linkedIn && (
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
          {user.github && (
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
          {user.stackOverflow && (
            <Col xs={6} sm={6} md={1} lg={1}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
                href={user.stackOverflow && user.stackOverflow}
              >
                {" "}
                <DatabaseOutlined className="font-18" />
              </a>
            </Col>
          )}
          {user.personalWebsite && (
            <Col xs={6} sm={6} md={1} lg={1}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
                href={user.personalWebsite && user.personalWebsite}
              >
                {" "}
                <GlobalOutlined className="font-18" />{" "}
              </a>
            </Col>
          )}
          {/* {
                       user.linkedIn && <Col xs={12} sm={12} md={3} lg={3}>
                          <LinkedinFilled className="font-18" />   <a target='_blank' rel="noopener noreferrer" style={{ color: 'blue' }} href={linkedIn && linkedIn}>Linkedin</a>
                        </Col>
                    }
                    {
                        user.github && <Col xs={12} sm={12} md={3} lg={3}>
                          <GithubOutlined className="font-18" />  <a target='_blank' rel="noopener noreferrer" style={{ color: 'blue' }} href={github && github}>GitHub</a>
                        </Col>
                    }
                    {
                        user.stackOverflow && <Col xs={12} sm={12} md={3} lg={3}>
                           <DatabaseOutlined className="font-18" /> <a target='_blank' rel="noopener noreferrer" style={{ color: 'blue' }} href={user.stackOverflow && user.stackOverflow}>stackOverflow</a>
                        </Col>
                    }
                    {
                        user.personalWebsite
                        && <Col xs={12} sm={12} md={3} lg={3}>
                          <GlobalOutlined className="font-18" />  <a target='_blank' rel="noopener noreferrer" style={{ color: 'blue' }} href={user.personalWebsite
                                && user.personalWebsite
                            }>Portfolio</a>
                        </Col>
                    } */}
        </Row>
      </Card>
    </div>
  );
}

export default BasicInfoCard;
