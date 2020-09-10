import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Layout, Form, Button, Row, Col, Modal, Steps, Input, notification, Tabs } from 'antd';
import SidePanel from './SidePanel';
import { useSelector, useDispatch } from 'react-redux'
import {
  getProcessedPositionTalents, getPositionDetailsById, removeProcessedPositionTalents, getFilteredPositionTalents,
  dispatchTalentsList, closePosition, getRecruitmentCandidatesList
} from '../../../../../actions/positions'
import { getCompanyById } from '../../../../../actions/company'
import { onFinishFailed } from "../../../../../common/commonMethods";
import { useHistory, useParams } from 'react-router-dom';
import '../positions.scss'
import InfoPanel from './InfoPanel';
import OfferPanel from './OfferPanel';
import CompanyPanel from './CompanyPanel';
import PositionDetailPanel from './PositionDetailPanel';
import RecruitmentInfoPanel from './RecruitmentInfoPanel';
import GroupMatchingPanel from './GroupMatchingPanel';
import Groups from './Groups';
import FilteredListCandidates from './Groups/FilteredListCandidates';
import SearchedCandidates from './Groups/SearchedCandidates';
import LongListCandidates from './Groups/LongListCandidates';
import ShortListCandidates from './Groups/ShortListCandidates';
import InterviewCandidates from './Groups/InterviewCandidates';
import './position.scss';
import moment from 'moment'
import {
  CURRENT_GROUP_INDEX, POSITIONS_BTN_LOADING_TRUE,
  UPDATE_FAILURE,
  UPDATE_POSITION_SUCCESS,
} from '../../../../../actions/types'
import axios from 'axios';

const array = require('lodash/array');
const { Content, Sider } = Layout;
const { TabPane } = Tabs;

function Position() {
  const formRef = useRef()
  const history = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { id } = useParams();
  const positionId = id;
  const selectedPositionDetails = useSelector(state => state.positions.selectedPositionDetails)
  const groupData = useSelector(state => state.positions.groupData)
  const btnLoading = useSelector(state => state.positions.btnLoading)
  const authBtnLoading = useSelector(state => state.auth.btnLoading)
  const selectedCompany = useSelector(state => state.company.selectedCompany)
  const openPositions = useSelector(state => state.company.openPositions)
  const filteredPositionTalents = useSelector(state => state.positions.filteredPositionTalents)
  const processedPositionTalents = useSelector(state => state.positions.processedPositionTalents)
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const appConfigTechExp = appConfigs && appConfigs['skills']
  const roleFeaturesKey = 'role-features'
  const appConfigRoles = appConfigs && appConfigs[roleFeaturesKey]
  const [closePositionModalVisible, setClosePositionModalVisible] = useState(false)
  const [closePositionReason, setClosePositionReason] = useState(null)
  const [sendedTalents, setSendedTalents] = useState([])
  const [processedTalentsListToDispatch, setProcessedTalentsListToDispatch] = useState([])
  const [longListCandidates, setLongListCandidates] = useState([])
  const [shortListCandidates, setShortListCandidates] = useState([])
  const [interviewCandidates, setInterviewCandidates] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(1)
  const [activeTabKey, setActiveTabKey] = useState("0")
  const [generateListFlag, setGenerateListFlag] = useState(false)

  useEffect(() => {
    dispatch(removeProcessedPositionTalents())
    dispatch(getPositionDetailsById(positionId))
  }, [])
  useEffect(() => {
    if (selectedPositionDetails?.lastGroupStatus === 'processed') {
      dispatch(getProcessedPositionTalents(positionId))
      setActiveTabKey("1");
    }
  }, [selectedPositionDetails])
  // console.log('selectedPositionDetails',selectedPositionDetails)
  // console.log('processedPositionTalents' , processedPositionTalents)

  useEffect(() => {
    const candidatesLongList = groupData && groupData["group" + selectedIndex] && groupData["group" + selectedIndex].filter(candidate => candidate.status === 'long-list')
    setLongListCandidates(candidatesLongList)
    const candidatesShortList = groupData && groupData["group" + selectedIndex] && groupData["group" + selectedIndex].filter(candidate => candidate.status === 'short-list')
    setShortListCandidates(candidatesShortList)
    const candidatesInterviewList = groupData && groupData["group" + selectedIndex] && groupData["group" + selectedIndex].filter(candidate => candidate.status === 'interview')
    setInterviewCandidates(candidatesInterviewList)
  }, [groupData, selectedIndex])

  useEffect(() => {
    if (selectedPositionDetails?.groupsInfo?.length) {
      dispatch({
        type: CURRENT_GROUP_INDEX,
        payload: selectedPositionDetails.groupsInfo.length
      })
    }

    if (selectedPositionDetails?.groupsInfo.length === 0 && selectedPositionDetails?.lastGroupStatus === 'un-processed') {
      setActiveTabKey("0");
    }
    else {
      setActiveTabKey("2");
    }
    if (selectedPositionDetails?.lastGroupStatus === 'processed') {
      setActiveTabKey("1");
    }

  }, [selectedPositionDetails])



  useEffect(() => {
    selectedPositionDetails && selectedPositionDetails.groupsInfo.map((groupInfo, index) => {
      if (groupInfo._id && groupData && !groupData["group" + (index + 1)]) {
        let obj = {
          "groupId": groupInfo._id
        }
        dispatch(getRecruitmentCandidatesList(obj, positionId, index + 1))
      } else if (groupData === null) {
        let obj = {
          "groupId": groupInfo._id
        }
        dispatch(getRecruitmentCandidatesList(obj, positionId, index + 1))
      }
    })

  }, [selectedPositionDetails])

  //#region Company Panel

  // state
  const [selectedIndustries, setSelectedIndustries] = useState([])
  const [selectedCompanyFeatures, setSelectedCompanyFeatures] = useState([])
  const [selectedCompanyValues, setSelectedCompanyValues] = useState([])
  // const [selectedTechExperience, setSelectedTechExperience] = useState([])
  const [ignoreValues, setIgnoreValues] = useState({
    "Industries": false,
    "Size": false,
    // "TechExperience": false,
    "CompanyValues": false,
    "CompanyFeatures": false,
  })


  // useEffect 
  useEffect(() => {
    form.setFieldsValue({
      size: selectedCompany && selectedCompany.size && selectedCompany.size._id,
    });

    let selectedCompanyValues = []
    let selectedCompanyFeatures = []
    let selectedIndustries = []
    // let selectedTechExperience = []
    if (selectedCompany && selectedCompany.industries) {
      selectedIndustries = selectedCompany.industries.map(item => {
        return item._id;
      });
      setSelectedIndustries([...selectedIndustries])
    }
    if (selectedCompany && selectedCompany.companyValues) {
      selectedCompanyValues = selectedCompany.companyValues.map(item => {
        return item._id;
      });
      setSelectedCompanyValues([...selectedCompanyValues])
    }
    if (selectedCompany && selectedCompany.companyFeatures) {
      selectedCompanyFeatures = selectedCompany.companyFeatures.map(item => {
        return item._id;
      });
      setSelectedCompanyFeatures([...selectedCompanyFeatures])
    }
    // if (selectedCompany && selectedCompany.technologiesUsed) {
    //   selectedTechExperience = selectedCompany.technologiesUsed.map(item => {
    //     return item._id;
    //   });
    //   setSelectedTechExperience([...selectedTechExperience])
    // }

  }, [selectedCompany]);


  // callback functions to set state
  const handleIndustryTagChange = (checked, id) => {
    if (checked && selectedIndustries.length < 5) {
      setSelectedIndustries([...selectedIndustries, id])
    }
    else if (!checked && selectedIndustries.includes(id)) {
      let filteredItems = selectedIndustries.filter(function (item) {
        return item !== id
      })
      setSelectedIndustries(filteredItems)
    }
  };

  // const handleTechExpTagChange = (checked, id) => {
  //   if (checked) {
  //     setSelectedTechExperience([...selectedTechExperience, id])
  //   }
  //   else if (!checked && selectedTechExperience.includes(id)) {
  //     let filteredItems = selectedTechExperience.filter(function (item) {
  //       return item !== id
  //     })
  //     setSelectedTechExperience(filteredItems)
  //   }
  // };

  const handleCompanyValueTagChange = (checked, id) => {
    if (checked && selectedCompanyValues.length < 5) {
      setSelectedCompanyValues([...selectedCompanyValues, id])
    }
    else if (!checked && selectedCompanyValues.includes(id)) {
      let filteredItems = selectedCompanyValues.filter(function (item) {
        return item !== id
      })
      setSelectedCompanyValues(filteredItems)
    }
  };

  const handleFeaturesTagChange = (checked, id) => {
    if (checked && selectedCompanyFeatures.length < 5) {
      setSelectedCompanyFeatures([...selectedCompanyFeatures, id])
    }
    else if (!checked && selectedCompanyFeatures.includes(id)) {
      let filteredItems = selectedCompanyFeatures.filter(function (item) {
        return item !== id
      })
      setSelectedCompanyFeatures(filteredItems)
    }
  };

  const handleIgnoreChange = (e, name) => {
    if (name === "Industries") {
      setIgnoreValues({
        ...ignoreValues,
        "Industries": e.target.checked,
      })
    }
    if (name === "Size") {
      setIgnoreValues({
        ...ignoreValues,
        "Size": e.target.checked,
      })
    }
    // if (name === "TechExperience") {
    //   setIgnoreValues({
    //     ...ignoreValues,
    //     "TechExperience": e.target.checked,
    //   })
    // }
    if (name === "CompanyValues") {
      setIgnoreValues({
        ...ignoreValues,
        "CompanyValues": e.target.checked,
      })
    }
    if (name === "CompanyFeatures") {
      setIgnoreValues({
        ...ignoreValues,
        "CompanyFeatures": e.target.checked,
      })
    }
  };
  ////////////////////
  //#endregion


  //#region Position Panel

  const [selectedMainRoleSkill, setSelectedMainRoleSkill] = useState([]);
  const [autoCompleteMainRoleSkill, setAutoCompleteMainRoleSkill] = useState([]);
  const [mainRoleSkill, setMainRoleSkill] = useState([]);
  const [mainRoleSkills, setMainRoleSkills] = useState([]);

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedSortedRoles, setSelectedSortedRoles] = useState([
    { id: 'item-1', tagId: null, tagName: null, priorityOrder: 0 },
    { id: 'item-2', tagId: null, tagName: null, priorityOrder: 0 },
    { id: 'item-3', tagId: null, tagName: null, priorityOrder: 0 }
  ]);


  const [manageExpCheckBox, setManageExpCheckBox] = useState(false);
  const [ignorePositionValues, setIgnorePositionValues] = useState({
    "Role": false,
    "Skills": false,
    "EngagementTerms": false,
    "ManagementExperience": false,
    "WorkingHours": false,
    "RoleFeatures": false,
  })


  useEffect(() => {

    let empTypeArray = []
    if (selectedPositionDetails !== null) {
      dispatch(getCompanyById(selectedPositionDetails?.companyId?._id))
      empTypeArray.push(selectedPositionDetails?.employmentType?._id)
    }
    form.setFieldsValue({
      employmentType: empTypeArray ? empTypeArray : '',
      managementExperience: selectedPositionDetails?.managementExperience?.yearsOfExperience ? selectedPositionDetails?.managementExperience?.yearsOfExperience : null,
      salary: selectedPositionDetails?.positionOffer?.salary ? selectedPositionDetails?.positionOffer?.salary : null,
      currency: selectedPositionDetails?.positionOffer?.currency ? selectedPositionDetails?.positionOffer?.currency : null,
      roleName: selectedPositionDetails?.role?.name?._id ? selectedPositionDetails?.role?.name?._id : null,
      roleExp: selectedPositionDetails?.role?.yearsOfExperience ? selectedPositionDetails?.role?.yearsOfExperience : null,
      // workingHours: [selectedPositionDetails?.workingHours?.endingHour ? moment(selectedPositionDetails?.workingHours?.endingHour) : null,
      // selectedPositionDetails?.workingHours?.startingHour ? moment(selectedPositionDetails?.workingHours?.startingHour) : null],
      candidatesPerGroup: selectedPositionDetails?.groupConfigs?.candidatesPerGroup,
      totalGroups: selectedPositionDetails?.groupConfigs?.totalGroups,
      matchingScore: selectedPositionDetails?.groupConfigs?.matchingScore,
      workingTimeFlexibility: selectedPositionDetails?.workingTimeFlexibility ? selectedPositionDetails?.workingTimeFlexibility : ''
    });

    // to set user management exp checkbox
    const ManageExpCheckBoxValue = selectedPositionDetails?.managementExperience?.status
    setManageExpCheckBox(ManageExpCheckBoxValue)

    // for main role skills
    let userSelectedMainSkills = [];
    let userSelectedMainSkillsName = [];
    if (selectedPositionDetails?.skills) {
      appConfigTechExp && appConfigTechExp.map(techExp => {
        selectedPositionDetails.skills.filter(skill => {
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

    // for roles + priority
    let selectedRoles = []

    if (selectedPositionDetails?.positionFeatures) {
      selectedRoles = selectedPositionDetails?.positionFeatures.map(item => {
        return item && item.feature;
      });
      let userSelectedRoles = [];

      selectedPositionDetails.positionFeatures.map((value, index) => {
        if (selectedPositionDetails?.positionFeatures[index]) {
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
          populateUserSelectedRoles[index] = { id: 'item-' + (index + 1), 'tagId': userSelectedRoles[index].tagId, 'tagName': userSelectedRoles[index].tagName, 'priorityOrder': userSelectedRoles[index].priorityOrder };
        }
        return null
      })
      setSelectedRoles([...selectedRoles])
      setSelectedSortedRoles([...populateUserSelectedRoles])
    }


  }, [selectedPositionDetails, appConfigTechExp, appConfigRoles])

  const manageExpCheckBoxHandler = (e) => {
    setManageExpCheckBox(e.target.checked)
  }

  const handleIgnorePositionChange = (e, name) => {
    if (name === "salary") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "salary": e.target.checked,
        "currency": e.target.checked,
      })
    }
    if (name === "Role") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "Role": e.target.checked,
      })
    }
    // if (name === "JobSearchStatus") {
    //   setIgnorePositionValues({
    //     ...ignorePositionValues,
    //     "JobSearchStatus": e.target.checked,
    //   })
    // }
    if (name === "Skills") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "Skills": e.target.checked,
      })
    }
    if (name === "EngagementTerms") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "EngagementTerms": e.target.checked,
      })
    }
    if (name === "ManagementExperience") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "ManagementExperience": e.target.checked,
      })
    }
    if (name === "WorkingHours") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "WorkingHours": e.target.checked,
      })
    }
    if (name === "RoleFeatures") {
      setIgnorePositionValues({
        ...ignorePositionValues,
        "RoleFeatures": e.target.checked,
      })
    }
  };

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
    return '';
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

  const handlePositionRoleFeaturesTagChange = (checked, id, name, key) => {

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
  //#endregion


  const handleSubmitSearch = values => {
    // console.log('in handleSubmitSearch')
    // setGenerateListFlag(true);
    let obj = {
      "role": selectedPositionDetails?.name?._id
    };
    // group matching
    obj = {
      ...obj,
      "groupConfigs": {
        "candidatesPerGroup": values.candidatesPerGroup,
        "matchingScore": values.matchingScore,
        "totalGroups": values.totalGroups,
      }
    }

    // company values
    if (!ignoreValues.Industries) {
      obj = {
        ...obj,
        "industry": selectedIndustries
      }
    }
    if (!ignoreValues.Size) {
      let sizeArr = [values.size]
      obj = {
        ...obj,
        "companySize": sizeArr
      }
    }
    // if (!ignoreValues.TechExperience) {
    //   obj = {
    //     ...obj,
    //     "techStack": selectedTechExperience
    //   }
    // }
    if (!ignoreValues.CompanyValues) {
      obj = {
        ...obj,
        "companyValues": selectedCompanyValues
      }
    }
    if (!ignoreValues.CompanyFeatures) {
      obj = {
        ...obj,
        "companyFeatures": selectedCompanyFeatures
      }
    }
    // position values
    if (!ignorePositionValues.salary) {
      obj = {
        ...obj,
        "salary": values.salary,
        "currency": values.currency
      }
    }
    if (!ignorePositionValues.Role) {
      obj = {
        ...obj,
        "positionRole": values.roleName,
        "roleYearOfExp": values.roleExp
      }
    }
    // if (!ignorePositionValues.JobSearchStatus) {
    //   obj = {
    //     ...obj,
    //     "jobSearchStatus": values.jobSearchStatus
    //   }
    // }
    if (!ignorePositionValues.EngagementTerms) {
      obj = {
        ...obj,
        "employmentType": values.employmentType
      }
    }
    if (!ignorePositionValues.ManagementExperience) {
      obj = {
        ...obj,
        "managementExp": manageExpCheckBox,
        "managementYearOfExp": values.managementExperience

      }
    }
    if (!ignorePositionValues.RoleFeatures) {
      obj = {
        ...obj,
        "positionFeatures": selectedRoles
      }
    }
    if (!ignorePositionValues.Skills) {
      let positionSkills = mainRoleSkills.map(skill => skill.experienceId)
      obj = {
        ...obj,
        "positionSkills": positionSkills
      }
    }
    if (!ignorePositionValues.WorkingHours) {
      obj = {
        ...obj,
        "workingTimeFlexibility": values.workingTimeFlexibility,
        "timezone": selectedPositionDetails?.timezone,
        // "workingHours": {
        //   startingHour: selectedPositionDetails?.workingHours?.startingHour,
        //   endingHour: selectedPositionDetails?.workingHours?.endingHour
        // }
      }
    }
    console.log('obj', obj)
    dispatch(getFilteredPositionTalents(obj, positionId))
  };

  const handleClosePositionModalCancel = e => {
    setClosePositionModalVisible(false);
  };

  const handleClosePositionModalOk = e => {
    if (closePositionReason !== null && closePositionReason !== '' && closePositionReason !== undefined) {
      let obj = {
        "reason": closePositionReason
      }
      setClosePositionModalVisible(false);
      dispatch(closePosition(obj, positionId)).then(() => {
        history.push('/admin/positions')
      })
    }
    else {
      notification.error({
        message: 'Error',
        description: 'Please enter reason'
      });
    }

  };

  async function processTalentsList(values, id) {
    dispatch({
      type: POSITIONS_BTN_LOADING_TRUE,
    });
    //set header
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify(values);
    try {
      const res = await axios.post('/api/admin/position/process-talent-list/' + id, body, config);
      dispatch({
        type: UPDATE_POSITION_SUCCESS,
        payload: res
      });
      dispatch(getPositionDetailsById(id))
      setActiveTabKey("1")
    } catch (error) {
      dispatch({ type: UPDATE_FAILURE, payload: error.response.data });
      setActiveTabKey("0")
    }
  }

  const handleProcessTalentsList = e => {
    let body = {
      "talents": sendedTalents && sendedTalents.map(talent => {
        let obj = {
          "id": talent._id,
          "score": talent.score
        };
        return obj;
      })
    }
    // console.log('request body',body)

    processTalentsList(body, positionId)

  };

  const handleDispatchTalentsList = e => {
    let body = {
      "talents": processedTalentsListToDispatch && processedTalentsListToDispatch.map(element => {
        let obj = {
          "id": element.talentDetails._id,
          "score": element.score
        };
        return obj;
      })
    }
    // console.log('request body',body)
    dispatch(dispatchTalentsList(body, positionId)).then(() => {
      setActiveTabKey("2")
    })
  };

  const onChangeGroupIndex = (index) => {
    // console.log('index',index)
    // console.log('selectedPositionDetails?.groupsInfo.length',selectedPositionDetails?.groupsInfo.length)
    if (index === 1 && selectedPositionDetails?.groupsInfo.length === 0) {
      setActiveTabKey("0");
    } else if (index <= selectedPositionDetails?.groupsInfo.length) {
      // else {
      setActiveTabKey("2");
    }
    else {
      setActiveTabKey("0");
    }
    if (selectedPositionDetails?.lastGroupStatus === 'processed') {
      setActiveTabKey("1");
    }
    setSelectedIndex(index)
  }
  const setSendedTalentsList = (list) => {
    // console.log('list', list)
    setSendedTalents(list)
  }

  const setProcessedTalentsList = (list) => {
    // console.log('list', list)
    setProcessedTalentsListToDispatch(list)
  }
  return (
    <div style={{ padding: '25px 15px' }}>


      <Layout>
        <Sider
          breakpoint="lg"
          width={'230px'}
          collapsedWidth="0"
          onBreakpoint={broken => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <SidePanel selectedPosition={selectedPositionDetails} />
        </Sider>

        <Layout>
          <Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
            <InfoPanel selectedPosition={selectedPositionDetails} selectedCompany={selectedCompany} openPositions={openPositions} />
          </Content>
        </Layout>
      </Layout>

      <Form
        ref={formRef}
        onFinish={handleSubmitSearch}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Layout>

          <CompanyPanel
            selectedCompany={selectedCompany}
            selectedIndustries={selectedIndustries}
            selectedCompanyFeatures={selectedCompanyFeatures}
            selectedCompanyValues={selectedCompanyValues}
            // selectedTechExperience={selectedTechExperience}
            ignoreValues={ignoreValues}
            handleIndustryTagChange={handleIndustryTagChange}
            // handleTechExpTagChange={handleTechExpTagChange}
            handleCompanyValueTagChange={handleCompanyValueTagChange}
            handleFeaturesTagChange={handleFeaturesTagChange}
            handleIgnoreChange={handleIgnoreChange}
          />

          <PositionDetailPanel
            companyPositionDetails={selectedPositionDetails}
            roleFeaturesKey={roleFeaturesKey}
            ignorePositionValues={ignorePositionValues}
            appConfigRoles={appConfigRoles}
            manageExpCheckBox={manageExpCheckBox}
            selectedSortedRoles={selectedSortedRoles}
            autoCompleteMainRoleSkill={autoCompleteMainRoleSkill}
            mainRoleSkill={mainRoleSkill}
            mainRoleSkills={mainRoleSkills}
            selectedRoles={selectedRoles}
            handlePositionRoleFeaturesTagChange={handlePositionRoleFeaturesTagChange}
            mainRoleSkillHandleFocus={mainRoleSkillHandleFocus}
            mainRoleSkillsSelectHandler={mainRoleSkillsSelectHandler}
            mainRoleSkillsClearField={mainRoleSkillsClearField}
            setSelectedSortedRoles={setSelectedSortedRoles}
            manageExpCheckBoxHandler={manageExpCheckBoxHandler}
            handleIgnorePositionChange={handleIgnorePositionChange}
          />

          {selectedPositionDetails?.status === 'Closed - Other' && <div style={{ textAlign: 'center' }}>
            <h3>This Position is closed now.</h3>
          </div>}

          {selectedPositionDetails?.status !== 'Closed - Other' &&
            <Fragment>
              <OfferPanel selectedPosition={selectedPositionDetails} />
              <RecruitmentInfoPanel companyPositionDetails={selectedPositionDetails} />
              <GroupMatchingPanel selectedPosition={selectedPositionDetails} form={form} />
            </Fragment>
          }
        </Layout>
        {selectedPositionDetails?.status !== 'Closed - Other' &&
          <Fragment>
            {selectedPositionDetails?.status !== 'Closed - Other' &&
              selectedPositionDetails?.status !== 'Closed - Hired' && <Row>
                <Col xs={0} sm={0} md={20} lg={20}>

                </Col>
                <Col xs={24} sm={24} md={4} lg={4}>
                  <Button
                    style={{ float: 'right' }}
                    type='danger'
                    loading={authBtnLoading}
                    onClick={() => setClosePositionModalVisible(true)}
                  >
                    Close Position
                </Button>
                </Col>
              </Row>}
            <br />
            <br />

            {/* <Row>
              <Col xs={0} sm={0} md={20} lg={20}>
                
              </Col>
              <Col xs={24} sm={24} md={4} lg={4}>
              {(groupData === null || groupData?.["group"+selectedIndex] === null || groupData?.["group"+selectedIndex] === undefined) 
               && 
               <Button
                style={{ float: 'right'}}
                type='primary'
                htmlType='submit'
                loading={btnLoading}
              >
                SEARCH
                </Button>}
              </Col>
          </Row> */}
            <br />

            <Groups
              onChangeGroupIndex={onChangeGroupIndex}
              selectedIndex={selectedIndex}
              onChangeTabKey={(key) => setActiveTabKey(key)}
              groupsInfo={selectedPositionDetails?.groupsInfo}
            />

            <Tabs defaultActiveKey={activeTabKey} activeKey={activeTabKey} onChange={(key) => setActiveTabKey(key)}>
              <TabPane tab="Search" key="0" disabled={(groupData === null || groupData?.["group" + selectedIndex] === null || groupData?.["group" + selectedIndex] === undefined) ? false : true}>
                <SearchedCandidates
                  filteredListCandidates={filteredPositionTalents}
                  setSendedTalentsList={setSendedTalentsList}
                  handleProcessTalentsList={handleProcessTalentsList}
                  //handleSubmitSearch={handleSubmitSearch}
                  formRef={formRef}
                />
              </TabPane>
              <TabPane tab="Recruitment Short List" key="1" disabled={(groupData === null || groupData?.["group" + selectedIndex] === null || groupData?.["group" + selectedIndex] === undefined) ? false : true}>
                <FilteredListCandidates
                  positionId={positionId}
                  processedPositionTalents={processedPositionTalents}
                  setProcessedTalentsList={setProcessedTalentsList}
                  handleDispatchTalentsList={handleDispatchTalentsList}
                />
              </TabPane>
              <TabPane tab={longListCandidates?.length > 0 ? "Company Long List" + " (" + longListCandidates?.length + ")" : "Company Long List (0)"} key="2">
                <LongListCandidates longListCandidates={longListCandidates} />
              </TabPane>
              <TabPane tab={shortListCandidates?.length > 0 ? "Company Short List" + " (" + shortListCandidates?.length + ")" : "Company Short List (0)"} key="3">
                <ShortListCandidates shortListCandidates={shortListCandidates} />
              </TabPane>
              <TabPane tab={interviewCandidates?.length > 0 ? "Company Interview" + " (" + interviewCandidates?.length + ")" : "Company Interview (0)"} key="4">
                <InterviewCandidates interviewCandidates={interviewCandidates} />
              </TabPane>
            </Tabs>

          </Fragment>
        }
        <Modal
          title="Close Position"
          visible={closePositionModalVisible}
          onOk={handleClosePositionModalOk}
          onCancel={handleClosePositionModalCancel}
        >
          <h5>Are you sure to Close this position??</h5>
        Reason : <Input value={closePositionReason} onChange={(e) => setClosePositionReason(e.target.value)} />
        </Modal>

      </Form>

    </div>
  )
}

export default Position;
