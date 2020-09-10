import React, { useState, useEffect } from 'react';
import { TimePicker, Typography, Checkbox, Row, Col, Input, Tag, Slider, Button, Form, Select, Layout, InputNumber, Radio } from "antd";
import '@ant-design/compatible/assets/index.css';
import ViewPositionSidePanel from './ViewPositionSidePanel'
import { useSelector, useDispatch } from "react-redux";
import '../recruitment.scss';
import { useParams } from "react-router";
import TagInput from '../EditPosition/TagInput'
import { getCompanyPositionDetails, setSelectedPositionId } from '../../../actions/positions'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import moment from 'moment'
import AccountManagerCard from '../AccountManager/AccountManagerCard'
const array = require('lodash/array');

const { Content, Sider } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = TimePicker;

const ViewPosition = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const positionId = id;
  const [form] = Form.useForm();
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const companyUsers = useSelector(state => state.company.companyUsers);
  const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails);
  const companyDetails = useSelector(state => state.company.companyDetails);
  const roleOptions = appConfigs && appConfigs['preferred-role']
  const employmentOptions = appConfigs && appConfigs['employment-type']
  const appConfigTechExp = appConfigs && appConfigs['skills']
  const currencyOptions = appConfigs && appConfigs['currency']
  const timezoneOptions = appConfigs && appConfigs['timezone']
  const positionOfferOptions = appConfigs && appConfigs['position-offer']
  const roleFeaturesKey = 'role-features'
  const appConfigRoles = appConfigs && appConfigs[roleFeaturesKey]

  const [selectedMainRoleSkill, setSelectedMainRoleSkill] = useState([]);
  const [autoCompleteMainRoleSkill, setAutoCompleteMainRoleSkill] = useState([]);
  const [mainRoleSkill, setMainRoleSkill] = useState([]);
  const [mainRoleSkills, setMainRoleSkills] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [autoCompleteUser, setAutoCompleteUser] = useState([]);
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);

  const [manageExpCheckBox, setManageExpCheckBox] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSortedRoles, setSelectedSortedRoles] = useState([
    { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
  ]);

  const [timezoneName, setTimezoneName] = useState(null)

  useEffect(() => {
    dispatch(getCompanyPositionDetails(positionId))
    dispatch(setSelectedPositionId(positionId))

  }, [])

  useEffect(() => {
    form.setFieldsValue({
      title: companyPositionDetails?.title ? companyPositionDetails?.title : '',
      mainResponsibilities: companyPositionDetails?.mainResponsibilities ? companyPositionDetails?.mainResponsibilities : '',
      employmentType: companyPositionDetails?.employmentType?._id ? companyPositionDetails?.employmentType?._id : '',
      salary: companyPositionDetails?.positionOffer?.salary ? companyPositionDetails?.positionOffer?.salary : '',
      currency: companyPositionDetails?.positionOffer?.currency ? companyPositionDetails?.positionOffer?.currency : '',
      signingBonus: companyPositionDetails?.positionOffer?.signingBonus ? companyPositionDetails?.positionOffer?.signingBonus : '',
      equity: companyPositionDetails?.positionOffer?.equity ? companyPositionDetails?.positionOffer?.equity : '',
      performanceBonus: companyPositionDetails?.positionOffer?.performanceBonus ? companyPositionDetails?.positionOffer?.performanceBonus : '',
      managementExperience: companyPositionDetails?.managementExperience?.yearsOfExperience ? companyPositionDetails?.managementExperience?.yearsOfExperience : null,
      roleName: companyPositionDetails?.role?.name?._id ? companyPositionDetails?.role?.name?._id : null,
      roleExp: companyPositionDetails?.role?.yearsOfExperience ? companyPositionDetails?.role?.yearsOfExperience : null,
      // workingHours: [companyPositionDetails?.workingHours?.endingHour ? moment(companyPositionDetails?.workingHours?.endingHour) : null, 
      // 	companyPositionDetails?.workingHours?.startingHour ? moment(companyPositionDetails?.workingHours?.startingHour) : null],
      workingTimeFlexibility: companyPositionDetails?.workingTimeFlexibility ? companyPositionDetails?.workingTimeFlexibility : '',
      timezone: companyPositionDetails?.timezone ? companyPositionDetails?.timezone : null,

    });
    // console.log('companyPositionDetails',companyPositionDetails)
    // for main role skills
    let userSelectedMainSkills = [];
    let userSelectedMainSkillsName = [];
    if (companyPositionDetails?.skills) {
      appConfigTechExp && appConfigTechExp.map(techExp => {
        companyPositionDetails.skills.filter(skill => {
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

    // for hiring team member
    let userSelectedUser = [];
    let userSelectedUserName = [];
    if (companyPositionDetails?.hiringTeam) {
      companyUsers && companyUsers.map(companyUser => {
        companyPositionDetails.hiringTeam.filter(user => {
          if (user === companyUser._id) {
            let selectedObj = { userId: user, userName: companyUser.fullName }
            userSelectedUser.push(selectedObj)
            userSelectedUserName.push(selectedObj.userName)
          }
        })
      })
    }
    setUsers(userSelectedUser)
    setSelectedUser(userSelectedUserName)

    // to set user management exp checkbox
    const ManageExpCheckBoxValue = companyPositionDetails?.managementExperience?.status
    setManageExpCheckBox(ManageExpCheckBoxValue)

    // for roles + priority
    let selectedRoles = []

    if (companyPositionDetails?.positionFeatures?.length > 0) {
      selectedRoles = companyPositionDetails?.positionFeatures.map(item => {
        return item && item.feature;
      });
      let userSelectedRoles = [];

      companyPositionDetails.positionFeatures.map((value, index) => {
        if (companyPositionDetails?.positionFeatures[index]) {
          let selectedRoleIndex = array.findIndex(appConfigRoles, function (o) { return o._id === value.feature })
          if (selectedRoleIndex > -1) {
            userSelectedRoles.push({ tagId: appConfigRoles[selectedRoleIndex]._id, tagName: appConfigRoles[selectedRoleIndex].name, priorityOrder: value.priorityOrder })
          }
        }
        return null
      })
      let populateUserSelectedRoles = selectedSortedRoles;
      populateUserSelectedRoles.map((value, index) => {
        if (userSelectedRoles[index]) {
          populateUserSelectedRoles[index] = { id: "item-" + (index + 1), "tagId": userSelectedRoles[index].tagId, "tagName": userSelectedRoles[index].tagName, "priorityOrder": userSelectedRoles[index].priorityOrder };
        }
        return null
      })
      setSelectedRoles([...selectedRoles])
      setSelectedSortedRoles([...populateUserSelectedRoles])
    }
    else {
      setSelectedSortedRoles([
        { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
        { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
        { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
      ])
      setSelectedRoles([])
    }

    timezoneOptions && timezoneOptions.map(time => {
			if (time._id === companyDetails?.timezone) {
				setTimezoneName(time.name)
			}
    })
    
  }, [companyDetails, companyPositionDetails, appConfigTechExp, appConfigRoles, companyUsers])

  const goToEditPositionPage = () => {
    history.push(`/company/hire/recruitment/edit-position/${positionId}`);
  }
  const goToRequirementsPage = () => {
    history.push(`/company/hire/recruitment/details/${positionId}`);
  }

  // for users
  const userHandleFocus = e => {
    let value = e.target.value
    let result;
    result = companyUsers && companyUsers.map(item => item.fullName).filter(item => {
      if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) {
        return item
      }
      return null
    });
    setUser(result);
  };

  const userSelectHandler = (value) => {
    let resultObj = companyUsers && companyUsers.filter(item => {
      if (item.fullName === value) {
        return item
      }
    })
    if (!selectedUser.includes(value)) {
      selectedUser.push(value);
      setSelectedUser([...selectedUser]);
      let usersLocally = [...users];
      let isPushed = false;
      selectedUser.map((item, index) => {
        if (isPushed === false) {
          isPushed = true;
          let obj = {
            userId: resultObj && resultObj[0]._id,
            userName: value,
          }
          usersLocally.push(obj);
        }
        return null
      });
      setUsers([...usersLocally]);
      setAutoCompleteUser('')
    }
    return "";
  };

  const userClearField = (e, index, value) => {
    e.preventDefault();
    let userArr = selectedUser.filter(item => {
      if (item !== value) {
        return item
      }
      else { return null }
    })
    setSelectedUser(userArr)

    let usersLocally = users.filter(item => {
      if (item.userName !== value) {
        return item
      }
      else { return null }
    })
    setUsers(usersLocally);
  }

  // for skills
  const mainRoleSkillHandleFocus = e => {
    let value = e.target.value
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

  const manageExpCheckBoxHandler = (e) => {
    setManageExpCheckBox(e.target.checked)
  }

  const handleTagChange = (checked, id, name, key, isDisabled) => {

    if (!isDisabled) {
      if (key === roleFeaturesKey) {
        let selectedRolesLocally = selectedRoles;
        if (checked && selectedRolesLocally.length < 3) {
          selectedRolesLocally.push(id);

          let selectedSortedRolesLocally = [...selectedSortedRoles];
          let isPushed = false
          selectedSortedRolesLocally.map((item, index) => {
            if (selectedSortedRolesLocally[index].tagName === null && isPushed === false) {
              isPushed = true;
              selectedSortedRolesLocally[index].tagName = name;
              selectedSortedRolesLocally[index].tagId = id;
            }
            return null
          });

          setSelectedRoles([...selectedRolesLocally])
          setSelectedSortedRoles([...selectedSortedRolesLocally]);

        }
        else if (!checked && selectedRoles.includes(id)) {
          let selectedRolesLocally = selectedRoles;

          let filteredItems = selectedRolesLocally.filter(function (item) {
            return item !== id;
          });
          if (selectedRoles.length > 0) {
            selectedSortedRoles.map((item, ind) => {
              if (item.tagId === id) {
                selectedSortedRoles[ind].tagName = null;
                selectedSortedRoles[ind].tagId = null;
              }
              return null
            });

            setSelectedRoles(filteredItems);
          }
          let nullItems = []
          let filledItems = selectedSortedRoles.filter(item => {
            if (item.tagId === null) {
              nullItems.push(item)
              return null
            }
            else if (item.tagId !== null) {
              return item
            }
          })
          setSelectedSortedRoles([...filledItems, ...nullItems]);
        }
      }
    }


  };

  return (
    <div style={{ padding: '25px 15px' }}>
      <Form
        form={form}
        layout={'vertical'}
      >
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            theme='light'
            width={300}
          >
            <ViewPositionSidePanel positionTitle={form.getFieldValue('title')} positionId={positionId}/>
            <div className="my-5">
            <AccountManagerCard />
            </div>
          </Sider>
          <Layout>
            <Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
              <div style={{ backgroundColor: 'white', marginLeft: '25px', borderRadius: '7px', padding: '15px' }}>



                <div className='hiring-team-wrapper'>
                  <div className='main-heading-wrapper'>
                    <Title level={3}>Hiring Team</Title>
                  </div>
                  <Paragraph style={{ margin: '10px 0px' }}>Who else is on the hiring team?</Paragraph>
                  <>
                    <Row id='tech-experience'>
                      <Col xs={0} sm={0} md={5} lg={5}>
                      </Col>
                      <Col xs={24} sm={24} md={16} lg={16}>
                        {/* <Paragraph style={{ color: 'black', fontSize: '18px' }}>Add Users</Paragraph > */}
                      </Col>
                    </Row>
                    <Row id='tech-experience'>
                      <Col xs={0} sm={0} md={5} lg={5}>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Select
                          style={{ width: '100%', marginBottom: "20px" }}
                          onFocus={userHandleFocus}
                          onSelect={userSelectHandler}
                          value={autoCompleteUser}
                          showSearch
                          showArrow={false}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          disabled
                        >
                          {user.map(user => (
                            <Option key={user}>{user}</Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>

                    <Row justify='start'>
                      <Col xs={1} sm={1} md={5} lg={5}></Col>
                      <Col xs={23} sm={23} md={12} lg={12}>
                        {users.map((item, index) => (
                          <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} onClose={(e) => userClearField(e, index, item.userName)}>
                            {item.userName}
                          </Tag>
                        ))}
                      </Col>
                    </Row>

                  </>
                </div>

                <div className='position-requirements-wrapper'>
                  <div className='main-heading-wrapper'>
                    <Title level={3}>Position requirements</Title>
                  </div>

                  <Row style={{ marginTop: '20px' }}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <h5>Title</h5>
                      <Form.Item name='title' rules={
                        [
                          {
                            required: true,
                            message: "Please input Title"
                          }
                        ]
                      }>
                        <Input disabled placeholder="Ex. Full Stack Developer" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={24} sm={24} md={5} lg={5}>
                      <h5>Role </h5>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={7}>
                      <Form.Item name='roleName'>
                        <Select
                          disabled
                          allowClear
                          style={{ width: 283 }}
                        >
                          {roleOptions && roleOptions.map((role, index) => {
                            return <Option key={index} value={role._id}>{role.name}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={0} sm={0} md={0} lg={1}>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} style={{ top: '-15px' }}>
                      <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph >
                      <Form.Item name='roleExp'>
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
                          disabled
                        />
                      </Form.Item>

                    </Col>
                  </Row>

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
                          onFocus={mainRoleSkillHandleFocus}
                          onSelect={mainRoleSkillsSelectHandler}
                          value={autoCompleteMainRoleSkill}
                          showSearch
                          showArrow={false}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="Type a skill, e.g. React"
                          disabled
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
                          <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} onClose={(e) => mainRoleSkillsClearField(e, index, item.experienceName)}>
                            {item.experienceName}
                          </Tag>
                        ))}
                      </Col>
                    </Row>

                  </>


                  <div className='inner-heading-wrapper'>
                    <h5>Engagement terms</h5>
                  </div>
                  <div>
                    <Form.Item name='employmentType' rules={[
                      {
                        required: true,
                        message: 'Please Select any term!'
                      }
                    ]}>
                      <Radio.Group style={{ width: '100%' }}>
                        <Row>
                          {employmentOptions ? employmentOptions.map((radio, index) => {
                            return (
                              <Col xs={24} sm={24} md={24} lg={24} key={index}>
                                <Radio value={radio._id} key={radio._id} disabled>
                                  {radio.name}
                                </Radio>
                              </Col>
                            );
                          }) : <div>Loading...</div>}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <Row>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <div className='inner-heading-wrapper'>
                        <Title level={3}>Position work hours range</Title>
                        <Paragraph>How flexible is the position work hours?</Paragraph>
                      </div>
                      <Row>

                        <Col xs={24} sm={24} md={10} lg={10}>
                          {/* <Form.Item name='workingHours'>
                            <RangePicker format="HH:mm" />
                          </Form.Item> */}
                          <Form.Item name='workingTimeFlexibility'>
                            <Radio.Group >
                              <Radio value='very-flexible' disabled>Very flexible - No overlapping work hours are required</Radio>
                              <Radio value='somewhat-flexible' disabled>Somewhat flexible - at least 2 overlapping work hours</Radio>
                              <Radio value='flexible' disabled>Flexible - at least 4 overlapping work hours</Radio>
                              <Radio value='not-flexible' disabled>Not flexible - at least 6 overlapping work hours</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col xs={0} sm={0} md={6} lg={6}>

                        </Col>
                      </Row>

                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                      <div className='full-border'>
                        <div className='inner-heading-wrapper'>
                          <Title level={3}>Your Company Time Zone</Title>
                          <Paragraph>{timezoneName ? timezoneName : 'Timezone not set yet.'}</Paragraph>
                          <Link to={`/company/settings/timezone-currency`}>Change Timezone</Link>
                        </div>
                      </div>
                    </Col>

                  </Row>

                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <h5>Position Time Zone </h5>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Form.Item name='timezone'>
                        <Select
                          disabled
                          allowClear
                          style={{ width: 283 }}
                        >
                           {timezoneOptions && timezoneOptions.map((item, index) => {
                              let timezone = ("(UTC " + item.timezoneUTC + ") " + item.name).toString()
                              return <Option key={index} value={item._id}>{timezone}</Option>
                            })}
                          </Select>
                      </Form.Item>
                    </Col>
                    </Row>
                  <div className="my-3">
                    <h5>Management Experience</h5>
                    <Row>

                      <Col xs={0} sm={0} md={5} lg={5}>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Checkbox disabled onChange={manageExpCheckBoxHandler} className="checkbox-style" checked={manageExpCheckBox}>
                          Is Management Experience?
              </Checkbox>
                      </Col>

                    </Row>

                    {manageExpCheckBox && <Row>

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
                            disabled
                          />
                        </Form.Item>
                      </Col>

                    </Row>}

                  </div>


                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <h5>Main Responsibilities:</h5>
                      <Form.Item name='mainResponsibilities' rules={
                        [
                          {
                            required: true,
                            message: 'Please add Main Responsibilities!'
                          }
                        ]
                      }>
                        <TextArea disabled rows={5} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <TagInput
                    title='Role Features'
                    inputTitle='Selected role features'
                    tags={appConfigRoles && appConfigRoles}
                    selectedTags={selectedRoles}
                    parentHandleTagChange={handleTagChange}
                    tagParentKey={roleFeaturesKey}
                    setFunction={setSelectedSortedRoles}
                    inputValues={selectedSortedRoles}
                    isDisabled={true}
                  />
                </div>



                <div className='position-offer-wrapper'>
                  <div className='main-heading-wrapper'>
                    <Title level={3}>Position offer</Title>
                  </div>
                  <div style={{ margin: '20px 0px' }}>
                    <Row>
                      <Col xs={24} sm={24} md={5} lg={5}>
                        <h6>Salary</h6>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='salary' rules={
                          [
                            {
                              required: true,
                              message: "Please input Salary"
                            }
                          ]
                        }>

                          <InputNumber disabled style={{ width: '100%' }} type="number" />
                        </Form.Item>

                      </Col>
                    </Row>


                    <Row>
                      <Col xs={24} sm={24} md={5} lg={5}>
                        <h6>Currency</h6>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='currency' rules={
                          [
                            {
                              required: true,
                              message: "Please select Currency"
                            }
                          ]
                        }>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select a Currency"
                            optionFilterProp="children"
                            style={{ width: 150 }}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled
                          >
                            {currencyOptions && currencyOptions.map((item, index) => {
                              return <Option key={index} value={item._id}>{item.name}</Option>
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={24} sm={24} md={5} lg={5}>
                        <h6>Equity</h6>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='equity'>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select Equity"
                            optionFilterProp="children"
                            style={{ width: 150 }}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled
                          >
                            {positionOfferOptions && positionOfferOptions.map((item, index) => {
                              return <Option key={index} value={item._id}>{item.name}</Option>
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={24} sm={24} md={5} lg={5}>
                        <h6>Performance bonus (% out of 100)</h6>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='performanceBonus'>
                          <InputNumber disabled style={{ width: '100%' }} type="number" />
                        </Form.Item>

                      </Col>
                    </Row>

                    <Row>
                      <Col xs={24} sm={24} md={5} lg={5}>
                        <h6>Signing bonus</h6>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='signingBonus'>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select a Bonus"
                            optionFilterProp="children"
                            style={{ width: 150 }}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled
                          >
                            {positionOfferOptions && positionOfferOptions.map((item, index) => {
                              return <Option key={index} value={item._id}>{item.name}</Option>
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                  </div>

                </div>

                <Row>
                  <Col xs={24} sm={24} md={7} lg={7}>
                    <div style={{ marginBottom: '25px' }}>
                      <Button type='primary' onClick={goToEditPositionPage}>
                        Edit Position Requirements
                      </Button>
                    </div>
                  </Col>
                  <Col xs={0} sm={0} md={1} lg={1}>
                   
                  </Col>
                  <Col xs={24} sm={24} md={7} lg={7}>
                    <div style={{ marginBottom: '25px' }}>
                      <Button type='primary' onClick={goToRequirementsPage}>
                        Go To Recruitment Page
                      </Button>
                    </div>
                  </Col>
                </Row>
                <div style={{ marginBottom: '105px' }}>
                  <p>Note that editing the position requirements will require our talent managers to rework on the position. (the time until next group will be restart)
					For any questions, issues, and concerns contact your account manager at {companyPositionDetails?.assignedAccountManager?.email}</p>

                </div>


              </div>
            </Content>
          </Layout>
        </Layout>
      </Form>
    </div>
  )
}
export default ViewPosition;

