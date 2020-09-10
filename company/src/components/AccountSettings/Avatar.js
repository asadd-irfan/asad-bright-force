import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import {
  Typography,
  Row,
  Col,
  Form,
  Upload,
  message,
} from "antd";
import { useSelector, useDispatch } from 'react-redux'
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { updateUserProfileImage } from '../../actions/company';
import { onFinishFailed } from "../../common/commonMethods";
import '../../App.scss'
import './AccountSettings.scss'
const { Paragraph } = Typography;

const Avatar = () => {
  const [form] = Form.useForm();
  const [profilePicLoading] = useState(false);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [fileList, setFileList] = useState([]);

  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch()

  useEffect(() => {
    setProfilePicURL(user && user.profileImage);
  }, [user]);


  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
  };
  const uploadButton = (
    <div>
      {profilePicLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

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
      // setProfilePicURL(file);
      setProfilePicURL(file.name);

      setFileList([file]);
      selectedImage.push(file);
      return false;
    },
    fileList,
    onChange: () => {
      const formData = new FormData();
      formData.append("profileImage", selectedImage[0]);
      dispatch(updateUserProfileImage(formData));
      selectedImage = []
    }
  };

  return (
    <Fragment>
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '50px' }}>
        <h1>Avatar</h1>
        <hr style={{ border: '1px solid black' }} />
      </div>
      <Row>
        <Col xs={0} sm={0} md={6} lg={6}>

        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form
            {...formItemLayout}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <div>
              <Row>
                <Col xs={12} sm={12} md={8} lg={8}>
                  <Form.Item name='logo'>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      {...properties}
                    >
                      {profilePicURL ? (
                        <img
                          src={
                            profilePicURL?.includes("http")
                              ? profilePicURL
                              : `/${profilePicURL}`
                          }
                          height="150px"
                          width="150px"
                          alt="Logo"
                        />
                      ) : (
                          uploadButton
                        )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} md={11} lg={11}>
                  <Paragraph>
                    Adding a picture to your name goes
                    a long way with candidates
              </Paragraph>
                  <Paragraph>(optional)</Paragraph>
                </Col>
                <Col xs={0} sm={0} md={5} lg={7}></Col>
              </Row>
            </div>

          </Form>
          <div style={{ minHeight: '200px' }}></div>
          {/* <div style={{ textAlign: 'left', marginTop: '50px', marginBottom: '30px' }}>
          <p >Want to delete your Account?</p>
          <Link to='/talent/settings'> Delete</Link>
        </div> */}
        </Col>
        {/* <Col xs={0} sm={0} md={6} lg={6}>
          
        </Col> */}
      </Row>


    </Fragment>
  );
}
export default Avatar;

