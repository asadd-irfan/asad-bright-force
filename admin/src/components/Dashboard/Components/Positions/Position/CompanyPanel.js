import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col, Typography, Tag, Form, Checkbox, Select } from 'antd';
import { useSelector } from "react-redux";
import '../positions.scss'
import { useHistory } from "react-router-dom";

const { Panel } = Collapse;
const { Paragraph } = Typography;
const { CheckableTag } = Tag;
const { Option } = Select;

function CompanyPanel({
  selectedCompany,
  selectedIndustries,
  selectedCompanyFeatures,
  selectedCompanyValues,
  selectedTechExperience,
  handleIndustryTagChange,
  handleTechExpTagChange,
  handleCompanyValueTagChange,
  handleFeaturesTagChange,
  handleIgnoreChange,
  ignoreValues,

}) {

  const appConfigs = useSelector(state => state.auth.appConfigs);
  const appConfigIndustryPref = appConfigs && appConfigs['industry-preference']
  const companySizesOptions = appConfigs && appConfigs['company-size']
  const appConfigTechExp = appConfigs && appConfigs['preferred-role']
  const appConfigCompanyValues = appConfigs && appConfigs['company-values']
  const appConfigCompanyFeatures = appConfigs && appConfigs['company-features']
  const history = useHistory();

  const gotoCompanyPage = (id) => {
    history.push(`/admin/companies/company/${id}`);
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Company Details Panel" key="1">
          <div style={{ cursor: "pointer" }} onClick={() => gotoCompanyPage(selectedCompany?._id)}>
            <h6>{selectedCompany?.name}</h6>
          </div><br />

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <h6>About the company</h6>
              <Paragraph>{selectedCompany?.about}</Paragraph>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <h6>Company Location</h6>
              <Paragraph>{selectedCompany?.location}</Paragraph>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <h6>Industries</h6>
              <p>You can choose up to five </p>
              <Row>
                {appConfigIndustryPref && appConfigIndustryPref.map((tag, index) => {
                  return (
                    <CheckableTag
                      key={index}
                      className='checkable-tag checkable-tag-margin'
                      value={tag.name}
                      checked={selectedIndustries.includes(tag._id) ? true : false}
                      onChange={(checked) => handleIndustryTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                  );
                })}
              </Row>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br /><br />
              <Checkbox onChange={(e) => handleIgnoreChange(e, 'Industries')}>
                All Ignore
                </Checkbox>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <div>
                <h6>Company Size</h6>
                <Form.Item name='size'>
                  <Select
                    showSearch
                    disabled={ignoreValues?.Size}
                    allowClear
                    style={{ width: 320 }}
                    placeholder="Select a Size"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {companySizesOptions && companySizesOptions.map((size, index) => {
                      return <Option key={index} value={size._id}>{size.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br />
              <Checkbox onChange={(e) => handleIgnoreChange(e, 'Size')}>
                All Ignore
                </Checkbox>
            </Col>
          </Row>
          <br />

          {/* <Row>
              <Col xs={24} sm={24} md={14} lg={14}>
              <h6>Tech Stack</h6>
                <p>What tech do you use? </p>
                <Row>
                  {appConfigTechExp && appConfigTechExp.map((tag, index) => {
                    return (
                      <CheckableTag
                        key={index}
                        className='checkable-tag checkable-tag-margin'
                        value={tag.name}
                        checked={selectedTechExperience.includes(tag._id) ? true : false}
                        onChange={(checked) => handleTechExpTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                    );
                  })}
                </Row>
              </Col>
              <Col xs={0} sm={0} md={3} lg={3}></Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <br /><br />
                <Checkbox onChange={(e) => handleIgnoreChange(e, 'TechExperience')}>
                  All Ignore
                </Checkbox>
              </Col>
                  
            </Row> 
          <br /> */}

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <h6>Company Values</h6>
              <p>You can choose up to five </p>
              <Row>
                {appConfigCompanyValues && appConfigCompanyValues.map((tag, index) => {
                  return (
                    <CheckableTag
                      key={index}
                      className='checkable-tag checkable-tag-margin'
                      value={tag.name}
                      checked={selectedCompanyValues.includes(tag._id) ? true : false}
                      onChange={(checked) => handleCompanyValueTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                  );
                })}
              </Row>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br /><br />
              <Checkbox onChange={(e) => handleIgnoreChange(e, 'CompanyValues')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <h6>Company features </h6>
              <p>You can choose up to five </p>
              <Row>
                {appConfigCompanyFeatures && appConfigCompanyFeatures.map((tag, index) => {
                  return (
                    <CheckableTag
                      key={index}
                      className='checkable-tag checkable-tag-margin'
                      value={tag.name}
                      checked={selectedCompanyFeatures.includes(tag._id) ? true : false}
                      onChange={(checked) => handleFeaturesTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                  );
                })}
              </Row>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br /><br />
              <Checkbox onChange={(e) => handleIgnoreChange(e, 'CompanyFeatures')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br />

        </Panel>
      </Collapse>
    </div>
  )
}

export default CompanyPanel
