import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Form, Row, Col, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { onFinishFailed } from "../../common/commonMethods";
import '../../App.scss'
import { changeUserInfo } from '../../actions/auth';
import ChangePassword from './ChangePassword';
import './AccountSettings.scss'

const { Option } = Select;

const ProfileForm = () => {
  const [form] = Form.useForm();
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const user = useSelector(state => state.auth.user);
  const [isPhone, setPhone] = useState("");
  const appConfigs = useSelector(state => state.auth.appConfigs);
  // let companyTitleOptions = appConfigs && appConfigs['title']
  const dispatch = useDispatch()
  
  useEffect(() => {
    // let matchedTitle = []
    // matchedTitle = user && companyTitleOptions && companyTitleOptions.map(item => {
    //   if (item._id === user.title._id) {
    //     return item
    //   }
    //   else {
    //     return null
    //   }
    // }).filter(Boolean);
    form.setFieldsValue({
      fullName: user && user.fullName,
      title: user?.title,
      email: user && user.email,
    });
    setPhone(user && user.phone);

  }, [user, appConfigs])

  const handleSubmit = values => {
    const profileData = { ...values, phone: isPhone };
    dispatch(changeUserInfo(profileData));
  };

  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 14,
        offset: 8,
      },
      md: {
        span: 4,
        offset: 17,
      },
      lg: {
        span: 4,
        offset: 17,
      }
    }
  };


  return (
    <Fragment>
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '40px' }}>
        <h1>Account Settings</h1>
        <hr style={{ border: '1px solid black' }} />
      </div>
      <Form
        {...formItemLayout}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Row>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Full Name :' name='fullName'>
              <Input style={{ color: 'black' }} />
            </Form.Item>

          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label="Title:" name='title'>
                {/* <Select
                  showSearch
                  allowClear
                  style={{ width: 235 }}
                  placeholder="Select a Title"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {companyTitleOptions && companyTitleOptions.map((title, index) => {
                    return <Option key={index} value={title._id}>{title.name}</Option>
                  })}
                </Select> */}
                <Input />
              </Form.Item>
          </Col>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
        </Row>
        <Row>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Email Address :' name='email'>
              <Input style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label="Phone Number">
                <PhoneInput
                  country={"us"}
                  className='phone-class'
                  value={isPhone}
                  onChange={phone => setPhone(phone)}
                />
              </Form.Item>
          </Col>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
        </Row>

        <Form.Item  {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' loading={btnLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
      
      <ChangePassword />

      <div style={{ textAlign: 'left', marginTop: '50px', marginBottom: '30px', marginLeft: '100px' }}>
        <p >Want to delete you Account?</p>
        <Link to='/talent/settings'> Delete</Link>
      </div>

    </Fragment>
  );
}
export default ProfileForm;

