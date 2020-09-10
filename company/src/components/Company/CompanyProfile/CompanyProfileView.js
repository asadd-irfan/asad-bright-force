import React, { Fragment } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Tag, Row, Col } from 'antd';
import moment from 'moment'
import {
  LinkedinFilled,
  GlobalOutlined,
} from "@ant-design/icons";

const CompanyProfileView = ({ companyDetails }) => {

  return (
    <Fragment>
      <Row>
        <Col xs={0} sm={0} md={1} lg={1} />
        <Col xs={24} sm={24} md={22} lg={22}>


          <Row style={{ marginBottom: '40px' }}>
            <Col xs={8} sm={8} md={9} lg={9} >
              <hr style={{ border: "2px solid black" }} />
            </Col>
            <Col xs={8} sm={8} md={6} lg={6} >
              {companyDetails && companyDetails.logo &&
                // <img className='logo-image' height='100px' width='100px' src={`/${companyDetails && companyDetails.logo}`} alt='company logo' />}
                <img className='logo-image' height='100px' width='100px' src={companyDetails?.logo.includes('http') ? companyDetails?.logo : `/${companyDetails?.logo}`} alt='company logo' />}
              {/* <br /> */}
              {/* {companyDetails && companyDetails.bannerImage &&
                <img className='banner-image' height='300px' width='100%' src={companyDetails?.bannerImage.includes('http') ? companyDetails?.bannerImage : `/${companyDetails?.bannerImage}`} alt='company banner' />} */}

            </Col>
            <Col xs={8} sm={8} md={9} lg={9} >
              <hr style={{ border: "2px solid black" }} />
            </Col>

          </Row>
          <Row justify="center" style={{ margin: '100px', textAlign: 'center' }} >
            <Col xs={24} sm={24} md={24} lg={24}>
              <h5> {companyDetails && companyDetails.name}</h5>
            </Col>
          </Row>
          <Row style={{ marginBottom: '50px' }}>
            <Col xs={12} sm={8} md={5} lg={5}>
              <Row> <h5> <a href={companyDetails && companyDetails.linkedIn}><LinkedinFilled style={{ fontSize: '30px', marginRight: '10px', color: '#007bff' }} /> <span>LinkedIn</span></a> </h5></Row>
            </Col>
            <Col xs={12} sm={8} md={5} lg={5}>
              <Row> <h5> <a href={companyDetails && companyDetails.website}><GlobalOutlined style={{ fontSize: '30px', marginRight: '10px', color: '#007bff' }} /><span>Website</span></a> </h5></Row>
            </Col>
          </Row>

          <Row style={{ marginBottom: '50px' }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <h5>About the company:</h5>
              <p>{companyDetails && companyDetails.about}</p>

            </Col>
          </Row>


          <Row style={{ marginBottom: '40px' }}>
            <Col xs={0} sm={0} md={6} lg={6}>


            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <h5>Size</h5>
              <p>{companyDetails && companyDetails.size && companyDetails.size.name}</p>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2} />

            <Col xs={24} sm={24} md={6} lg={6}>
              <h5>Location</h5>
              <p>{companyDetails?.location}</p>
            </Col>

          </Row>
          <Row style={{ marginBottom: '50px' }}>
            <Col xs={0} sm={0} md={10} lg={10} />


            <Col xs={24} sm={24} md={8} lg={8}>
              <h5>Industries</h5>
              <p>{companyDetails && companyDetails.industries.map((industry, index) => {
                return (
                  <span key={index}>{index > 0 && ', '}{industry.name}</span>
                )
                {/* <Tag key={index} style={{ padding: '5px', margin: '10px 10px 10px 0px' }}>{industry.name}</Tag> */ }
              })}</p>

            </Col>

          </Row>

          {/* <Row style={{ marginBottom: '50px' }}>
            <Col xs={0} sm={0} md={7} lg={7}>

            </Col>
            <Col xs={12} sm={12} md={7} lg={7}>
              <h5>Funding raised</h5>
              <p>
                {companyDetails?.fundingRaised?.currency?.name} : {companyDetails?.fundingRaised?.amount}
              </p>
            </Col>
            <Col xs={12} sm={12} md={7} lg={7}>
              <h5>Foundation date</h5>
              <p>
                {companyDetails && companyDetails.foundationDate && moment(companyDetails.foundationDate).format('YYYY-MM-DD')}
              </p>
            </Col>

          </Row> */}

          {/* <Row style={{ marginBottom: '50px' }}>
            <Col xs={0} sm={0} md={8} lg={8}>

            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <h5 style={{ textAlign: 'center' }}>Technologies used</h5>
              {companyDetails && companyDetails.technologiesUsed.map((obj, index) => {
                return (
                  <Tag key={index} style={{ padding: '5px', margin: '10px 10px 10px 0px' }}>{obj.name}</Tag>
                )
              })}
            </Col>

            <Col xs={0} sm={0} md={8} lg={8}>

            </Col>
          </Row> */}

          <Row style={{ marginBottom: '50px' }}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h5>Company Values</h5>
              {companyDetails && companyDetails.companyValues.map((value, index) => {
                return (
                  <Tag key={index} style={{ padding: '5px', margin: '5px' }}>{value.name}</Tag>
                )
              })}
            </Col>
            <Col xs={0} sm={0} md={1} lg={1}>

            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <h5>Company features</h5>
              {companyDetails && companyDetails.companyFeatures.map((obj, index) => {
                return (
                  <Tag key={index} style={{ padding: '5px', margin: '5px' }}>{obj.name}</Tag>
                )
              })}
            </Col>
          </Row>

        </Col>
      </Row>

    </Fragment>
  );
}
export default CompanyProfileView;

