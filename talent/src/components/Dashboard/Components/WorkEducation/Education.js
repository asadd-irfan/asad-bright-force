import React, { useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
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
import './workEducation.scss';
const moment = require('moment');
const { confirm } = Modal;

const { Title } = Typography;

function Education(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
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


  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && apiResponse && apiResponse.message.search('education') > -1 && openSuccessNotification();
    showSuccessNotification && setEducationFormVisible(false);
    showSuccessNotification && setSelfTaught(false);
    showSuccessNotification && resetEducationForm();
  }, [serverErrors, showSuccessNotification])

  useEffect(() => {
    if(user && user.education && user.education.length === 0 && !user.selfTaught ){
      setEducationFormVisible(true)
    }
  }, [user])


  const handleSubmit = values => {
    let allValues = null;
    if (isSelfTaught) {
      allValues = { selfTaught: true }
    }
    else {
      const formValues = { ...educationForm };
      const instituteName = formValues.instituteName;
      const graduationYear = formValues.graduationYear;
      const degreeTitle = formValues.degreeTitle;
      allValues = { instituteName, graduationYear, degreeTitle }
    }
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
  return (
    <div>
      <Form 
        layout='vertical'
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        className='mt-10'
      >
        <div className='heading-wrapper' >
          <Title level={2}>Education</Title>
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
                    <div>Graduation: {item.graduationYear}</div>
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
        {!educationForm.isEditNow && <div>
          <Checkbox style={{ margin: '8px 0px' }} checked={isSelfTaught} onChange={(e) => onChangeSelfTaught(e)}>I am self taught (I don't have a degree)</Checkbox>
        </div>}
        {!isSelfTaught && <div>
          {!educationForm.isEditNow && <Button type='primary' style={{ margin: '8px 0px' }} onClick={() => changeEducationFormVisible(true)}>Add Education</Button>}
          {isEducationFormVisible &&
            <div style={{ margin: '8px 0px' }}>
              <Row>
                <Col xs={24} sm={24} md={19} lg={19}>
                  <Form.Item label='University/College'>
                    <Input value={educationForm.instituteName} onChange={onChangeInstituteName} />
                  </Form.Item>
                </Col>
                <Col xs={0} sm={0} md={1} lg={1}>
                </Col>
                <Col xs={24} sm={24} md={4} lg={4}>
                  <Form.Item label='Graduation year'>
                    <div>
                      <DatePicker
                        value={educationForm.graduationYear ? moment().year(educationForm.graduationYear) : educationForm.graduationYear}
                        open={isDatePickerOpen}
                        mode="year"
                        placeholder="Select Year"
                        format="YYYY"
                        onOpenChange={(status) => {
                          if (status) {
                            setDatePickerOpen(true)
                          } else {
                            setDatePickerOpen(false)
                          }
                        }}
                        onPanelChange={(value) => {
                          setDatePickerOpen(false)
                          setEducationForm({ ...educationForm, graduationYear: moment(value._d, "DD/MM/YYYY").year() })
                        }}
                        onChange={() => {
                          setEducationForm({ ...educationForm, graduationYear: null })
                        }}
                      />
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
                Save
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
      </Form>
    </div>
  );
}

export default Education;
