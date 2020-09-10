import React, { useState, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Typography, Row, Col, InputNumber, Button, Form, Modal, notification, Select, Radio, TimePicker } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { loadAppConfigs, clearServerErrors } from '../../../../actions/auth';
import {
  updateTalentProfile,
} from "../../../../actions/talent";
import { resetNotificationSetting } from '../../../../actions/common';
import { updateEngagementPreferences } from '../../../../actions/engagementPreferences';
import { errorNotification, successNotification, onFinishFailed } from "../../../../common/commonMethods";
import { Link } from 'react-router-dom'
import moment from 'moment'
import './EngagementPreferences.scss';
import TimeRangeSlider from 'react-time-range-slider';

const { Title, Paragraph } = Typography;
const { RangePicker } = TimePicker;
const { Option } = Select;

const EngagementPreferences = props => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  // const [timezoneForm] = Form.useForm();
  // const [currencyForm] = Form.useForm();
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(state => state.auth.showSuccessNotification);
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const [minSalary, setMinSalary] = useState(0)
  const [currencyName, setCurrencyName] = useState(null)
  const [timezoneName, setTimezoneName] = useState(null)
  const user = useSelector(state => state.auth.user);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  const employmentOptions = appConfigs && appConfigs['employment-type']
  const currencyOptions = appConfigs && appConfigs['currency']
  const timezoneOptions = appConfigs && appConfigs['timezone']
  const [startingHour, setStartingHour] = useState(9)
  const [endingHour, setEndingHour] = useState(18)
  const [startTime, setStartTime] = useState("9:00")
  const [endTime, setEndTime] = useState("18:00")
  const [selectedEmpType, setSelectedEmpType] = useState(null)
  const [fullTimeErrorFlag, setFullTimeErrorFlag] = useState(false)
  const [partTimeErrorFlag, setPartTimeErrorFlag] = useState(false)
  const [timeZoneModal, setTimeZoneModal] = useState(false)
  const [currencyModal, setCurrencyModal] = useState(false)

  useEffect(() => {
    dispatch(loadAppConfigs());
  }, [])

  useEffect(() => {
    serverErrors && openErrorNotification();
    showSuccessNotification && openSuccessNotification();
    form.setFieldsValue({
      minSalary: user && user.salary && user.salary.minSalary ? user.salary.minSalary : 0,
      employmentType: user && user.employmentType[0] ? user.employmentType[0] : null,
      // workingHours: [user?.workingHours?.endingHour ? moment(user?.workingHours?.endingHour) : null, 
      // 	user?.workingHours?.startingHour ? moment(user?.workingHours?.startingHour) : null]
      currency: user?.currency ? user?.currency : null,
      timezone: user?.timezone ? user?.timezone : null,
    });
    // timezoneForm.setFieldsValue({
    //   timezone: user?.timezone ? user?.timezone : null,
    // });
    // currencyForm.setFieldsValue({
    //   currency: user?.currency ? user?.currency : null,
    // });
    setMinSalary(user?.salary?.minSalary ? user?.salary?.minSalary / 12 : 0);
    let talentStartingHour = user?.workingHours?.startingHour
    if (talentStartingHour || talentStartingHour === 0) {
      let startHour = (talentStartingHour + ":00").toString();
      setStartTime(startHour)
      setStartingHour(talentStartingHour)
    }
    let talentEndingHour = user?.workingHours?.endingHour

    if (talentEndingHour || talentEndingHour === 0) {
      let endHour = (talentEndingHour + ":00").toString();
      setEndTime(endHour)
      setEndingHour(talentEndingHour)
    }

    currencyOptions && currencyOptions.map(currency => {
      if (currency._id === user?.currency) {
        setCurrencyName(currency.name)
      }
    })
    timezoneOptions && timezoneOptions.map(time => {
      if (time._id === user?.timezone) {
        setTimezoneName(time.name)
      }
    })
    employmentOptions && employmentOptions.map((element) => {
      if (user && element._id === user.employmentType[0]) {
        setSelectedEmpType(element.name);
      }
    })
  }, [serverErrors, showSuccessNotification, user, appConfigs])
  // console.log('selectedEmpType', selectedEmpType)

  const handleSubmit = values => {
    // console.log('values', values)
    // const startingHour = values.workingHours && values.workingHours[0] ? moment(values.workingHours[0]).format("YYYY-MM-DD HH:mm:ss") : null
    // const endingHour = values.workingHours && values.workingHours[1] ? moment(values.workingHours[1]).format("YYYY-MM-DD HH:mm:ss") : null

    // setPartTimeErrorFlag(false)
    if (selectedEmpType === 'Permanent (Full time)' && (endingHour - startingHour) < 8) {
      notification.error({
        message: 'Error',
        description: 'Range must be equal or greater than 8 hours'
      });
    }
    else if (selectedEmpType === 'Part time' && (endingHour - startingHour) < 4) {
      notification.error({
        message: 'Error',
        description: 'Range must be equal or greater than 4 hours'
      });


    } else {
      const salary = {
        "minSalary": values.minSalary,
      };
      let workingHours = {};
      if (startingHour || endingHour) {
        workingHours = {
          "startingHour": startingHour,
          "endingHour": endingHour,
        };
      }

      const empArray = values.employmentType;
      let employmentType = [];
      employmentType.push(empArray);
      const allValues = {
        salary,
        employmentType,
        workingHours,
        currency: values.currency,
        timezone: values.timezone,
      };
      // console.log('allValues', allValues)
      dispatch(updateEngagementPreferences(allValues));

    }

  }


  const openErrorNotification = () => {
    errorNotification(serverErrors);
    dispatch(clearServerErrors());
  }
  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };

  const changeAnnualSalary = (value) => {
    console.log('salary:', value)
    setMinSalary(value / 12);
    // form.setFieldsValue({
    //   minSalary: numberWithCommas(value)
    // });
    // console.log("form.getFieldValue('minSalary')", form.getFieldValue('minSalary'))

  };
  const openTimezoneModal = () => {
    setTimeZoneModal(true)
  };
  const handleTimezoneModalCancel = e => {
    setTimeZoneModal(false);
  };
  const handleTimezoneModalOk = (values) => {
    let id = user._id;
    dispatch(updateTalentProfile(id, values)).then(() => {
      setTimeZoneModal(false);

    })

  };

  const openCurrencyModal = () => {
    setCurrencyModal(true)
  };
  const handleCurrencyModalCancel = e => {
    setCurrencyModal(false);
  };
  const handleCurrencyModalOk = (values) => {
    let id = user._id;
    dispatch(updateTalentProfile(id, values)).then(() => {
      setCurrencyModal(false);

    })

  };
  function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function handleChange(value) {
    const currencyObj = currencyOptions.find(element => element._id === value);
    setCurrencyName(currencyObj.name)
  }
  const timeChangeHandler = (time) => {
    // console.log('time', time);
    let startingTime = time?.start.split(":")[0];
    startingTime = parseInt(startingTime);
    let endingTime = time?.end.split(":")[0];
    endingTime = parseInt(endingTime);

    // console.log('startingTime', startingTime);
    // console.log('endingTime', endingTime);
    setStartingHour(startingTime)
    setEndingHour(endingTime)
    if (selectedEmpType === 'Permanent (Full time)') {
      setPartTimeErrorFlag(false)
      if ((endingTime - startingTime) < 8) {
        setFullTimeErrorFlag(true)
      } else {
        setFullTimeErrorFlag(false)
      }
    }
    if (selectedEmpType === 'Part time') {
      setFullTimeErrorFlag(false)
      if ((endingTime - startingTime) < 4) {
        setPartTimeErrorFlag(true)
      } else {
        setPartTimeErrorFlag(false)
      }
    }

    setStartTime(time.start.toString())
    setEndTime(time.end.toString())
  }
  console.log('user', user);

  const onChangeRadio = (e) => {
    // console.log('radio checked', e.target.value);
    employmentOptions && employmentOptions.map((element) => {
      if (element._id === e.target.value) {
        if (element.name === 'Part time') {
          setFullTimeErrorFlag(false)
        }
        if (element.name === 'Permanent (Full time)') {
          setPartTimeErrorFlag(false)
        }
        setSelectedEmpType(element.name);
      }
    })

  };

  return (
    <div>
      <div className='main-heading-wrapper'>
        <Title level={1}>Engagement preferences</Title>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        className='form-wrapper'
      >
        <div className='form-inner-wrapper'>
          <div className="my-3">
            <Title level={2}>Employment Type</Title>
          </div>
          <div className='inner-heading-wrapper'>
            <Title level={4}>What type of employment are you looking for?</Title>
            {/* <Paragraph>Select a range</Paragraph> */}
          </div>
          <div className="mb-5">
            <Form.Item name='employmentType' rules={
              [
                {
                  required: true,
                  message: 'Please Select your Employment Type'
                }
              ]
            }>
              <Radio.Group onChange={onChangeRadio} style={{ width: '100%' }}>
                <Row>
                  {employmentOptions ? employmentOptions.map((radio, index) => {
                    return (
                      <Col xs={24} sm={24} md={12} lg={12} key={index}>
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

          <Row className="mb-5">
            <Col xs={24} sm={24} md={22} lg={22}>
              <div id='salary' >
                <Title level={2}>Work Hours</Title>
              </div>
              <div className='inner-heading-wrapper' className="my-3">
                <Title level={4}>What work hours will you be willing to work?</Title>
                <Row> <b>How flexible is your work hours?</b>
                  <Button type='primary' className='ml-5'>
                    How it Works?
                  </Button></Row>
              </div>


              <Row className="my-3">
                <Col xs={24} sm={24} md={8} lg={8}>

                  <b style={{ fontSize: '18px' }}>Time Zone : </b>
                  <Form.Item name='timezone' rules={
                    [
                      {
                        required: true,
                        message: 'Please Select your Time Zone'
                      }
                    ]
                  }>

                    <Select
                      style={{ width: '100%', marginBottom: "20px" }}
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
              <Row className="my-3">

                <Col xs={14} sm={14} md={14} lg={14} className="my-3">
                  <Form.Item name='workingHours'>
                    {/* <RangePicker format="HH:mm"/> */}
                    <TimeRangeSlider
                      disabled={false}
                      format={24}
                      maxValue={"23:59"}
                      minValue={"00:00"}
                      name={"workingHours"}
                      onChange={timeChangeHandler}
                      step={60}
                      value={{ start: startTime, end: endTime }}
                    /> <br />
                    <Paragraph>Start Time: {startTime} , End Time: {endTime}</Paragraph>
                    {fullTimeErrorFlag && <Paragraph style={{ color: 'red' }}>Range must be equal or greater than 8 hours</Paragraph>}
                    {partTimeErrorFlag && <Paragraph style={{ color: 'red' }}>Range must be equal or greater than 4 hours</Paragraph>}

                  </Form.Item>
                </Col>

              </Row>

            </Col>
            {/* <Col xs={24} sm={24} md={8} lg={8}>
               <div className='full-border'>
                <div className='inner-heading-wrapper'>
                  <Title level={4}>Your Time Zone</Title>
                  <Paragraph>{timezoneName}</Paragraph>
                  <Button type='primary' onClick={openTimezoneModal}>Change Timezone</Button>
                </div>
              </div> 
              
            </Col> */}

          </Row>



          <div id='salary'>
            <Title level={2}>Salary Expectations</Title>
          </div>
          <Row className="my-5">
            <Col xs={24} sm={24} md={22} lg={22}>
              <div className='inner-heading-wrapper'>
                <Title level={4}>What are your salary expectations?</Title>
                <Paragraph>Your Minimum Salary Expectations</Paragraph>
              </div>
              <Row>
                <Col xs={12} sm={12} md={5} lg={5}>
                  <b style={{ fontSize: '18px' }}>Salary : </b>
                  <Form.Item name='minSalary' rules={
                    [
                      {
                        required: true,
                        message: 'Please input your Annual Salary'
                      }
                    ]
                  }>
                    <InputNumber style={{ width: 200 }}
                      // defaultValue={user?.salary?.minSalary}
                      // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      onChange={changeAnnualSalary}
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={7} lg={7} style={{ marginTop: '30px' }}>
                  <b style={{ fontSize: '18px' }}> {numberWithCommas(minSalary.toFixed(0))} {} {currencyName && currencyName} per month </b>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                  {/* <div className='full-border'>
                <div className='inner-heading-wrapper'>
                  <Title level={3}>Your Currency</Title>
                  <Paragraph>{currencyName}</Paragraph>
                  <Button type='primary' onClick={openCurrencyModal}>Change Currency</Button>

                </div>
              </div> */}
                  <b style={{ fontSize: '18px' }}>Currency : </b>
                  <Form.Item name='currency' rules={
                    [
                      {
                        required: true,
                        message: 'Please Select your Currency'
                      }
                    ]
                  }>
                    <Select
                      placeholder="Select a Currency"
                      optionFilterProp="children"
                      onChange={handleChange}
                    >
                      {currencyOptions && currencyOptions.map((item, index) => {
                        return <Option key={index} value={item._id}>{item.name}</Option>
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

            </Col>


          </Row>

          <Row>
            <Col xs={5} sm={5} md={5} lg={5}>
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={btnLoading}>
                  Save
              </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      {/* 
      <Modal className="lg-modal"
        title="Update TimeZone"
        visible={timeZoneModal}
        footer={null}
        onCancel={handleTimezoneModalCancel}
      >
        <Row style={{ width: '100%' }}>

          <Form style={{ width: '100%' }}
            layout={'vertical'}
            form={timezoneForm}
            onFinish={handleTimezoneModalOk}
          >
            <Form.Item label='Time Zone :' name='timezone' rules={
              [
                {
                  required: true,
                  message: 'Please Select your Time Zone'
                }
              ]
            }>

              <Select
                style={{ width: '100%', marginBottom: "20px" }}
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

            <Row style={{ width: '100%' }}>
              <Col xs={12} sm={12} md={12} lg={12} />

              <Col xs={6} sm={6} md={6} lg={6}>
                <Button
                  type="primary"
                  block
                  style={{ float: "right" }}
                  onClick={handleTimezoneModalCancel}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={6} sm={6} md={5} lg={5}>
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Update
                </Button>
                </Form.Item>
              </Col>
            </Row>

          </Form>


        </Row>
      </Modal>


      <Modal className="lg-modal"
        title="Update Currency"
        visible={currencyModal}
        footer={null}
        onCancel={handleCurrencyModalCancel}

      >
        <Row style={{ width: '100%' }}>

          <Form style={{ width: '100%' }}
            layout={'vertical'}
            form={currencyForm}
            onFinish={handleCurrencyModalOk}
          >
            <Form.Item label='Currency :' name='currency' rules={
              [
                {
                  required: true,
                  message: 'Please Select Currency'
                }
              ]
            }>
              <Select
                placeholder="Select a Currency"
                optionFilterProp="children"
              >
                {currencyOptions && currencyOptions.map((item, index) => {
                  return <Option key={index} value={item._id}>{item.name}</Option>
                })}
              </Select>
            </Form.Item>
            <Row style={{ width: '100%' }}>
              <Col xs={12} sm={12} md={12} lg={12} />

              <Col xs={6} sm={6} md={6} lg={6}>
                <Button
                  type="primary"
                  block
                  style={{ float: "right" }}
                  onClick={handleCurrencyModalCancel}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={6} sm={6} md={5} lg={5}>
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Update
                </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>


        </Row>
      </Modal> */}

    </div>
  );
};

export default EngagementPreferences;
