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

import { loadAppConfigs } from '../../../../actions/auth';
import { onFinishFailed } from "../../../../common/commonMethods";
import { addWorkExperience, deleteWorkExperience, editWorkExperience } from '../../../../actions/workExperience';
import './workEducation.scss';
import moment from 'moment';
import { MOMENT_DATE_FORMAT } from '../../../../common/constants'

const { confirm } = Modal;
const { Title } = Typography;
const { TextArea } = Input;
function WorkExperience(props) {
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

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, []);

  useEffect(() => {
    // serverErrors && openErrorNotification();
    // showSuccessNotification && openSuccessNotification();
    showSuccessNotification && setEmploymentFormVisible(false);
    showSuccessNotification && setAddEmpBtn(true);
  }, [serverErrors, showSuccessNotification])

  useEffect(() => {
    if (user && user.workExperience && user.workExperience.length === 0) {
      setEmploymentFormVisible(true)
    }
  }, [user])


  const handleSubmit = values => {
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
  const cancelWorkForm = () => {
    setAddEmpBtn(true);
    setEmploymentFormVisible(false);
    resetEmploymentForm();
  }
  const showEmploymentForm = () => {
    setEmploymentFormVisible(true);
    resetEmploymentForm();
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

  return (
    <div>
      <div className='heading-wrapper'>
        <Title level={2}>Work Experience</Title>
      </div>
      {user && user.workExperience.map((item, index) => {
        return <div key={index}>
          <Card style={{ margin: '8px 0px' }}>
            <Row>
              <Col xs={24} sm={24} md={16} lg={16}>
                <div>Company Name: {item.companyName}</div>
                <div>Title: {item.title}</div>
                <div>Start Date: {moment(item.startDate).format(MOMENT_DATE_FORMAT)} - {item.endDate ? `End Date: ${moment(item.endDate).format(MOMENT_DATE_FORMAT)}` : 'Currently Working'}</div>
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

      {isAddEmpBtn && <Button type='primary' onClick={showEmploymentForm}>Add Employment</Button>}
      {isEmploymentFormVisible ?
        <Form
          layout='vertical'
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          className='form-wrapper'
        >
          <div>

            <Row>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item label='Company Name'>
                  <Input value={workCompanyName} onChange={onChangeWorkCompanyName} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item label='Title'>
                  <Input value={workTitle} onChange={onChangeWorkTitle} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={10} lg={10}>
                <Form.Item label='Start Date'>
                  <DatePicker
                    className='width-330'
                    value={workStartDate && workStartDate.dateString ? moment(workStartDate.dateString, 'YYYY-MM-DD') : null}
                    onChange={(date, dateString) => changeStartDate(date, dateString)}
                    disabledDate={disabledStartDate}
                    onOpenChange={handleStartOpenChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={10}>
                <Form.Item label='End Date'>
                  <DatePicker
                    className='width-330'
                    disabledDate={disabledEndDate}
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
                  {!isEditWorkForm.status && <Button type='primary' onClick={handleSubmit} loading={btnLoading}>Save</Button>}
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
  );
}

export default WorkExperience;
