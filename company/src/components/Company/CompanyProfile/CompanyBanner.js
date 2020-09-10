import React, { Fragment, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import {
  Row,
  Col,
  Upload,
  message,
  Button
} from "antd";
import { useDispatch } from 'react-redux'
import { UploadOutlined } from "@ant-design/icons";

import { updateBannerImage, updateCompanyLogo } from '../../../actions/company';


const CompanyBanner = ({ companyDetails }) => {
  const [fileList, setFileList] = useState([]);

  const dispatch = useDispatch()

  let selectedBannerImage = [];
  const BannerProperties = {
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
      setFileList([file]);
      selectedBannerImage.push(file);
      return false;
    },
    fileList,
    onChange: () => {
      const formData = new FormData();
      formData.append("bannerImage", selectedBannerImage[0]);
      dispatch(updateBannerImage(formData, companyDetails._id));
      selectedBannerImage = []
    }
  };

  let selectedLogoImage = [];
  const LogoProperties = {
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
      setFileList([file]);
      selectedLogoImage.push(file);
      return false;
    },
    fileList,
    onChange: () => {
      const formData = new FormData();
      formData.append("logo", selectedLogoImage[0]);
      dispatch(updateCompanyLogo(formData, companyDetails._id));
      selectedLogoImage = []
    }
  };


  return (
    <Fragment>
      <Row style={{ marginBottom: '10px', height: '100px', width: '100%' }}>
        <Col xs={24} sm={24} md={24} lg={24} style={{ textAlign: 'center' }}>
          {companyDetails && companyDetails.logo && companyDetails.logo !== undefined &&
            // <img className='logo-image' height='100px' width='100px' src={`/${companyDetails && companyDetails.logo}`} alt='company logo' />
            <img className='logo-image' height='100px' width='100px' src={companyDetails?.logo.includes('http') ? companyDetails?.logo : `/${companyDetails?.logo}`} alt='company logo' />
          }
          <br />
          {/* {companyDetails && companyDetails.bannerImage && companyDetails.bannerImage !== undefined  && 
          // <img className='banner-image' height='300px' width='100%' src={`/${companyDetails && companyDetails.bannerImage}`} alt='company banner' />
          <img className='banner-image' height='300px' width='100%' src={companyDetails?.bannerImage.includes('http') ? companyDetails?.bannerImage :`/${companyDetails?.bannerImage}`}  alt='company banner' />
          } */}
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={24} md={6} lg={6}>
          <Upload {...LogoProperties} showUploadList={false}>
            <Button>
              <UploadOutlined /> Click to Upload Logo
              </Button>
          </Upload>
        </Col>
        {/* <Col xs={24} sm={24} md={6} lg={6}>
          <Upload {...BannerProperties} showUploadList={false}>
            <Button>
              <UploadOutlined /> Click to Upload Banner
              </Button>
          </Upload>
        </Col> */}
      </Row>
    </Fragment>
  );
}
export default CompanyBanner;

