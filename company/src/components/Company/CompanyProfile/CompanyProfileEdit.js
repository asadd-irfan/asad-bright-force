import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Form, Row, Col, Select, Tag, DatePicker, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import './companyProfile.scss'
import moment from 'moment'
import { onFinishFailed } from "../../../common/commonMethods";
import { updateCompanyDetails } from "../../../actions/company";
import CompanyBanner from './CompanyBanner';
import SearchBar from '../../PlacesAutoComplete/SearchBar'

const { Option } = Select;
const { TextArea } = Input;
const { CheckableTag } = Tag;

const CompanyProfileEdit = ({ companyDetails, goToView }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector(state => state.auth.user);
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const [location, setLocation] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);

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
      size: companyDetails && companyDetails.size && companyDetails.size._id,
      // foundationDate: companyDetails && companyDetails.foundationDate && moment(companyDetails.foundationDate),
      // amount: companyDetails && companyDetails.fundingRaised && companyDetails.fundingRaised.amount,
      // currency: companyDetails && companyDetails.fundingRaised && companyDetails.fundingRaised.currency && companyDetails.fundingRaised.currency._id,
      // location: companyDetails && companyDetails.location,
      about: companyDetails && companyDetails.about,
      name: companyDetails && companyDetails.name,
      linkedIn: companyDetails && companyDetails.linkedIn ? companyDetails.linkedIn : null,
      website: companyDetails && companyDetails.website ? companyDetails.website : null,
    });
    setLocation(companyDetails?.location)

    let selectedCompanyValues = []
    let selectedCompanyFeatures = []
    let selectedIndustries = []
    // let selectedTechExperience = []
    if (companyDetails && companyDetails.industries) {
      selectedIndustries = companyDetails.industries.map(item => {
        return item._id;
      });
      setSelectedIndustries([...selectedIndustries])
    }
    if (companyDetails && companyDetails.companyValues) {
      selectedCompanyValues = companyDetails.companyValues.map(item => {
        return item._id;
      });
      setSelectedCompanyValues([...selectedCompanyValues])
    }
    if (companyDetails && companyDetails.companyFeatures) {
      selectedCompanyFeatures = companyDetails.companyFeatures.map(item => {
        return item._id;
      });
      setSelectedCompanyFeatures([...selectedCompanyFeatures])
    }
    // if (companyDetails && companyDetails.technologiesUsed) {
    //   selectedTechExperience = companyDetails.technologiesUsed.map(item => {
    //     return item._id;
    //   });
    //   setSelectedTechExperience([...selectedTechExperience])
    // }
    if (companyDetails?.about && companyDetails?.size && companyDetails?.location) {
      setShowEditProfile(true);
    }

  }, [companyDetails]);
  console.log('location', location)

  const handleSubmit = values => {
    console.log('location1', location)
    const industries = selectedIndustries;
    const companyFeatures = selectedCompanyFeatures;
    // const technologiesUsed = selectedTechExperience;
    const companyValues = selectedCompanyValues;
    const companyLocation = location.toString();
    if (companyFeatures.length < 1) {
      notification.error({
        message: 'Error',
        description: 'Select any Company features',
      });
    } else if (companyValues.length < 1) {
      notification.error({
        message: 'Error',
        description: 'Select any Company Values',
      });
    } else if (industries.length < 1) {
      notification.error({
        message: 'Error',
        description: 'Select any Industries',
      });
    }
    // else if (companyLocation === "") {
    //   notification.error({
    //     message: 'Error',
    //     description: 'Please Input company location',
    //   });
    // }
    else {
      // let foundationDate = moment(values.foundationDate).format('YYYY-MM-DD')
      // const fundingRaised = {
      //   amount: values.amount,
      //   currency: values.currency,
      // }
      delete values.foundationDate
      let allValues = {
        industries,
        companyFeatures,
        companyValues,
        // technologiesUsed,
        // fundingRaised,
        // foundationDate,
        ...values
      };
      let obj = { ...allValues, location: companyLocation }

      dispatch(updateCompanyDetails(obj, user.company)).then(() => {
        goToView();
      });
    }
  };

  const handleTagChange = (checked, id) => {
    if (checked && selectedIndustries.length < 5) {
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
    if (checked && selectedCompanyValues.length < 3) {
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
    if (checked && selectedCompanyFeatures.length < 3) {
      setSelectedCompanyFeatures([...selectedCompanyFeatures, id])
    }
    else if (!checked && selectedCompanyFeatures.includes(id)) {
      let filteredItems = selectedCompanyFeatures.filter(function (item) {
        return item !== id
      })
      setSelectedCompanyFeatures(filteredItems)
    }
  };
  // const handleTechExpTagChange = (checked, id) => {
  //   if (checked) {
  //     setSelectedTechExperience([...selectedTechExperience, id])
  //   }
  //   else if (!checked && selectedTechExperience.includes(id)) {
  //     let filteredItems = selectedTechExperience.filter(function (item) {
  //       return item !== id
  //     })
  //     setSelectedTechExperience(filteredItems)
  //   }
  // };
  const getLocation = (location) => {
    setLocation(location)
  }

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
            <Row style={{ marginBottom: '50px' }}>
              {showEditProfile === true ? <Col xs={24} sm={24} md={18} lg={18}>
                <h2>Company Profile - Edit</h2>
              </Col>
                : <Col xs={24} sm={24} md={18} lg={18}>
                  <h2 className="mb-3">Welcome to your company profile</h2>
                  <p>Completing your profile allows us to showcase your profile to attract top candidates
                and to match candidates not just on position but also on company attributes.</p>
                </Col>}

            </Row>

            <Row style={{ marginBottom: '50px' }}>
              <Col xs={24} sm={24} md={10} lg={10}>
                {/* <Col xs={9} sm={9} md={4} lg={4}> */}
                <strong>Company Name :</strong> <br />
                {/* </Col> */}
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
              <Col xs={0} sm={0} md={2} lg={2} />

              <Col xs={24} sm={24} md={12} lg={12}>

                <CompanyBanner companyDetails={companyDetails && companyDetails} />
              </Col>

            </Row>




            <Row className="m-2">
              <Col xs={24} sm={24} md={10} lg={10}>
                <div>
                  <h6>Company Size</h6>
                  <p>what is your company about, what are you solving? </p>
                  <Form.Item name='size' rules={
                    [
                      {
                        required: true,
                        message: 'Please Select your Company Size!'
                      }
                    ]
                  }>
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
              </Col>
              <Col xs={0} sm={0} md={2} lg={2} />
              <Col xs={24} sm={24} md={10} lg={10}>
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
                    {/* <Input style={{ width: 330 }} /> */}
                    <SearchBar getLocation={getLocation} talentLocation={location} />
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Row className="m-2">
              <Col xs={24} sm={24} md={10} lg={10}>
                <h6>LinkedIn : (optional)</h6>

                <Form.Item name='linkedIn' rules={
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
              <Col xs={0} sm={0} md={2} lg={2} />
              <Col xs={24} sm={24} md={10} lg={10}>
                <h6>Company website : (optional)</h6>
                <Form.Item name='website' rules={
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

            <Row className="m-2">

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

            <Row className="m-2">
              <Col xs={24} sm={24} md={16} lg={16}>
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
                        onChange={(checked) => handleTagChange(checked, tag._id, tag.name)}> {tag.name}</CheckableTag>
                    );
                  })}
                </Row>
              </Col>
            </Row>

            {/* <Row>
              <Col xs={24} sm={24} md={10} lg={10}>

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
            </Row> */}

            {/* <Row>
              <Col xs={18} sm={18} md={18} lg={18}>
                <h4>Top company Values and Features </h4>
                <hr style={{ border: '1px solid black' }} />
              </Col> 
              <Col xs={3} sm={3} md={3} lg={3}></Col>
            </Row> */}

            <Row className="m-3">
              <Col xs={24} sm={24} md={16} lg={16}>
                <h6>Company Values</h6>
                <p>You can choose up to three </p>
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

            <Row className="m-3">
              <Col xs={24} sm={24} md={16} lg={16}>
                <h6>Company features </h6>
                <p>You can choose up to three </p>
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


            {/* <Row>
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
            </Row> */}

            <Row className="my-5 mx-3">
              {/* <Col xs={16} sm={16} md={22} lg={22}></Col> */}
              <Col xs={12} sm={12} md={8} lg={8}>
                <Form.Item>
                  {showEditProfile === true ? <Button type="primary" block htmlType="submit" loading={btnLoading}>
                    Save
                </Button> :
                    <Button type="primary" block htmlType="submit" loading={btnLoading}>
                      Create Your Company Profile
                </Button>}
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

