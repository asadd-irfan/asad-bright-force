import React, { useState, useEffect } from 'react';
import { TimePicker, Typography, notification, Checkbox, Row, Col, Input, Tag, Slider, Button, Form, Select, Layout, InputNumber, Radio } from "antd";
import '@ant-design/compatible/assets/index.css';
import EditPositionSidePanel from './EditPositionSidePanel'
import { useSelector, useDispatch } from "react-redux";
import '../recruitment.scss';
import { useParams } from "react-router";
import TagInput from './TagInput'
import { onFinishFailed } from '../../../common/commonMethods'
import { editCompanyPosition, getAllCompanyPositions, getCompanyPositionDetails, latestCompanyPositionCreatedNull } from '../../../actions/positions'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import AccountManagerCard from '../AccountManager/AccountManagerCard';
const array = require('lodash/array');

const { Content, Sider } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = TimePicker;

const EditPosition = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const positionId = id;
  const btnLoading = useSelector(state => state.company.btnLoading);
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const loggedInUser = useSelector(state => state.auth.user);
  const companyAllUsers = useSelector(state => state.company.companyUsers);
  const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails);
  const companyDetails = useSelector(state => state.company.companyDetails);
  const configRoleOptions = appConfigs && appConfigs['roles']
  const roleOptions = appConfigs && appConfigs['preferred-role']
  const employmentOptions = appConfigs && appConfigs['employment-type']
  const appConfigTechExp = appConfigs && appConfigs['skills']
  const currencyOptions = appConfigs && appConfigs['currency']
  const timezoneOptions = appConfigs && appConfigs['timezone']
  const positionOfferOptions = appConfigs && appConfigs['position-offer']
  const roleFeaturesKey = 'role-features'
  const appConfigRoles = appConfigs && appConfigs[roleFeaturesKey]

  const [companyUsers, setCompanyUsers] = useState([]);
  const [selectedMainRoleSkill, setSelectedMainRoleSkill] = useState([]);
  const [autoCompleteMainRoleSkill, setAutoCompleteMainRoleSkill] = useState([]);
  const [mainRoleSkill, setMainRoleSkill] = useState([]);
  const [mainRoleSkills, setMainRoleSkills] = useState([]);

  const [selectedUser, setSelectedUser] = useState([]);
  const [autoCompleteUser, setAutoCompleteUser] = useState([]);
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [posRole, setPosRole] = useState();
  const [posEmpType, setPosEmpType] = useState();

  const [manageExpCheckBox, setManageExpCheckBox] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [currencyName, setCurrencyName] = useState(null)
  // console.log('companyDetails',companyDetails)

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSortedRoles, setSelectedSortedRoles] = useState([
    { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
    { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
  ]);
  const [timezoneName, setTimezoneName] = useState(null)
  useEffect(() => {
    dispatch(getCompanyPositionDetails(positionId))
    dispatch(latestCompanyPositionCreatedNull())
  }, [])

  useEffect(() => {
    if (companyPositionDetails) {
      configRoleOptions && configRoleOptions.filter((role) => {
        if (role._id === companyPositionDetails?.name._id) {
          setPosRole(role.name)
        }
      })
      employmentOptions && employmentOptions.filter((emp) => {
        if (emp._id === companyPositionDetails?.employmentType?._id) {
          setPosEmpType(emp.name)
        }
      })

    }
  }, [companyPositionDetails])

  useEffect(() => {

    let users = []
    if (companyAllUsers) {
      companyAllUsers.map(user => {
        if (user.authorizations.includes("hire")) {
          users.push(user)
        }
      })
      setCompanyUsers(users)
    }

  }, [companyAllUsers])
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
      // companyPositionDetails?.workingHours?.startingHour ? moment(companyPositionDetails?.workingHours?.startingHour) : null],
      timezone: companyPositionDetails?.timezone ? companyPositionDetails?.timezone : null,
      workingTimeFlexibility: companyPositionDetails?.workingTimeFlexibility ? companyPositionDetails?.workingTimeFlexibility : '',

    });
    currencyOptions && currencyOptions.map(currency => {
      if (currency._id === companyPositionDetails?.positionOffer?.currency) {
        setCurrencyName(currency.name)
      }
    })
    if (companyPositionDetails?.positionOffer?.salary) {
      setMonthlySalary(companyPositionDetails?.positionOffer?.salary / 12);
    }

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
    if (companyPositionDetails?.hiringTeam?.length > 0) {
      let userSelectedUser = [];
      let userSelectedUserName = [];
      companyUsers && companyUsers.map(companyUser => {
        companyPositionDetails.hiringTeam.filter(user => {
          if (user === companyUser._id) {
            let selectedObj = { userId: user, userName: companyUser.fullName }
            userSelectedUser.push(selectedObj)
            userSelectedUserName.push(selectedObj.userName)
          }
        })
      })
      setUsers(userSelectedUser)
      setSelectedUser(userSelectedUserName)
    }
    else {
      setUsers([{ userId: loggedInUser?._id, userName: loggedInUser?.fullName }])
      setSelectedUser([loggedInUser?.fullName])
    }

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
    if (companyDetails) {
      timezoneOptions && timezoneOptions.map(time => {
        if (time._id === companyDetails?.timezone) {
          setTimezoneName(time.name)
        }
      })

    }

  }, [companyDetails, companyPositionDetails, appConfigTechExp, appConfigRoles, companyUsers, loggedInUser])


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
    if (loggedInUser.fullName === value) {
      notification.error({
        message: 'Error',
        description: 'You can not remove yourself.',
      });
    } else {
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

  const handleTagChange = (checked, id, name, key) => {

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

  };


  const handleSubmit = (values) => {
    submitData(values, false)
  }
  const onSendToAccountManager = () => {

    form.validateFields()
      .then(values => {
        submitData(values, true)
      })
      .catch(errorInfo => {
        console.log('errorInfo', errorInfo);
      });
  }

  const submitData = (values, isSendToAccountManager) => {
    // console.log('values',values)
    let roleFeatures = selectedSortedRoles.map((item, index) => {
      if (item.tagId) {
        return {
          feature: item.tagId,
          priorityOrder: index + 1
        }
      }
    }).filter(Boolean)
    // if (users.length < 1) {
    //   notification.error({
    //     message: 'Error',
    //     description: 'Please add a User',
    //   });
    // }
    // else 
    if (values.roleName === undefined || values.roleName === null || values.roleName === '') {
      notification.error({
        message: 'Error',
        description: 'Select A Role',
      });
    }
    else if (mainRoleSkills.length < 1) {
      notification.error({
        message: 'Error',
        description: 'Select A Skill',
      });
    }
    else if (roleFeatures.length < 1) {
      notification.error({
        message: 'Error',
        description: 'Select any role feature',
      });
    }
    else if (values.performanceBonus > 100 || values.performanceBonus < 0) {
      notification.error({
        message: 'Error',
        description: 'Select Performance bonus Range from 0 to 100',
      });
    }
    else if (values.equity === '') {
      notification.error({
        message: 'Error',
        description: 'Select Equity of Position Offer.',
      });
    }
    else if (values.signingBonus === '') {
      notification.error({
        message: 'Error',
        description: 'Select signing Bonus of Position Offer.',
      });
    }
    else {
      // let hiringTeam = users.map(user => user.userId)
      let skills = mainRoleSkills.map(skill => skill.experienceId)
      // const startingHour = values.workingHours && values.workingHours[0] ? moment(values.workingHours[0]).format("YYYY-MM-DD HH:mm:ss") : null
      // const endingHour = values.workingHours && values.workingHours[1] ? moment(values.workingHours[1]).format("YYYY-MM-DD HH:mm:ss") : null

      let obj = {
        // "hiringTeam": hiringTeam,
        "title": values.title,
        "role": {
          "name": values.roleName,
          "yearsOfExperience": values.roleExp ? values.roleExp : 0
        },
        "skills": skills,
        "managementExperience": {
          "status": manageExpCheckBox,
          "yearsOfExperience": values.managementExperience
        },
        "employmentType": values.employmentType,
        "workingTimeFlexibility": values.workingTimeFlexibility,
        "mainResponsibilities": values.mainResponsibilities,
        "positionFeatures": roleFeatures,
        "positionOffer": {
          "salary": values.salary,
          "currency": values.currency,
          "equity": values.equity,
          "performanceBonus": values.performanceBonus,
          "signingBonus": values.signingBonus,
        },

        "timezone": values.timezone,

      }

      // if (startingHour && endingHour) {
      //   obj = {
      //     ...obj,
      //     "workingHours": {
      //       "startingHour": startingHour,
      //       "endingHour": endingHour,
      //     }
      //   }
      // }
      if (isSendToAccountManager) {
        obj = { ...obj, "sentToAccountManager": true }
      }
      console.log('obj', obj)

      dispatch(editCompanyPosition(obj, positionId)).then(() => {
        dispatch(getAllCompanyPositions());
        history.push('/company/hire/recruitment')
      });
    }
  }

  const addUser = () => {

    if (users.length < 1) {
      notification.error({
        message: 'Error',
        description: 'Please add a User',
      });
    }
    else {
      let hiringTeam = users.map(user => user.userId)
      let obj = {
        "hiringTeam": hiringTeam,
      }
      // console.log('obj', obj);
      dispatch(editCompanyPosition(obj, positionId));
    }
  }
  function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const changeAnnualSalary = (value) => {
    setMonthlySalary(value / 12);
  };

  return (
    <div style={{ padding: '25px 15px' }}>
      <Form
        form={form}
        layout={'vertical'}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
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
            <EditPositionSidePanel positionRole={posRole} positionEmpType={posEmpType} positionTitle={form.getFieldValue('title')} btnLoading={btnLoading} onSendToAccountManager={onSendToAccountManager} />
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
                        <Paragraph style={{ color: 'black', fontSize: '18px' }}>Add Users</Paragraph >
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
                        >
                          {user.map(user => (
                            <Option key={user}>{user}</Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                    <Row justify='start' className="my-2">
                      <Col xs={1} sm={1} md={5} lg={5}></Col>
                      <Col xs={23} sm={23} md={19} lg={19}>
                        {users.map((item, index) => (
                          <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => userClearField(e, index, item.userName)}>
                            {item.userName}
                          </Tag>
                        ))}
                      </Col>
                    </Row>
                    <Row justify='start' className="my-3">
                      <Col xs={1} sm={1} md={5} lg={5}></Col>
                      <Col xs={23} sm={23} md={12} lg={12}>
                        <Button type="primary" onClick={addUser} >+ Add User</Button>
                      </Col>
                    </Row>

                  </>
                </div>

                <div className='position-requirements-wrapper'>
                  <div className='main-heading-wrapper'>
                    <Title level={3}>Position requirements</Title>
                  </div>

                  <Row style={{ marginTop: '20px' }} className="my-3">
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
                        <Input placeholder="Ex. Full Stack Developer" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className='inner-heading-wrapper'>
                    <h5>Employment Type</h5>
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
                                <Radio value={radio._id} key={radio._id} >
                                  {radio.name}
                                </Radio>
                              </Col>
                            );
                          }) : <div>Loading...</div>}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <Row className="my-3">
                    <Col xs={24} sm={24} md={10} lg={10}>
                      <h5>Role </h5>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} style={{ top: '-3px' }}>
                      <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph >
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10}>
                      <Form.Item name='roleName'>
                        <Select
                          allowClear
                          style={{ width: 283 }}
                        >
                          {roleOptions && roleOptions.map((role, index) => {
                            return <Option key={index} value={role._id}>{role.name}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={0} sm={0} md={1} lg={1}>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} style={{ top: '-3px' }}>
                      {/* <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph > */}
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
                        />
                      </Form.Item>

                    </Col>
                  </Row>

                  <div className="my-3">
                    <Row id='tech-experience'>
                      {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                      <Col xs={24} sm={24} md={16} lg={16}>
                        <Paragraph style={{ color: 'black', fontSize: '18px' }}>Skills</Paragraph >
                      </Col>
                    </Row>
                    <Row id='tech-experience'>
                      {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
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
                        >
                          {mainRoleSkill.map(exp => (
                            <Option key={exp}>{exp}</Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                    <Row justify='start'>
                      {/* <Col xs={1} sm={1} md={5} lg={5}></Col> */}
                      <Col xs={23} sm={23} md={12} lg={12}>
                        {mainRoleSkills.map((item, index) => (
                          <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => mainRoleSkillsClearField(e, index, item.experienceName)}>
                            {item.experienceName}
                          </Tag>
                        ))}
                      </Col>
                    </Row>

                  </div>

                  <div className="my-3">
                    <h5>Management Experience</h5>
                    <Row className="my-3" style={{ marginBottom: "30px" }}
                    >

                      {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                      <Col xs={24} sm={24} md={12} lg={12}>
                        <Checkbox onChange={manageExpCheckBoxHandler} className="checkbox-style" checked={manageExpCheckBox}>
                          Does your position require Management Experience?
              </Checkbox>
                      </Col>

                    </Row>

                    {manageExpCheckBox && <Row className="my-3">

                      {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                      <Col xs={10} sm={10} md={7} lg={7}>
                        <Tag>Management Experience </Tag>
                      </Col>
                      <Col xs={14} sm={14} md={13} lg={13}>
                        <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph >
                      </Col>
                      <Col xs={10} sm={10} md={7} lg={7} />
                      <Col xs={14} sm={14} md={12} lg={12}>

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




                  <Row>
                    <Col xs={24} sm={24} md={14} lg={14}>
                      <div className='inner-heading-wrapper'>
                        <Title level={3}>Position work hours range</Title>
                      </div>
                      <div className="my-3">
                        <h5>TimeZone</h5>
                        <Row>
                          <Col xs={24} sm={24} md={20} lg={20}>
                            <Form.Item name='timezone' rules={
                              [
                                {
                                  required: true,
                                  message: 'Please Select Time Zone'
                                }
                              ]
                            }>

                              <Select
                                style={{ width: '100%', marginBottom: "10px" }}
                                showSearch
                                showArrow={false}
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="Type your timezone, e.g. Asia/Karachi"
                              >
                                {timezoneOptions && timezoneOptions.map((item, index) => {
                                  let timezone = ("(UTC " + item.timezoneUTC + ") " + item.name).toString()
                                  return <Option key={index} value={item._id}>{timezone}</Option>
                                })}
                              </Select>
                            </Form.Item>
                          </Col>

                        </Row>



                      </div>
                      <Row>
                        <b className="mb-2">How flexible is the position work hours?</b>

                        <Col xs={24} sm={24} md={12} lg={12}>
                          {/* <Form.Item name='workingHours'>
                            <RangePicker format="HH:mm" />
                          </Form.Item> */}
                          <Form.Item name='workingTimeFlexibility'>
                            <Radio.Group >
                              <Radio value='very-flexible'>Very flexible - No overlapping work hours are required</Radio>
                              <Radio value='somewhat-flexible'>Somewhat flexible - at least 2 overlapping work hours</Radio>
                              <Radio value='flexible'>Flexible - at least 4 overlapping work hours</Radio>
                              <Radio value='not-flexible'>Not flexible - at least 6 overlapping work hours</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>
                        <Col xs={0} sm={0} md={6} lg={6}>

                        </Col>
                      </Row>

                    </Col>
                    {/* <Col xs={24} sm={24} md={8} lg={8}>
                      <div className='full-border'>
                        <div className='inner-heading-wrapper'>
                          <Title level={3}>Your Company Time Zone</Title>
                          <Paragraph>{timezoneName ? timezoneName : 'Timezone not set yet.'}</Paragraph>
                        </div>
                      </div>
                    </Col> */}

                  </Row>


                  <TagInput
                    title='Position Features'
                    inputTitle='Selected Position features'
                    tags={appConfigRoles && appConfigRoles}
                    selectedTags={selectedRoles}
                    parentHandleTagChange={handleTagChange}
                    tagParentKey={roleFeaturesKey}
                    setFunction={setSelectedSortedRoles}
                    inputValues={selectedSortedRoles} />




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
                        <TextArea rows={5} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>


                <div className='position-offer-wrapper'>
                  <div className='main-heading-wrapper'>
                    <Title level={3}>Position offer</Title>
                  </div>
                  <div style={{ margin: '20px 0px' }}>
                    <Row>
                      <Col xs={24} sm={24} md={15} lg={15}>
                        <h6>Salary</h6>
                      </Col>
                      <Col xs={0} sm={0} md={1} lg={1} />
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <h6>Currency</h6>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} style={{ wordWrap: 'break-word' }}>
                        <Form.Item name='salary' rules={
                          [
                            {
                              required: true,
                              message: "Please input Salary"
                            }
                          ]
                        }>

                          <InputNumber style={{ width: '250px' }} type="number" onChange={changeAnnualSalary} />
                        </Form.Item>

                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} style={{ wordWrap: 'break-word' }}>
                        <b style={{ fontSize: '16px' }}> {numberWithCommas(monthlySalary.toFixed(0))} {} {currencyName && currencyName} per month </b>

                      </Col>

                      <Col xs={24} sm={24} md={8} lg={8} style={{ wordWrap: 'break-word' }}>
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
                            style={{ width: '250px' }}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {currencyOptions && currencyOptions.map((item, index) => {
                              return <Option key={index} value={item._id}>{item.name}</Option>
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <h6>Equity</h6>
                    </Row>
                    <Row>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='equity'>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select Equity"
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {positionOfferOptions && positionOfferOptions.map((item, index) => {
                              return <Option key={index} value={item._id}>{item.name}</Option>
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row>
                      <h6>Performance bonus </h6>
                    </Row>
                    <Row>

                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Row>
                          <Col xs={22} sm={22} md={22} lg={22}>
                            <Form.Item name='performanceBonus'>
                              <InputNumber style={{ width: '235px' }} type="number" />
                            </Form.Item>
                          </Col>
                          <Col xs={2} sm={2} md={2} lg={2} className="mt-1">
                            <b style={{ fontSize: 16 }}>%</b>
                          </Col>

                        </Row>

                      </Col>
                    </Row>

                    <Row>
                      <h6>Signing bonus</h6>
                    </Row>
                    <Row>

                      <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item name='signingBonus'>
                          <Select
                            showSearch
                            allowClear
                            placeholder="Select a Bonus"
                            optionFilterProp="children"
                            style={{ width: 250 }}
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
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
                  <Col xs={0} sm={0} md={5} lg={5}>

                  </Col>
                  {/* <Col xs={24} sm={24} md={2} lg={2}>
                    <Button type='primary' htmlType='submit' loading={btnLoading} style={{ margin: '10px' }}>
                      Save
                      </Button>
                  </Col> */}
                  <Col xs={0} sm={0} md={1} lg={1}>

                  </Col>
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <Button type='primary' onClick={onSendToAccountManager} loading={btnLoading} style={{ margin: '10px' }}>
                      Send to account Manager
                      </Button>
                  </Col>
                </Row>

              </div>
            </Content>
          </Layout>
        </Layout>
      </Form>
    </div>
  )
}
export default EditPosition;

