import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Form, Row, Col, Select, Tag, DatePicker, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import '../../companies.scss'
import moment from 'moment'
import { onFinishFailed } from "../../../../../../common/commonMethods";
import { updateCompanyDetails } from "../../../../../../actions/company";
import CompanyBanner from './CompanyBanner';

const { Option } = Select;
const { TextArea } = Input;
const { CheckableTag } = Tag;



const CompanyProfileEdit = ({ selectedCompany, companyId }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const btnLoading = useSelector(state => state.auth.btnLoading);

  const [selectedIndustries, setSelectedIndustries] = useState([])
  const [selectedCompanyFeatures, setSelectedCompanyFeatures] = useState([])
  const [selectedCompanyValues, setSelectedCompanyValues] = useState([])
  const [selectedTechExperience, setSelectedTechExperience] = useState([]);

  const appConfigIndustryPref = useSelector(state => state.auth.appConfigs && state.auth.appConfigs['industry-preference'] ? state.auth.appConfigs['industry-preference'] : null);
  const appConfigCompanyValues = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['company-values']
      ? state.auth.appConfigs['company-values']
      : null
  );
  const appConfigCompanyFeatures = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['company-features']
      ? state.auth.appConfigs['company-features']
      : null
  );
  const cityPreferenceOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['city-preference']
  );
  const companySizesOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['company-size']
  );
  const currencyOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['currency']
  );
  const appConfigTechExp = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs["preferred-role"]
      ? state.auth.appConfigs["preferred-role"]
      : null
  );


  useEffect(() => {
    form.setFieldsValue({
      size: selectedCompany && selectedCompany.size && selectedCompany.size._id,
      foundationDate: selectedCompany && selectedCompany.foundationDate && moment(selectedCompany.foundationDate),
      amount: selectedCompany && selectedCompany.fundingRaised && selectedCompany.fundingRaised.amount,
      currency: selectedCompany && selectedCompany.fundingRaised && selectedCompany.fundingRaised.currency?._id,
      location: selectedCompany && selectedCompany.location,
      about: selectedCompany && selectedCompany.about,
      name: selectedCompany && selectedCompany.name,
      linkedIn: selectedCompany && selectedCompany.linkedIn ? selectedCompany.linkedIn : null,
      website: selectedCompany && selectedCompany.website ? selectedCompany.website : null,
    });
    
    let selectedCompanyValues = []
    let selectedCompanyFeatures = []
    let selectedIndustries = []
    let selectedTechExperience = []
    if (selectedCompany && selectedCompany.industries) {
      selectedIndustries = selectedCompany.industries.map(item => {
        return item._id;
      });
      setSelectedIndustries([...selectedIndustries])
    }
    if (selectedCompany && selectedCompany.companyValues) {
      selectedCompanyValues = selectedCompany.companyValues.map(item => {
        return item._id;
      });
      setSelectedCompanyValues([...selectedCompanyValues])
    }
    if (selectedCompany && selectedCompany.companyFeatures) {
      selectedCompanyFeatures = selectedCompany.companyFeatures.map(item => {
        return item._id;
      });
      setSelectedCompanyFeatures([...selectedCompanyFeatures])
    }
    if (selectedCompany && selectedCompany.technologiesUsed) {
      selectedTechExperience = selectedCompany.technologiesUsed.map(item => {
        return item._id;
      });
      setSelectedTechExperience([...selectedTechExperience])
    }
  }, [selectedCompany]);


  const handleSubmit = values => {
    const industries = selectedIndustries;
    const companyFeatures = selectedCompanyFeatures;
    const companyValues = selectedCompanyValues;
    const technologiesUsed = selectedTechExperience;
    let foundationDate = moment(values.foundationDate).format('YYYY-MM-DD')
    const fundingRaised = {
      amount: values.amount,
      currency: values.currency,
    }
    delete values.foundationDate
    const allValues = { 
      industries,
      companyFeatures,
      companyValues,
      technologiesUsed,
      fundingRaised,
      foundationDate,
      ...values
    };
    dispatch(updateCompanyDetails(allValues, companyId));
  };

  const handleTagChange = (checked, id) => {
    if (checked && selectedIndustries.length < 3) {
      setSelectedIndustries([...selectedIndustries, id])
    }
    else if (!checked && selectedIndustries.includes(id)) {
      let filteredItems = selectedIndustries.filter(function (item) {
        return item !== id
      })
      setSelectedIndustries(filteredItems)
    }
  };

  const handleValueTagChange = (checked, id) => {
    if (checked && selectedCompanyValues.length < 5) {
      setSelectedCompanyValues([...selectedCompanyValues, id])
    }
    else if (!checked && selectedCompanyValues.includes(id)) {
      let filteredItems = selectedCompanyValues.filter(function (item) {
        return item !== id
      })
      setSelectedCompanyValues(filteredItems)
    }
  };

  const handleFeaturesTagChange = (checked, id) => {
    if (checked && selectedCompanyFeatures.length < 5) {
      setSelectedCompanyFeatures([...selectedCompanyFeatures, id])
    }
    else if (!checked && selectedCompanyFeatures.includes(id)) {
      let filteredItems = selectedCompanyFeatures.filter(function (item) {
        return item !== id
      })
      setSelectedCompanyFeatures(filteredItems)
    }
  };

  const handleTechExpTagChange = (checked, id) => {
    if (checked) {
      setSelectedTechExperience([...selectedTechExperience, id])
    }
    else if (!checked && selectedTechExperience.includes(id)) {
      let filteredItems = selectedTechExperience.filter(function (item) {
        return item !== id
      })
      setSelectedTechExperience(filteredItems)
    }
  };
  
  return (
    <Fragment>
      <Row>
        <Col xs={0} sm={0} md={2} lg={2} />
        <Col xs={24} sm={24} md={20} lg={20}>
          <Form
            form={form}
            layout={'vertical'}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
            <Row style={{ marginBottom: '50px'}}>
              <Col xs={24} sm={24} md={18} lg={18}>
                <h3>Company info</h3>
                <hr style={{ border: '1px solid black' }} />
              </Col>
              <Col xs={0} sm={0} md={3} lg={3}>

              </Col>
              <Col xs={16} sm={16} md={0} lg={0}></Col>
              <Col xs={8} sm={8} md={3} lg={3}>
                <Button type='primary' htmlType="submit" loading={btnLoading}>Save Profile</Button>
              </Col>
            </Row>

            <Row style={{ marginBottom: '50px'}}>
              <Col xs={9} sm={9} md={4} lg={4}>
                <strong>Company Name :</strong>
              </Col>
              <Col xs={15} sm={15} md={6} lg={6}>
                <Form.Item name='name' rules={
                  [
                    {
                      required: true,
                      message: 'Please input your Company Name!'
                    }
                  ]
                }>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <CompanyBanner companyDetails={selectedCompany && selectedCompany}/>

            <Row>

              <Col xs={24} sm={24} md={24} lg={24}>
                <h6>About the company:</h6>
                <p>what is your company about, what are you solving?</p>
                <Form.Item name='about' rules={
                  [
                    {
                      required: true,
                      message: 'Please add something about your company!'
                    }
                  ]
                }>
                  <TextArea rows={5} />
                </Form.Item>
              </Col>
            </Row>


            <Row>
              <Col xs={24} sm={24} md={14} lg={14}>
                <h6>Industries</h6>
                <p>You can choose up to three </p>
                <Row>
                  {appConfigIndustryPref && appConfigIndustryPref.map((tag, index) => {
                    return (
                      <CheckableTag
                        key={index}
                        className='checkable-tag checkable-tag-margin'
                        value={tag.name}
                        checked={selectedIndustries.includes(tag._id) ? true : false}
                        onChange={(checked) => handleTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                    );
                  })}
                </Row>
              </Col>
            </Row>


            <Row>
              <Col xs={24} sm={24} md={11} lg={11}>
                <div>
                  <h6>Company Size</h6>
                  <p>what is your company about, what are you solving? </p>
                  <Form.Item name='size'>
                    <Select
                      showSearch
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

                <div>
                  <h6>Company Location</h6>
                  <p>What is the company location? </p>
                  <Form.Item name='location'>
                    {/* <Select
                      showSearch
                      allowClear
                      style={{ width: 320 }}
                      placeholder="Select a Location"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {cityPreferenceOptions && cityPreferenceOptions.map((city, index) => {
                        return <Option key={index} value={city._id}>{city.name}</Option>
                      })}
                    </Select> */}
                     <Input style={{width:330}}/>
                  </Form.Item>
                </div>

                <div>
                  <h6>Foundation date</h6>
                  <Form.Item name='foundationDate'>
                    <DatePicker className='width-330' />
                  </Form.Item>
                </div>

                <div>
                  <h6>Funding raised</h6>
                  <Row>
                    <Col xs={10} sm={10} md={8} lg={8}>
                      <Form.Item name='currency'>
                        <Select
                          showSearch
                          allowClear
                          placeholder="Select a Currency"
                          optionFilterProp="children"
                          style={{ width: 150 }}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {currencyOptions && currencyOptions.map((item, index) => {
                            return <Option key={index} value={item._id}>{item.name}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={1}>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <Form.Item name='amount'>
                        <InputNumber style={{ width: '100%' }} type="number" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

              </Col>
              <Col xs={0} sm={0} md={2} lg={2}></Col>
              <Col xs={24} sm={24} md={11} lg={11}>
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
            </Row>

            <Row>
              <Col xs={18} sm={18} md={18} lg={18}>
                <h4>Top company Values and Features </h4>
                <hr style={{ border: '1px solid black' }} />
              </Col>
              <Col xs={3} sm={3} md={3} lg={3}></Col>
            </Row>

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
                        onChange={(checked) => handleValueTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                    );
                  })}
                </Row>
              </Col>
            </Row>

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
            </Row>


            <Row>
              <Col xs={18} sm={18} md={18} lg={18}>
                <h4>Some important links</h4>
                <hr style={{ border: '1px solid black' }} />
              </Col>
              <Col xs={3} sm={3} md={3} lg={3}></Col>
            </Row>

            <Row>
              <Col xs={24} sm={24} md={10} lg={10}>
                <Form.Item label="LinkedIn :  (optional)" name='linkedIn' rules={
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
              <Col xs={0} sm={0} md={2} lg={2}></Col>
              <Col xs={24} sm={24} md={10} lg={10}>
                <Form.Item label="Company website : (optional)" name='website' rules={
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
              <Col xs={16} sm={16} md={22} lg={22}></Col>
              <Col xs={8} sm={8} md={2} lg={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={btnLoading}>
                    Save Profile
                </Button>
                </Form.Item>
              </Col>
            </Row>

          </Form>

        </Col>
        <Col xs={0} sm={0} md={2} lg={2} />
      </Row>

    </Fragment>
  );
}
export default CompanyProfileEdit;

