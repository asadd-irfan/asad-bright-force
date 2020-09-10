import React, { useState, useEffect } from "react";
import {
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Upload,
  message,
  notification
} from "antd";
import PhoneInput from "react-phone-input-2";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "react-phone-input-2/lib/style.css";
import { useSelector, useDispatch } from "react-redux";
import { clearServerErrors } from "../../../../../actions/auth";
import "./manager.scss";
import { useHistory } from 'react-router-dom';

import SubNavbarButtons from '../SubNavbarButtons';
import { resetNotificationSetting } from "../../../../../actions/common";
import { updateStaffProfile,updateProfileImage } from "../../../../../actions/talentManager";
import { onFinishFailed, successNotification } from "../../../../../common/commonMethods";
import Sider from "../sidebar";
const { Title, Paragraph } = Typography;

const AddAccountManager = props => {
  const [form] = Form.useForm();
  const [isPhone, setPhone] = useState("");
  const [profilePicLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const apiResponse = useSelector(state => state.auth.apiResponse);
  // const user = useSelector(state => state.auth.user);
  const user = useSelector(state => state.talentManager.accountManager);
  console.log('user',user)
  const history = useHistory();

  const [profilePicURL, setProfilePicURL] = useState("");
  const btnLoading = useSelector(state => state.auth.btnLoading);
  const serverErrors = useSelector(state => state.auth.serverErrors);
  const showSuccessNotification = useSelector(
    state => state.auth.showSuccessNotification
  );
  const dispatch = useDispatch();

  const openSuccessNotification = () => {
    successNotification(apiResponse)
    dispatch(resetNotificationSetting());
  };
  const openErrorNotification = () => {
    notification.error({
      message: "Errors",
      description: "Errors"
    });
    dispatch(clearServerErrors());
    dispatch(resetNotificationSetting());
  };

  useEffect(() => {
    form.setFieldsValue({
      email: user && user.email,
      name: user && user.name,
      github: user && user.github ? user.github : null,
      linkedIn: user && user.linkedIn ? user.linkedIn : null,
      personalWebsite:
        user && user.personalWebsite ? user.personalWebsite : null,
      stackOverflow: user && user.stackOverflow ? user.stackOverflow : null,
      country:
        user && user.location && user.location.country
          ? user.location.country
          : null,
      city:
        user && user.location && user.location.city ? user.location.city : null
    });
    setPhone(user && user.phone);
    setProfilePicURL(user && user.profileImage);
    showSuccessNotification && openSuccessNotification();
    serverErrors && openErrorNotification();
  }, [showSuccessNotification, btnLoading, serverErrors, user]);

  
  const handleSubmit = values => {
    let location = null;
    if (values.country || values.city) {
      location = { country: values.country, city: values.city };
      delete values.city;
      delete values.country;
    }
      const profileData = { ...values, phone: isPhone, location };
      // delete profile Image because profile Image is already handle on change profile image
      // if not delete api will give error when saving data
      delete profileData.profileImage;
      dispatch(updateStaffProfile(user._id, profileData)).then(()=>{
        history.push(`/admin/staff/account-managers/${user._id}`);

      }).catch((err) => {
        console.log('err', err)
      });
  };


  let selectedImage = [];
  const properties = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: file => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return true;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must smaller than 2MB!");
        return true;
      }
      setProfilePicURL(file);
      setFileList([file]);
      selectedImage.push(file);
      return false;
    },
    fileList,
    onChange: () => {
      const formData = new FormData();
      formData.append("profileImage", selectedImage[0]);
      dispatch(updateProfileImage(user._id, formData));
      selectedImage=[]
    }
  };
  const uploadButton = (
    <div>
      {profilePicLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Sider>
    <div className="m-2 p-2">
      <SubNavbarButtons />
      
      <div className="personal-info-wrapper">
        <Title level={2}>Personal Info</Title>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        className="form-wrapper"
      >
        <div className="profile-pic-wrapper">
          <Row className="vertical-middle-align">
            <Col xs={24} sm={24} md={8} lg={6}>
              <Form.Item name='profileImage'>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  {...properties}
                >
                  {profilePicURL ? (
                    <img src={`/${profilePicURL}`} alt="profilePicture" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Paragraph>
                Adding a profile will help you get noticed, it doesn't have to
                be a photo of your face it can be anything that represent you
              </Paragraph>
              <Paragraph>optional</Paragraph>
            </Col>
            <Col xs={0} sm={0} md={5} lg={7}></Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Full Name" name='name' rules={
                  [
                    {
                      required: true,
                      message: "Please input your E-mail!"
                    }
                  ]
              }>
              <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Email Address" name='email' rules={
                  [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!"
                    }
                  ]
              }>
                  <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row id='contactInfo'>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Phone Number">
                <PhoneInput
                  country={"us"}
                  value={isPhone}
                  onChange={phone => setPhone(phone)}
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="social-links-wrapper">
            <Title level={2} id='location'>Location</Title>
          </div>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Country" name='country'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="City" name='city'>
              <Input />
              </Form.Item>
            </Col>
          </Row>
          <div className="social-links-wrapper" id='socialLinks'>
            <Title level={2}>Social Link</Title>
          </div>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="LinkedIn (optional)" name='linkedIn' rules={
                  [
                    {
                      type: "url",
                      message: "The input is not valid URL"
                    }
                  ]
              }>
                  <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="GitHub (optional)" name='github' rules={
                   [
                    {
                      type: "url",
                      message: "The input is not valid URL"
                    }
                  ]
              }>
                  <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="StackOverflow (optional)"  name='stackOverflow' rules={
                   [
                    {
                      type: "url",
                      message: "The input is not valid URL"
                    }
                  ]
              }>
                  <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Portfolio link/personal Website (optional)"  name='personalWebsite' rules={
                   [
                    {
                      type: "url",
                      message: "The input is not valid URL"
                    }
                  ]
              }>
                  <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={btnLoading}>
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>

      
    </Sider>
  );
};

export default AddAccountManager;
