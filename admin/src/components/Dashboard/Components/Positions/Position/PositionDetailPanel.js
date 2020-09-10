import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col, Typography, Tag, Form, Checkbox, Slider, Select, TimePicker, InputNumber, Radio } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import '../positions.scss'
import TagInput from './TagInput'
import { getAllUsersOfCompany } from '../../../../../actions/company'



const { Panel } = Collapse;
const { Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = TimePicker;


const JobSearchStatus = [
  { name: "Actively Looking", value: 'actively-looking' },
  { name: "Exploring", value: 'exploring' },
  { name: "Not Looking", value: 'not-looking' },
]

function PositionDetailPanel({
  companyPositionDetails,
  handleIgnorePositionChange,
  ignorePositionValues,
  manageExpCheckBoxHandler,
  manageExpCheckBox,
  mainRoleSkillHandleFocus,
  mainRoleSkillsSelectHandler,
  mainRoleSkillsClearField,
  autoCompleteMainRoleSkill,
  mainRoleSkill,
  mainRoleSkills,
  handlePositionRoleFeaturesTagChange,
  selectedRoles,
  setSelectedSortedRoles,
  selectedSortedRoles,
  appConfigRoles,
  roleFeaturesKey,
}) {

  const dispatch = useDispatch();
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const companyUsers = useSelector(state => state.company.companyUsers);
  const currencyOptions = appConfigs && appConfigs['currency']
  const roleOptions = appConfigs && appConfigs['preferred-role']
  const employmentOptions = appConfigs && appConfigs['employment-type']

  const [usersNames, setUsersNames] = useState([])

  useEffect(() => {
    if (companyPositionDetails !== null && companyUsers === null) {
      dispatch(getAllUsersOfCompany(companyPositionDetails?.companyId?._id))
    }
  }, [companyPositionDetails, companyUsers])

  useEffect(() => {
    let names = usersNames
    if (companyPositionDetails !== null) {
      companyUsers && companyUsers.map((user) => {
        companyPositionDetails.hiringTeam.map(member => {
          if (user._id === member) {
            names.push(user.fullName)
          }
        })
        setUsersNames(names);
      })
    }
  }, [companyPositionDetails, companyUsers])


  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header='Position Details Panel' key='1'>
          <h6>{companyPositionDetails?.title}</h6><br />

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <h6>Main Responsibilities</h6>
              <Paragraph>{companyPositionDetails?.mainResponsibilities}</Paragraph>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <h6>Company Users</h6>
              <ul>
                {usersNames && usersNames.length > 0 && usersNames.map((user, index) => (
                  <Tag className='tag-style' key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} >
                    {user}
                  </Tag>
                ))}
              </ul>

            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <h6>Type</h6>
              <Paragraph>{companyPositionDetails?.name?.name}</Paragraph>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={2} lg={2}>
              <h5>Role </h5>
            </Col>
            <Col xs={24} sm={24} md={5} lg={5}>
              <Form.Item name='roleName'>
                <Select
                  disabled={ignorePositionValues?.Role}
                  allowClear
                  style={{ width: 213 }}
                >
                  {roleOptions && roleOptions.map((role, index) => {
                    return <Option key={index} value={role._id}>{role.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} style={{ top: '-40px' }}>
              <Paragraph className='font-weight-bold mb-2 d-flex justify-content-center'>Years of Experience</Paragraph >
              <Form.Item name='roleExp'>
                <Slider
                  marks={{
                    0: '0',
                    5: '5',
                    10: '10',
                    15: '15',
                    20: '20'
                  }}
                  disabled={ignorePositionValues?.Role}
                  min={0}
                  max={20}
                  style={{ marginLeft: '25px', marginTop: '5px' }}
                  className='ant-slider-custom-styles'
                />
              </Form.Item>

            </Col>
            <Col xs={0} sm={0} md={1} lg={1}>
            </Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'Role')}>
                All Ignore
                </Checkbox>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <>
                <Row id='tech-experience'>

                  <Col xs={24} sm={24} md={16} lg={16}>
                    <Paragraph style={{ color: 'black', fontSize: '18px' }}>Skills</Paragraph >
                  </Col>
                </Row>
                <>
                  <Row id='tech-experience'>

                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Select
                        style={{ width: '100%', marginBottom: '20px' }}
                        onFocus={mainRoleSkillHandleFocus}
                        onSelect={mainRoleSkillsSelectHandler}
                        value={autoCompleteMainRoleSkill}
                        showSearch
                        showArrow={false}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder='Type a skill, e.g. React'
                      >
                        {mainRoleSkill.map(exp => (
                          <Option key={exp}>{exp}</Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                  <Row justify='start'>
                    <Col xs={23} sm={23} md={12} lg={12}>
                      {mainRoleSkills.map((item, index) => (
                        <Tag className='tag-style' key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => mainRoleSkillsClearField(e, index, item.experienceName)}>
                          {item.experienceName}
                        </Tag>
                      ))}
                    </Col>
                  </Row>
                </>

              </>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br />
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'Skills')}>
                All Ignore
                </Checkbox>
            </Col>
          </Row>
          <br />

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <div className='my-3'>
                <h5>Management Experience</h5>
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Checkbox disabled={ignorePositionValues?.ManagementExperience} onChange={manageExpCheckBoxHandler} className='checkbox-style' checked={manageExpCheckBox}>
                      Is Management Experience?
              </Checkbox>
                  </Col>

                </Row>

                {manageExpCheckBox && <Row>
                  <Col xs={10} sm={10} md={5} lg={5}>
                    <Paragraph>Management experience (Years)</Paragraph>
                  </Col>
                  <Col xs={14} sm={14} md={7} lg={7}>
                    <Form.Item name='managementExperience'>
                      <Slider
                        marks={{
                          0: '0',
                          5: '5',
                          10: '10',
                          15: '15',
                          20: '20'
                        }}
                        disabled={ignorePositionValues?.ManagementExperience}
                        min={0}
                        max={20}
                        style={{ marginLeft: '25px', marginTop: '5px' }}
                        className='ant-slider-custom-styles'
                      />
                    </Form.Item>
                  </Col>

                </Row>}

              </div>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br /><br />
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'ManagementExperience')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br />


          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <div className='inner-heading-wrapper'>
                <h5>Engagement terms</h5>
              </div>
              <div>
                <Form.Item name='employmentType'>
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      {employmentOptions ? employmentOptions.map((checkbox, index) => {
                        return (
                          <Col xs={24} sm={24} md={24} lg={24} key={index}>
                            <Checkbox disabled={ignorePositionValues?.EngagementTerms} value={checkbox._id} key={checkbox._id} >
                              {checkbox.name}
                            </Checkbox>
                          </Col>
                        );
                      }) : <div>Loading...</div>}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>


            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br /><br />
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'EngagementTerms')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br />

          {/* <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <div className='inner-heading-wrapper'>
                <h5>Job Search Status</h5>
              </div>
              <div>
                <Form.Item name='jobSearchStatus'>
                  <Radio.Group style={{ width: '100%' }}>
                    <Row>
                      {JobSearchStatus ? JobSearchStatus.map((job, index) => {
                        return (
                          <Col xs={24} sm={24} md={24} lg={24} key={index}>
                            <Radio disabled={ignorePositionValues?.JobSearchStatus} value={job.value} key={job.value} >
                              {job.name}
                            </Radio>
                          </Col>
                        );
                      }) : <div>Loading...</div>}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </div>


            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <br /><br />
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'JobSearchStatus')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br /> */}

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <Row>
                <Col xs={24} sm={24} md={10} lg={10}>
                  <Form.Item name='salary' label="Salary">
                    <InputNumber disabled={ignorePositionValues?.salary} style={{ width: '100%' }} type="number" />
                  </Form.Item>

                </Col>
                <Col xs={0} sm={0} md={2} lg={2}>

                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item name='currency' label="Currency">
                    <Select
                      showSearch
                      allowClear
                      placeholder="Select a Currency"
                      optionFilterProp="children"
                      style={{ width: 250 }}
                      disabled={ignorePositionValues?.salary}
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
              </Row>


            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'salary')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br />
          {/* <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <Row>
                <Col xs={24} sm={24} md={5} lg={5}>
                  <h6>Currency</h6>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <Form.Item name='currency' >
                    <Select
                      showSearch
                      allowClear
                      placeholder="Select a Currency"
                      optionFilterProp="children"
                      style={{ width: 150 }}
                      disabled={ignorePositionValues?.currency}
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
              </Row>


            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'currency')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row> */}
          <br />

          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <h6>Position work hours range</h6>
              {/* <Form.Item name='workingHours'>
                <RangePicker disabled={ignorePositionValues?.WorkingHours} format='HH:mm' />
              </Form.Item> */}
              <Form.Item name='workingTimeFlexibility'>
                <Radio.Group >
                  <Radio value='very-flexible' disabled={ignorePositionValues?.WorkingHours}>Very flexible - No overlapping work hours are required</Radio><br />
                  <Radio value='somewhat-flexible' disabled={ignorePositionValues?.WorkingHours}>Somewhat flexible - at least 2 overlapping work hours</Radio><br />
                  <Radio value='flexible' disabled={ignorePositionValues?.WorkingHours}>Flexible - at least 4 overlapping work hours</Radio><br />
                  <Radio value='not-flexible' disabled={ignorePositionValues?.WorkingHours}>Not flexible - at least 6 overlapping work hours</Radio><br />
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'WorkingHours')}>
                All Ignore
                </Checkbox>
            </Col>

          </Row>
          <br />
          <Row>
            <Col xs={24} sm={24} md={14} lg={14}>
              <TagInput
                title='Role Features'
                inputTitle='Selected role features'
                tags={appConfigRoles && appConfigRoles}
                selectedTags={selectedRoles}
                parentHandleTagChange={handlePositionRoleFeaturesTagChange}
                tagParentKey={roleFeaturesKey}
                setFunction={setSelectedSortedRoles}
                inputValues={selectedSortedRoles} />
            </Col>
            <Col xs={0} sm={0} md={3} lg={3}></Col>
            <Col xs={24} sm={24} md={7} lg={7}>
              <Checkbox onChange={(e) => handleIgnorePositionChange(e, 'RoleFeatures')}>
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

export default PositionDetailPanel
