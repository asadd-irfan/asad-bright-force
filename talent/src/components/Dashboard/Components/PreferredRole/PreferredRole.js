import React, { useEffect, useState } from "react";
import '@ant-design/compatible/assets/index.css';
import { Typography, Row, Col, Input, Tag, Slider, Button, Form, Select, Checkbox } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { loadAppConfigs, clearServerErrors } from "../../../../actions/auth";
import { resetNotificationSetting } from '../../../../actions/common';
import { updateRolePreferences } from "../../../../actions/rolePreferences";
import { suggestSkill } from '../../../../actions/professionalExperience';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import "./RolePreference.scss";
import { useHistory } from 'react-router-dom'
import SuggestSkills from './SuggestSkills'

const { Paragraph, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function PreferredRole(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const user = useSelector(state => state.auth.user);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
  const [suggestionFlag, setSuggestionFlag] = useState(false)
  const [suggestionMessage, setSuggestionMessage] = useState('')
  const [Suggestion, setSuggestion] = useState("");
  const [preferredRoleDescription, setPreferredRoleDescription] = useState(user.preferredRoles && user.preferredRoles.description)

  const appConfigs = useSelector(state => state.auth.appConfigs);
  const roleOptions = appConfigs && appConfigs['preferred-role']
  // const allSkills = appConfigs && appConfigs['skills']

  const appConfigTechExp = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs["skills"]
      ? state.auth.appConfigs["skills"]
      : null
  );
  const [selectedMainRoleSkill, setSelectedMainRoleSkill] = useState([]);
  const [autoCompleteMainRoleSkill, setAutoCompleteMainRoleSkill] = useState([]);
  const [mainRoleSkill, setMainRoleSkill] = useState([]);
  const [mainRoleSkills, setMainRoleSkills] = useState([]);

  const [selectedSecondaryRoleSkill, setSelectedSecondaryRoleSkill] = useState([]);
  const [autoCompleteSecondaryRoleSkill, setAutoCompleteSecondaryRoleSkill] = useState([]);
  const [secondaryRoleSkill, setSecondaryRoleSkill] = useState([]);
  const [secondaryRoleSkills, setSecondaryRoleSkills] = useState([]);

  const [manageExpCheckBox, setManageExpCheckBox] = useState(false);


  useEffect(() => {
    // console.log("test")

    dispatch(loadAppConfigs());
  }, []);



  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
  }, [serverErrors, showSuccessNotification])

  useEffect(() => {

    form.setFieldsValue({
      mainRoleName: user && user.preferredRoles && user.preferredRoles.mainRole ? user.preferredRoles.mainRole.name : null,
      mainRoleExp: user && user.preferredRoles && user.preferredRoles.mainRole ? user.preferredRoles.mainRole.yearsOfExperience : null,
      secondaryRoleName: user && user.preferredRoles && user.preferredRoles.secondaryRole ? user.preferredRoles.secondaryRole.name : null,
      secondaryRoleExp: user && user.preferredRoles && user.preferredRoles.secondaryRole ? user.preferredRoles.secondaryRole.yearsOfExperience : null,
      managementExperience: user?.preferredRoles?.managementExperience?.yearsOfExperience ? user?.preferredRoles?.managementExperience?.yearsOfExperience : null,
    });
    // for main role skills
    let userSelectedMainSkills = [];
    let userSelectedMainSkillsName = [];
    if (user && user.preferredRoles && user.preferredRoles.mainRole && user.preferredRoles.mainRole.skills) {
      appConfigTechExp && appConfigTechExp.map(techExp => {
        user.preferredRoles.mainRole.skills.filter(skill => {
          if (skill === techExp._id) {
            let selectedObj = { experienceId: skill, experienceName: techExp.name }
            userSelectedMainSkills.push(selectedObj)
            userSelectedMainSkillsName.push(selectedObj.experienceName)
          }
        })
      })

    }
    setMainRoleSkills(userSelectedMainSkills)
    setSelectedMainRoleSkill(userSelectedMainSkillsName)
    // for secondary roles skills
    let userSelectedSecondarySkills = [];
    let userSelectedSecondarySkillsName = [];
    if (user && user.preferredRoles && user.preferredRoles.secondaryRole && user.preferredRoles.secondaryRole.skills) {
      appConfigTechExp && appConfigTechExp.map(techExp => {
        user.preferredRoles.secondaryRole.skills.filter(skill => {
          if (skill === techExp._id) {
            let selectedObj = { experienceId: skill, experienceName: techExp.name }
            userSelectedSecondarySkills.push(selectedObj)
            userSelectedSecondarySkillsName.push(selectedObj.experienceName)
          }
        })
      })

    }
    setSecondaryRoleSkills(userSelectedSecondarySkills)
    setSelectedSecondaryRoleSkill(userSelectedSecondarySkillsName)
    // to set user management exp checkbox
    const ManageExpCheckBoxValue = user?.preferredRoles?.managementExperience?.status
    setManageExpCheckBox(ManageExpCheckBoxValue)

    let roleSkills = [];
    if (appConfigTechExp.length > 0) {
      appConfigTechExp.map(element => {
        roleSkills.push(element.name)
      })
      setMainRoleSkill(roleSkills)
      setSecondaryRoleSkill(roleSkills)
    }

  }, [])

  // useEffect(() => {

  //   form.setFieldsValue({
  //     mainRoleName: user && user.preferredRoles && user.preferredRoles.mainRole ? user.preferredRoles.mainRole.name : null,
  //     mainRoleExp: user && user.preferredRoles && user.preferredRoles.mainRole ? user.preferredRoles.mainRole.yearsOfExperience : null,
  //     secondaryRoleName: user && user.preferredRoles && user.preferredRoles.secondaryRole ? user.preferredRoles.secondaryRole.name : null,
  //     secondaryRoleExp: user && user.preferredRoles && user.preferredRoles.secondaryRole ? user.preferredRoles.secondaryRole.yearsOfExperience : null,
  //     managementExperience: user?.preferredRoles?.managementExperience?.yearsOfExperience ? user?.preferredRoles?.managementExperience?.yearsOfExperience : null,
  //   });

  //   // for main role skills
  //   let userSelectedMainSkills = [];
  //   let userSelectedMainSkillsName = [];
  //   if (user && user.preferredRoles && user.preferredRoles.mainRole && user.preferredRoles.mainRole.skills) {
  //     appConfigTechExp && appConfigTechExp.map(techExp => {
  //       user.preferredRoles.mainRole.skills.filter(skill => {
  //         if (skill === techExp._id) {
  //           let selectedObj = { experienceId: skill, experienceName: techExp.name }
  //           userSelectedMainSkills.push(selectedObj)
  //           userSelectedMainSkillsName.push(selectedObj.experienceName)
  //         }
  //       })
  //     })

  //   }
  //   setMainRoleSkills(userSelectedMainSkills)
  //   setSelectedMainRoleSkill(userSelectedMainSkillsName)
  //   // for secondary roles skills
  //   let userSelectedSecondarySkills = [];
  //   let userSelectedSecondarySkillsName = [];
  //   if (user && user.preferredRoles && user.preferredRoles.secondaryRole && user.preferredRoles.secondaryRole.skills) {
  //     appConfigTechExp && appConfigTechExp.map(techExp => {
  //       user.preferredRoles.secondaryRole.skills.filter(skill => {
  //         if (skill === techExp._id) {
  //           let selectedObj = { experienceId: skill, experienceName: techExp.name }
  //           userSelectedSecondarySkills.push(selectedObj)
  //           userSelectedSecondarySkillsName.push(selectedObj.experienceName)
  //         }
  //       })
  //     })

  //   }
  //   setSecondaryRoleSkills(userSelectedSecondarySkills)
  //   setSelectedSecondaryRoleSkill(userSelectedSecondarySkillsName)
  //   // to set user management exp checkbox
  //   const ManageExpCheckBoxValue = user?.preferredRoles?.managementExperience?.status
  //   setManageExpCheckBox(ManageExpCheckBoxValue)
  // }, [user, appConfigTechExp])

  // const suggestionHandler = () => {
  //   setSuggestionFlag(true)
  //   dispatch(suggestSkill({ skillName: Suggestion, userId: userId }));
  // };
  const inputChangeHandlerDescription = e => {
    setPreferredRoleDescription(e.target.value)
  }

  const handleSubmit = values => {
    let obj = {
      description: values.description,
      mainRole: {
        name: values.mainRoleName,
        yearsOfExperience: values.mainRoleExp,
        skills: mainRoleSkills.map(skill => skill.experienceId)
      },
      secondaryRole: {
        name: values.secondaryRoleName,
        yearsOfExperience: values.secondaryRoleExp,
        skills: secondaryRoleSkills.map(skill => skill.experienceId)
      },
      managementExperience: {
        status: manageExpCheckBox,
        yearsOfExperience: values.managementExperience,
      }
    }
    dispatch(updateRolePreferences(obj))
  };

  const openErrorNotification = () => {
    errorNotification(serverErrors);
    setSuggestionMessage('')
    dispatch(clearServerErrors());
  }

  const openSuccessNotification = () => {
    successNotification(apiResponse)
    if ((apiResponse.message === 'Record created Successfully!') && suggestionFlag) {
      setSuggestionMessage(`${Suggestion}, was submitted`);
      setSuggestionFlag(false)
    }
    setSuggestion(null);
    dispatch(resetNotificationSetting());
  };


  const mainRoleSkillHandleSearch = value => {
    let result;
    result = appConfigTechExp && appConfigTechExp.map(item => item.name).filter(item => {
      if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        return item
      }
      return null
    });
    setMainRoleSkill(result);
  };

  const mainRoleSkillsSelectHandler = (value) => {
    let resultObj = appConfigTechExp && appConfigTechExp.filter(item => {
      if (item.name === value) {
        return item
      }
    })
    if (!selectedMainRoleSkill.includes(value)) {
      selectedMainRoleSkill.push(value);
      setSelectedMainRoleSkill([...selectedMainRoleSkill]);
      let mainRoleSkillsLocally = [...mainRoleSkills];
      let isPushed = false;
      selectedMainRoleSkill.map((item, index) => {
        if (isPushed === false) {
          isPushed = true;
          let obj = {
            experienceId: resultObj && resultObj[0]._id,
            experienceName: value,
          }
          mainRoleSkillsLocally.push(obj);
        }
        return null
      });
      setMainRoleSkills([...mainRoleSkillsLocally]);
      setAutoCompleteMainRoleSkill('')
    }
    return "";
  };

  const mainRoleSkillsClearField = (e, index, value) => {
    e.preventDefault();
    let mainRoleSkillArr = selectedMainRoleSkill.filter(item => {
      if (item !== value) {
        return item
      }
      else { return null }
    })
    setSelectedMainRoleSkill(mainRoleSkillArr)

    let mainRoleSkillsLocally = mainRoleSkills.filter(item => {
      if (item.experienceName !== value) {
        return item
      }
      else { return null }
    })
    setMainRoleSkills(mainRoleSkillsLocally);
  }

  const secondaryRoleSkillHandleSearch = value => {
    let result;
    result = appConfigTechExp && appConfigTechExp.map(item => item.name).filter(item => {
      if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        return item
      }
      return null
    });
    setSecondaryRoleSkill(result);
  };

  const secondaryRoleSkillsSelectHandler = (value) => {
    let resultObj = appConfigTechExp && appConfigTechExp.filter(item => {
      if (item.name === value) {
        return item
      }
    })
    if (!selectedSecondaryRoleSkill.includes(value)) {
      selectedSecondaryRoleSkill.push(value);
      setSelectedSecondaryRoleSkill([...selectedSecondaryRoleSkill]);
      let secondaryRoleSkillsLocally = [...secondaryRoleSkills];
      let isPushed = false;
      selectedSecondaryRoleSkill.map((item, index) => {
        if (isPushed === false) {
          isPushed = true;
          let obj = {
            experienceId: resultObj && resultObj[0]._id,
            experienceName: value,
          }
          secondaryRoleSkillsLocally.push(obj);
        }
        return null
      });
      setSecondaryRoleSkills([...secondaryRoleSkillsLocally]);
      setAutoCompleteSecondaryRoleSkill('')
    }
    return "";
  };

  const secondaryRoleSkillsClearField = (e, index, value) => {
    e.preventDefault();
    let secondaryRoleSkillArr = selectedSecondaryRoleSkill.filter(item => {
      if (item !== value) {
        return item
      }
      else { return null }
    })
    setSelectedSecondaryRoleSkill(secondaryRoleSkillArr)

    let secondaryRoleSkillsLocally = secondaryRoleSkills.filter(item => {
      if (item.experienceName !== value) {
        return item
      }
      else { return null }
    })
    setSecondaryRoleSkills(secondaryRoleSkillsLocally);
  }

  const manageExpCheckBoxHandler = (e) => {
    setManageExpCheckBox(e.target.checked)
  }
  const moveToPreviousPage = () => {
    history.push('/talent/profile')
  }
  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
    >
      <div>
        <div className="preferred-role-wrapper">
          <Title level={1}>Role preferences</Title>
        </div>
        <div className="choose-role-wrapper mb-5">
          <Title level={3}>What is your next preferred role?</Title>
        </div>
        <div className="mb-4 my-3" id='main-role'>
          <Row>
            <Col xs={8} sm={8} md={5} lg={5}>
              <Title level={3}>Main Role </Title>
            </Col>
            <Col xs={16} sm={16} md={7} lg={7}>
              <Form.Item name='mainRoleName'>
                <Select
                  allowClear
                  style={{ width: 283 }}
                  placeholder="I'm Looking For a Job as a..."
                >
                  {roleOptions && roleOptions.map((role, index) => {
                    return <Option key={index} value={role._id}>{role.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} style={{ top: '-40px' }}>
              <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph >
              <Form.Item name='mainRoleExp'>
                <Slider
                  marks={{
                    0: "0",
                    5: "5",
                    10: "10",
                    15: "15",
                    20: "20"
                  }}
                  min={0}
                  max={20}
                  style={{ marginLeft: "25px", marginTop: "5px" }}
                  className="ant-slider-custom-styles"
                />
              </Form.Item>

            </Col>
          </Row>


          {user && user.isDeveloper &&
            <>
              <Row id='tech-experience'>
                <Col xs={0} sm={0} md={5} lg={5}>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                  <Paragraph style={{ color: 'black', fontSize: '18px' }}>Skills</Paragraph >
                </Col>
              </Row>
              <Row id='tech-experience'>
                <Col xs={0} sm={0} md={5} lg={5}>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Select
                    style={{ width: '100%', marginBottom: "20px" }}
                    onSearch={mainRoleSkillHandleSearch}
                    onSelect={mainRoleSkillsSelectHandler}
                    value={autoCompleteMainRoleSkill}
                    showSearch
                    showArrow={false}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Type a skill, e.g. React"
                  >
                    {mainRoleSkill.map(exp => (
                      <Option key={exp}>{exp}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row justify='start'>
                <Col xs={1} sm={1} md={5} lg={5}></Col>
                <Col xs={23} sm={23} md={12} lg={12}>
                  {mainRoleSkills.map((item, index) => (
                    <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => mainRoleSkillsClearField(e, index, item.experienceName)}>
                      {item.experienceName}
                    </Tag>
                  ))}
                </Col>
              </Row>

            </>
          }
        </div>

        <div className="mb-4 my-3" id='secondary-role'>
          <Row style={{ marginTop: '50px' }}>
            <Col xs={8} sm={8} md={5} lg={5}>
              <Title level={3}>Secondary Role </Title>
            </Col>
            <Col xs={16} sm={16} md={7} lg={7}>
              <Form.Item name='secondaryRoleName'>
                <Select
                  allowClear
                  style={{ width: 283 }}
                  placeholder="I'm Looking For a Job as a..."
                >
                  {roleOptions && roleOptions.map((role, index) => {
                    return <Option key={index} value={role._id}>{role.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} style={{ top: '-40px' }}>
              <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph >
              <Form.Item name='secondaryRoleExp'>
                <Slider
                  marks={{
                    0: "0",
                    5: "5",
                    10: "10",
                    15: "15",
                    20: "20"
                  }}
                  min={0}
                  max={20}
                  style={{ marginLeft: "25px", marginTop: "5px" }}
                  className="ant-slider-custom-styles"
                />
              </Form.Item>

            </Col>
          </Row>

          {user && user.isDeveloper &&
            <>
              <Row id='tech-experience'>
                <Col xs={0} sm={0} md={5} lg={5}>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16}>
                  <Paragraph style={{ color: 'black', fontSize: '18px' }}>Skills</Paragraph>
                </Col>
              </Row>
              <Row id='tech-experience'>
                <Col xs={0} sm={0} md={5} lg={5}>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Select
                    style={{ width: '100%', marginBottom: "20px" }}
                    onSearch={secondaryRoleSkillHandleSearch}
                    onSelect={secondaryRoleSkillsSelectHandler}
                    value={autoCompleteSecondaryRoleSkill}
                    showSearch
                    showArrow={false}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Type a skill, e.g. React"
                  >
                    {secondaryRoleSkill.map(exp => (
                      <Option key={exp}>{exp}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row justify='start'>
                <Col xs={1} sm={1} md={5} lg={5}></Col>
                <Col xs={23} sm={23} md={12} lg={12}>
                  {secondaryRoleSkills.map((item, index) => (
                    <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => secondaryRoleSkillsClearField(e, index, item.experienceName)}>
                      {item.experienceName}
                    </Tag>
                  ))}
                </Col>
              </Row>
            </>}
        </div>

        <SuggestSkills />
        {/* <div className="my-5">

          <Row className="mt-3 mb-3">
            <Col xs={8} sm={8} md={5} lg={5}>
              <Title level={3}>Missing a Skill? </Title>
            </Col>
            <Col xs={16} sm={16} md={10} lg={10}>
              <Input
                value={Suggestion}
                onChange={e => {
                  setSuggestion(e.target.value);
                }}
              />
              <Paragraph style={{ color: 'green' }}>{suggestionMessage}</Paragraph>
            </Col>
            <Col xs={12} sm={12} md={1} lg={1}></Col>
            <Col xs={12} sm={12} md={4} lg={4}>
              <Button type="primary" onClick={suggestionHandler}>
                Suggest
            </Button>
            </Col>
          </Row>
        </div>
        */}
        <div className="my-5" id='management'>
          <Title level={3}>Management Experience</Title>
          <Row className="my-3">

            <Col xs={0} sm={0} md={5} lg={5}>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Checkbox onChange={manageExpCheckBoxHandler} className="checkbox-style" checked={manageExpCheckBox}>
                I have managerial experience
              </Checkbox>
            </Col>

          </Row>

          {manageExpCheckBox && <Row className="mt-5">

            <Col xs={0} sm={0} md={5} lg={5}>
            </Col>
            <Col xs={10} sm={10} md={5} lg={5}>
              <Paragraph>Management experience (Years)</Paragraph>
            </Col>
            <Col xs={14} sm={14} md={7} lg={7}>
              <Form.Item name='managementExperience'>
                <Slider
                  marks={{
                    0: "0",
                    5: "5",
                    10: "10",
                    15: "15",
                    20: "20"
                  }}
                  min={0}
                  max={20}
                  style={{ marginLeft: "25px", marginTop: "5px" }}
                  className="ant-slider-custom-styles"
                />
              </Form.Item>
            </Col>

          </Row>}

        </div>
        <div>
          {/* <Title level={3} className="mt-4">
            Please describe your preferred role
        </Title>
          <Paragraph>Describe what you are looking for</Paragraph>

          <Form.Item name='description'>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <TextArea rows={5} value={preferredRoleDescription} onChange={inputChangeHandlerDescription} />
              </Col>
            </Row>
          </Form.Item> */}
          <Row >
            <Col xs={24} sm={24} md={24} lg={24} >
              <Form.Item>
                {/* <Button type="primary" className="m-2" onClick={moveToPreviousPage}>
                  Back
              </Button> */}
                <Button type="primary" className="m-2" htmlType="submit" loading={btnLoading}>
                  Save
              </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
}

export default PreferredRole;
