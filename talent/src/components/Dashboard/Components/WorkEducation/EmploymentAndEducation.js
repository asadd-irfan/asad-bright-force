import React, { useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';

import { addWorkExperience, deleteWorkExperience, editWorkExperience } from '../../../../actions/workExperience';
import './workEducation.scss';
import moment from 'moment';
import {
  Typography,
  Row,
  Col,
  Input,
  Checkbox,
  DatePicker,
  Button,
  Card,
  Form,
  Modal,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { loadAppConfigs, clearServerErrors } from '../../../../actions/auth';
import { resetNotificationSetting } from '../../../../actions/common';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import { addEducation, deleteEducation, editEducation } from '../../../../actions/education';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Title } = Typography;
const { TextArea } = Input;
export default function EmploymentAndEducation() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
  const [workStartDate, setWorkStartDate] = useState(null)
  const [workEndDate, setWorkEndDate] = useState(null)
  const [dateEndOpen, setDateEndOpen] = useState(null)
  const [isEmploymentFormVisible, setEmploymentFormVisible] = useState(false)
  const [isCurrentlyWork, setCurrentlyWork] = useState(false)
  const [workDescription, setWorkDescription] = useState('')
  const [workCompanyName, setWorkCompanyName] = useState('')
  const [workTitle, setWorkTitle] = useState('')
  const [isAddEmpBtn, setAddEmpBtn] = useState(true)
  const [isEditWorkForm, setEditWorkForm] = useState({
    id: '',
    status: false,
  })
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const [isEducationFormVisible, setEducationFormVisible] = useState(false)
  const [isSelfTaught, setSelfTaught] = useState(false)
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)
  const [educationForm, setEducationForm] = useState({
    id: null,
    instituteName: null,
    graduationYear: null,
    degreeTitle: null,
    isEditNow: false
  })

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);


  const handleSubmitWorkExp = values => {
    const startDate = workStartDate.dateString;
    let endDate
    if (isCurrentlyWork) {
      endDate = null;
    } else {
      endDate = workEndDate.dateString;
    }
    const currentlyWorking = isCurrentlyWork;
    const description = workDescription;
    const title = workTitle;
    const companyName = workCompanyName;
    const allValues = { startDate, endDate, currentlyWorking, description, title, companyName }
    dispatch(addWorkExperience(allValues));
  };
  const updateWorkExp = e => {
    e.preventDefault();
    const startDate = workStartDate.dateString;
    let endDate = workEndDate.dateString;
    if (isCurrentlyWork) {
      endDate = null;
    }
    const currentlyWorking = isCurrentlyWork;
    const description = workDescription;
    const title = workTitle;
    const companyName = workCompanyName;
    const updatedFormId = isEditWorkForm.id;
    const allValues = { startDate, endDate, currentlyWorking, description, title, companyName }
    dispatch(editWorkExperience(updatedFormId, allValues));
  }
  const handleDeleteWorkExp = item => {
    cancelWorkForm();
    confirm({
      title: 'Delete',
      content: `Do you want to delete ${item.companyName}?`,
      onOk() {
        dispatch(deleteWorkExperience(item._id))
      },
      onCancel() { },
    });
  };
  const handleEditWorkExp = item => {
    setAddEmpBtn(false);
    setEmploymentFormVisible(true);
    setCurrentlyWork(item.currentlyWorking);
    setWorkDescription(item.description);
    setWorkCompanyName(item.companyName);
    setWorkTitle(item.title);
    setEditWorkForm({ id: item._id, status: true });
    setWorkStartDate({ ...workStartDate, dateString: item.startDate });
    setWorkEndDate({ ...workEndDate, dateString: item.endDate });
  };
  const changeStartDate = (date, dateString) => {
    setWorkStartDate({
      date: date,
      dateString: dateString
    });
  }
  const changeEndDate = (date, dateString) => {
    setWorkEndDate({
      date: date,
      dateString: dateString
    });
  }
  const changeYear = (date, dateString) => {
    // console.log('dateString', dateString)
    setEducationForm({ ...educationForm, graduationYear: dateString })
    // setWorkEndDate({
    //   date: date,
    //   dateString: dateString
    // });
  }
  const cancelWorkForm = () => {
    setAddEmpBtn(true);
    setEmploymentFormVisible(false);
    resetEmploymentForm();
  }
  const showEmploymentForm = () => {
    setEmploymentFormVisible(true);
    resetEmploymentForm();
    setEducationFormVisible(false);

  }
  const resetEmploymentForm = () => {
    setCurrentlyWork(false);
    setWorkDescription(null);
    setWorkCompanyName(null);
    setWorkTitle(null);
    setEditWorkForm({ id: null, status: false });
    setWorkStartDate(null);
    setWorkEndDate(null);
  }
  const onChangeCurrentlyWork = (e) => {
    setCurrentlyWork(e.target.checked)
    if (!e.target.checked) {
      setWorkEndDate(null);
    }
  }
  // const openErrorNotification = () => {
  // 	errorNotification(serverErrors);
  // 	dispatch(clearServerErrors());
  // }
  // const openSuccessNotification = () => {
  //   successNotification(apiResponse)
  //   dispatch(resetNotificationSetting());
  // };
  const onChangeWorkDescription = (e) => {
    setWorkDescription(e.target.value);
  };
  const onChangeWorkCompanyName = (e) => {
    setWorkCompanyName(e.target.value);
  };
  const onChangeWorkTitle = (e) => {
    setWorkTitle(e.target.value);
  };

  const disabledStartDate = startValue => {
    const endValue = workEndDate && workEndDate.date;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = endValue => {
    const startValue = workStartDate && workStartDate.date;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const handleStartOpenChange = open => {
    if (!open) {
      setDateEndOpen(true);
    }
  };

  const handleEndOpenChange = open => {
    setDateEndOpen(open);
  };

  //   const dispatch = useDispatch();
  //   const user = useSelector(state => state.auth.user);



  // console.log('isEducationFormVisible', isEducationFormVisible)

  // console.log('isEmploymentFormVisible', isEmploymentFormVisible)

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && apiResponse && apiResponse.message.search('education') > -1 && openSuccessNotification();
    showSuccessNotification && setEducationFormVisible(false);
    showSuccessNotification && setEmploymentFormVisible(false);
    showSuccessNotification && setAddEmpBtn(true);
    showSuccessNotification && resetEducationForm();
  }, [serverErrors, showSuccessNotification])

  // useEffect(() => {
  //   if (user && user.education && user.education.length === 0 && !user.selfTaught) {
  //     setEducationFormVisible(true)
  //   }
  // }, [user])


  const handleSubmitEdu = values => {
    let allValues = null;
    // if (isSelfTaught) {
    //   allValues = { selfTaught: true }
    // }
    // else {
    const formValues = { ...educationForm };
    const instituteName = formValues.instituteName;
    const graduationYear = formValues.graduationYear;
    const degreeTitle = formValues.degreeTitle;
    allValues = { instituteName, graduationYear, degreeTitle }
    // }
    // console.log('allValues', allValues)

    dispatch(addEducation(allValues));
  };

  const handleDeleteEducation = item => {
    cancelEducationForm();
    confirm({
      title: 'Delete',
      content: `Do you want to delete ${item.degreeTitle}?`,
      onOk() {
        dispatch(deleteEducation(item._id))
      },
      onCancel() { },
    });
  };

  const populateEditEducationForm = item => {
    setEducationFormVisible(true);
    setSelfTaught(false);
    setEducationForm({
      id: item._id,
      instituteName: item.instituteName,
      graduationYear: item.graduationYear,
      degreeTitle: item.degreeTitle,
      isEditNow: true,
    });
  };

  const changeEducationFormVisible = (value) => {
    setEducationFormVisible(value);
    setEmploymentFormVisible(false);
    resetEmploymentForm();

  }
  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
    dispatch(resetNotificationSetting());
  }

  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };
  const onChangeSelfTaught = (e) => {
    setSelfTaught(e.target.checked);
  }

  const onChangeInstituteName = (e) => {
    setEducationForm({ ...educationForm, instituteName: e.target.value });
  }
  const onChangeDegreeTitle = (e) => {
    setEducationForm({ ...educationForm, degreeTitle: e.target.value });
  }
  const cancelEducationForm = () => {
    setSelfTaught(false);
    setEducationFormVisible(false);
    resetEducationForm();
  }
  const resetEducationForm = () => {
    setEducationForm({
      id: null,
      instituteName: null,
      graduationYear: null,
      degreeTitle: null,
      isEditNow: false
    });
  }
  const updateEducationForm = e => {
    e.preventDefault();
    const formValues = { ...educationForm };
    const id = formValues.id;
    const instituteName = formValues.instituteName;
    const graduationYear = formValues.graduationYear;
    const degreeTitle = formValues.degreeTitle;
    const allValues = { instituteName, graduationYear, degreeTitle }
    dispatch(editEducation(id, allValues));
  }


  return (<>
    <div>
      <h2 className="my-3">Employment & Education </h2>
      <div className='heading-wrapper' style={{ textAlign: 'center' }}>

        {user?.workExperience?.length > 0 && <Title level={3}>Employment</Title>}

      </div>
      {user && user.workExperience.map((item, index) => {
        return <div key={index}>
          <Card style={{ margin: '8px 0px' }}>
            <Row>
              <Col xs={24} sm={24} md={16} lg={16}>
                <div>Company Name: {item.companyName}</div>
                <div>Title: {item.title}</div>
                <div>Start Date: {moment(item.startDate).format('MMM-YYYY')} - {item.endDate ? `End Date: ${moment(item.endDate).format('MMM-YYYY')}` : 'Currently Working'}</div>
                <div>Description: {item.description}</div>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>
                <Row>
                  <Col xs={0} sm={0} md={0} lg={16}></Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <Button type='link' onClick={() => handleEditWorkExp(item)}>
                      Edit
                  </Button>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <Button type='link' onClick={() => handleDeleteWorkExp(item)}>
                      Remove
                  </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </div>
      })}
      <div className='heading-wrapper' style={{ textAlign: 'center' }}>
        {user?.education?.length > 0 && <Title level={3}>Education</Title>}

      </div>
      <div>
        {(user && user.selfTaught) ?
          <Card style={{ margin: '8px 0px' }}>
            <Row>
              <div>I am a self Taught</div>
            </Row>
          </Card> :
          user && user.education.map((item, index) => {
            return (<Card key={index} style={{ margin: '8px 0px' }}>
              <Row>
                <Col xs={24} sm={24} md={16} lg={16}>
                  <div>University: {item.instituteName}</div>
                  <div>Degree: {item.degreeTitle}</div>
                  <div>Graduation: {moment(item.graduationYear).format('MMM-YYYY')}</div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <Row>
                    <Col xs={0} sm={0} md={0} lg={16}></Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <Button type='link' onClick={() => populateEditEducationForm(item)}>
                        Edit
                  </Button>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={4}>
                      <Button type='link' onClick={() => handleDeleteEducation(item)}>
                        Remove
              </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>)
          })
        }
      </div>
      <Row>
        <Col xs={12} sm={12} md={8} lg={8}>
          {isAddEmpBtn && <Button type='primary' style={{ margin: '8px 0px' }} icon={<PlusOutlined />} onClick={showEmploymentForm}>Add Employment</Button>}
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          {!educationForm.isEditNow && <Button type='primary' icon={<PlusOutlined />} style={{ margin: '8px 0px' }} onClick={() => changeEducationFormVisible(true)}>Add Education</Button>}
        </Col>

      </Row>
      {isEmploymentFormVisible ?
        <Form
          layout='vertical'
          onFinish={handleSubmitWorkExp}
          onFinishFailed={onFinishFailed}
          className='form-wrapper'
        >
          <div>

            <Row>
              <Col xs={24} sm={24} md={10} lg={10}>
                <Form.Item label='Company Name'>
                  <Input value={workCompanyName} onChange={onChangeWorkCompanyName} />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} />
              <Col xs={24} sm={24} md={10} lg={10}>
                <Form.Item label='Title'>
                  <Input value={workTitle} onChange={onChangeWorkTitle} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={9} lg={9}>
                <Form.Item label='Start Date'>
                  <DatePicker
                    className='width-330'
                    picker="month"
                    value={workStartDate && workStartDate.dateString ? moment(workStartDate.dateString, 'YYYY-MM-DD') : null}
                    onChange={(date, dateString) => changeStartDate(date, dateString)}
                    disabledDate={disabledStartDate}
                    onOpenChange={handleStartOpenChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} />
              <Col xs={24} sm={24} md={9} lg={9}>
                <Form.Item label='End Date'>
                  <DatePicker
                    className='width-330'
                    disabledDate={disabledEndDate}
                    picker="month"
                    value={workEndDate && workEndDate.dateString ? moment(workEndDate.dateString, 'YYYY-MM-DD') : null}
                    disabled={isCurrentlyWork}
                    onChange={(date, dateString) => changeEndDate(date, dateString)}
                    open={dateEndOpen}
                    onOpenChange={handleEndOpenChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={4} lg={4}>
                <Form.Item label='Currently Work'>
                  <Checkbox checked={isCurrentlyWork} onChange={onChangeCurrentlyWork}>I currently work here</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item label='Description'>
                  <TextArea rows={4} value={workDescription} onChange={onChangeWorkDescription}>{workDescription}</TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Form.Item>
                  {!isEditWorkForm.status && <Button type='primary' onClick={handleSubmitWorkExp} loading={btnLoading}>Add</Button>}
                  {isEditWorkForm.status && <Button type='primary' onClick={updateWorkExp} loading={btnLoading}>Edit</Button>}
                  {' '}
                  <Button type='primary' onClick={cancelWorkForm}>
                    Cancel
              </Button>
                </Form.Item>
              </Col>
            </Row>

          </div>
        </Form>
        : <div></div>}
    </div>
    <div>
      {isEducationFormVisible && <Form
        layout='vertical'
        onFinish={handleSubmitEdu}
        onFinishFailed={onFinishFailed}
        className='mt-10'
      >

        {/* {!educationForm.isEditNow && <div>
          <Checkbox style={{ margin: '8px 0px' }} checked={isSelfTaught} onChange={(e) => onChangeSelfTaught(e)}>I am self taught (I don't have a degree)</Checkbox>
        </div>} */}
        {!isSelfTaught && <div>
          {isEducationFormVisible &&
            <div style={{ margin: '8px 0px' }}>
              <Row>
                <Col xs={24} sm={24} md={16} lg={16}>
                  <Form.Item label='University/College'>
                    <Input value={educationForm.instituteName} onChange={onChangeInstituteName} />
                  </Form.Item>
                </Col>
                <Col xs={0} sm={0} md={1} lg={1}>
                </Col>
                <Col xs={24} sm={24} md={7} lg={7}>
                  <Form.Item label='Graduation Date'>
                    <div>
                      <DatePicker
                        className='width-230'
                        open={isDatePickerOpen}
                        value={educationForm.graduationYear ? moment(educationForm.graduationYear, 'YYYY-MM-DD') : null}
                        placeholder="Select Graduation Date"
                        picker="month"
                        onOpenChange={(status) => {
                          if (status) {
                            setDatePickerOpen(true)
                          }
                          else {
                            setDatePickerOpen(false)
                          }
                        }}
                        // onPanelChange={(value) => {
                        //   console.log('value', value)
                        //   if (value) {
                        //     setDatePickerOpen(false)
                        //   } else {
                        //     setDatePickerOpen(true)
                        //   }
                        //   setEducationForm({ ...educationForm, graduationYear: moment(value._d, 'MMM-YYYY').year() })
                        // }}
                        onChange={(date, dateString) => changeYear(date, dateString)}

                      // onChange={() => {
                      //   setEducationForm({ ...educationForm, graduationYear: null })
                      // }}
                      />
                      {/* <DatePicker
                        value={workEndDate && workEndDate.dateString ? moment(workEndDate.dateString, 'YYYY-MM-DD') : null}
                        onChange={(date, dateString) => changeEndDate(date, dateString)}
                        open={dateEndOpen}
                        onOpenChange={handleEndOpenChange}
                      /> */}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Form.Item label='Degree:'>
                    <Input value={educationForm.degreeTitle} onChange={onChangeDegreeTitle} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          }
        </div>}
        {(isSelfTaught || isEducationFormVisible) && <Row style={{ margin: '8px 0px' }}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item>
              {!educationForm.isEditNow && <Button type='primary' htmlType='submit' loading={btnLoading}>
                Add
              </Button>}
              {educationForm.isEditNow && <Button type='primary' onClick={updateEducationForm} loading={btnLoading}>
                Edit
              </Button>}
              {' '}
              <Button type='primary' onClick={cancelEducationForm}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>}
      </Form>}
    </div>

  </>);
}
