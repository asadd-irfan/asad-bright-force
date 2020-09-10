import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Tag } from "antd";
import { useSelector } from "react-redux";

const { Paragraph, Title } = Typography;

function ExperienceCard() {
  const user = useSelector((state) => state.talents.selectedTalent);

  const preferredRoles = useSelector(
    (state) =>
      state.talents.selectedTalent &&
      state.talents.selectedTalent.preferredRoles
  );

  const [mainRoleName, setMainRoleName] = useState("");
  const [secondaryRoleName, setSecondaryRoleName] = useState("");
  const [mainRoleSkills, setMainRoleSkills] = useState([]);
  const [secondaryRoleSkills, setSecondaryRoleSkills] = useState([]);
  const appConfigs = useSelector((state) => state.auth.appConfigs);
  let roleOptions = appConfigs && appConfigs["preferred-role"];
  const appConfigTechExp = useSelector((state) =>
    state.auth.appConfigs && state.auth.appConfigs["skills"]
      ? state.auth.appConfigs["skills"]
      : null
  );
  const appConfigLanguages = useSelector((state) =>
    state.auth.appConfigs && state.auth.appConfigs["language"]
      ? state.auth.appConfigs["language"]
      : null
  );
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    roleOptions &&
      roleOptions.filter((role) => {
        if (preferredRoles && preferredRoles.secondaryRole) {
          if (role._id === preferredRoles.secondaryRole.name) {
            setSecondaryRoleName(role.name);
          }
        }
      });
    roleOptions &&
      roleOptions.filter((role) => {
        if (preferredRoles && preferredRoles.mainRole) {
          if (role._id === preferredRoles.mainRole.name) {
            setMainRoleName(role.name);
          }
        }
      });
  }, [roleOptions]);
  useEffect(() => {
    // for main role skills
    let userSelectedMainSkills = [];
    if (
      preferredRoles &&
      preferredRoles.mainRole &&
      preferredRoles.mainRole.skills
    ) {
      appConfigTechExp &&
        appConfigTechExp.map((techExp) => {
          preferredRoles.mainRole.skills.filter((skill) => {
            if (skill === techExp._id) {
              let selectedObj = {
                experienceId: skill,
                experienceName: techExp.name,
              };
              userSelectedMainSkills.push(selectedObj);
            }
          });
        });
    }
    setMainRoleSkills(userSelectedMainSkills);
    // for secondary roles skills
    let userSelectedSecondarySkills = [];
    if (
      preferredRoles &&
      preferredRoles.secondaryRole &&
      preferredRoles.secondaryRole.skills
    ) {
      appConfigTechExp &&
        appConfigTechExp.map((techExp) => {
          preferredRoles.secondaryRole.skills.filter((skill) => {
            if (skill === techExp._id) {
              let selectedObj = {
                experienceId: skill,
                experienceName: techExp.name,
              };
              userSelectedSecondarySkills.push(selectedObj);
            }
          });
        });
    }
    setSecondaryRoleSkills(userSelectedSecondarySkills);
  }, [appConfigTechExp]);

  useEffect(() => {
    // for languages
    let userSelectedLanguages = [];
    if (user && user.languages) {
      appConfigLanguages &&
        appConfigLanguages.map((appConfigLang) => {
          user.languages.filter((lang) => {
            if (lang.name === appConfigLang._id) {
              let selectedObj = {
                languageId: appConfigLang._id,
                languageName: appConfigLang.name,
                languageProficiency: lang.priorityOrder,
              };
              userSelectedLanguages.push(selectedObj);
            }
          });
        });
    }

    setLanguages(userSelectedLanguages);
  }, [user, appConfigLanguages]);

  return (
    <div>
      <Card style={{ margin: "12px 0px" }}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Title level={2} className="mb-4">
              Professional Experience
            </Title>
            <Row>
              {/* <h5>Main Role: </h5> */}
              <Tag color="blue" className="font-weight-bold mb-4">
                {" "}
                {mainRoleName}
              </Tag>
              {preferredRoles?.mainRole?.yearsOfExperience !== null && (
                <Paragraph className="font-weight-bold mb-4">
                  {preferredRoles?.mainRole?.yearsOfExperience} year of
                  Experience
                </Paragraph>
              )}
            </Row>
            <Row>
              {/* <h5>Secondary Role: </h5> */}
              <Tag color="blue" className="font-weight-bold mb-4">
                {" "}
                {secondaryRoleName}
              </Tag>
              {preferredRoles?.secondaryRole?.yearsOfExperience !== null && (
                <Paragraph className="font-weight-bold mb-4">
                  {preferredRoles?.secondaryRole?.yearsOfExperience} year of
                  Experience
                </Paragraph>
              )}
            </Row>

            {user && user.isDeveloper && (
              <>
                <Title level={3}>Skills</Title>
                <Paragraph>
                  {mainRoleSkills.map((item, index) => (
                    <Tag
                      key={index}
                      style={{
                        margin: "0px 15px 5px 0px",
                        padding: "3px 8px",
                        fontSize: "16px",
                      }}
                    >
                      {item.experienceName}
                    </Tag>
                  ))}{" "}
                  {secondaryRoleSkills.map((item, index) => (
                    <Tag
                      key={index}
                      style={{
                        margin: "0px 15px 5px 0px",
                        padding: "3px 8px",
                        fontSize: "16px",
                      }}
                    >
                      {item.experienceName}
                    </Tag>
                  ))}
                </Paragraph>
              </>
            )}
          </Col>
          {/* <Col xs={24} sm={24} md={12} lg={12}>
                    <Title level={2} className='mb-4'>Secondary Role</Title>
                    <Paragraph className="font-weight-bold mb-4">{secondaryRoleName}</Paragraph>
                    {preferredRoles?.secondaryRole?.yearsOfExperience !==  null && <Paragraph className="font-weight-bold mb-4">{preferredRoles?.secondaryRole?.yearsOfExperience} year of Experience</Paragraph > }
                    {user && user.isDeveloper && <><Title level={3}>Skills</Title>
                    <Paragraph>
                        {secondaryRoleSkills.map((item, index) => (
                            <Tag key={index} style={{ margin: '0px 15px 5px 0px', padding: '3px 8px', fontSize: '16px' }}>
                                {item.experienceName}
                            </Tag>
                        ))}
                    </Paragraph></>}
                </Col> */}
          <Col xs={24} sm={24} md={12} lg={12}>
            <Title level={2} className="mb-4">
              Languages
            </Title>
            {languages &&
              languages.map((lang) => (
                <>
                  <Tag className="font-weight-bold mb-4">
                    {" "}
                    {lang.languageName}
                  </Tag>{" "}
                  <br />
                </>
              ))}
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default ExperienceCard;
