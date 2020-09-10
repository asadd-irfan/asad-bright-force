import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, Select, InputNumber, DatePicker } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getTalents, getAllTalentsCount, getTalentsData } from '../../../../actions/talent'
import './talents.scss'
const { Panel } = Collapse;
const { Option } = Select;

function TalentFilters() {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.talents.btnLoading);
  const [form] = Form.useForm();
  const appConfigRoles = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs.roles
      ? state.auth.appConfigs.roles
      : null
  );
  const appConfigPreferredRoles = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['preferred-role']
      ? state.auth.appConfigs['preferred-role']
      : null
  );
  const allTalentsCount = useSelector(state => state.talents.allTalentsCount);

  const handleSubmit = values => {
    let obj = {
      "talentId": values.talentId,
      "name": values.name,
      // "email":  values.email,
      // "phone": values.phone,
      "role": values['role'],
      "availabilityStatus": values.availabilityStatus,
      // "city": values['location.city'],
      "country": values['location.country'],
      "mainRole": values['preferredRoles.mainRole.name'],
      "secondaryRole": values['preferredRoles.secondaryRole.name'],
    }
    console.log('obj', obj)
    dispatch(getTalents(obj));

  };

  const resetAllData = e => {
    form.resetFields();
    dispatch(getAllTalentsCount());
    dispatch(getTalentsData(''));
  };
  const fromDateChange = (date, dateString) => {
    console.log('date', date);
    console.log('dateString', dateString);
  };
  const toDateChange = (date, dateString) => {
    console.log('date', date);
    console.log('dateString', dateString);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="ID:" name='talentId'>
                  <InputNumber type="number" placeholder="input ID" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1}>
              </Col>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Name:" name='name'>
                  <Input placeholder="input name" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Country:" name='location.country'>
                  <Input placeholder="input country" style={{ width: 300 }} />
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Status:" name='availabilityStatus'>
                  <Select
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select Availability Status "
                  >
                    <Option value="inactive">Inactive</Option>
                    <Option value="live">Live</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1}>
              </Col>
              <Col xs={12} sm={12} md={9} lg={9}>
                <Form.Item label="Status Changed Between:" name='statusChangedBetween'>

                  <Row>
                    <Col xs={10} sm={10} md={9} lg={9}>
                      <DatePicker placeholder="Select from date" onChange={fromDateChange} style={{ width: 170 }} />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}><b style={{ fontSize: '22px' }}> - </b>
                    </Col>

                    <Col xs={10} sm={10} md={9} lg={9}>
                      <DatePicker placeholder="Select to date" onChange={toDateChange} style={{ width: 170 }} />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Type:" name="role">
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select a preferred Role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {appConfigRoles && appConfigRoles.map((role, index) => {
                      return <Option key={index} value={role._id}>{role.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1}>
              </Col>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Main Role:" name="preferredRoles.mainRole.name">
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select a main Role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {appConfigPreferredRoles && appConfigPreferredRoles.map((role, index) => {
                      return <Option key={index} value={role._id}>{role.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={1} sm={1} md={1} lg={1}>
              </Col>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Secondary Role:" name="preferredRoles.secondaryRole.name">
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select a secondary Role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {appConfigPreferredRoles && appConfigPreferredRoles.map((role, index) => {
                      return <Option key={index} value={role._id}>{role.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            <Row className="mb-5 mt-3">
              <Col xs={7} sm={7} md={5} lg={5}>
                <Form.Item label="No. Positions sent:" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber type="number" defaultValue={0} />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber defaultValue={999} type="number" />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={7} sm={7} md={5} lg={5}>
                <Form.Item label="No. Applications:" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber defaultValue={0} type="number" />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber defaultValue={999} type="number" />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={7} sm={7} md={5} lg={5}>
                <Form.Item label="No. Interviews" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber defaultValue={0} type="number" />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber defaultValue={999} type="number" />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={7} sm={7} md={5} lg={5}>
                <Form.Item label="No. Interviews Passed" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber defaultValue={0} type="number" />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber defaultValue={999} type="number" />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={7} sm={7} md={5} lg={5}>
                <Form.Item label="No. Hires" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber defaultValue={0} type="number" />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber defaultValue={999} type="number" />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>

            </Row>

            <Row>
              <Col xs={12} sm={12} md={19} lg={19}>
              </Col>
              <Col xs={6} sm={6} md={2} lg={2}>
                <Button
                  type="primary"
                  block
                  style={{ float: "right" }}
                  onClick={resetAllData}
                >
                  Reset
                </Button>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={6} sm={6} md={2} lg={2}>
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    loading={btnLoading}
                    htmlType="submit"
                  >
                    Filter
                </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <b>Number of Records: {allTalentsCount}</b>
            </Row>

          </Form>

        </Panel>
      </Collapse>
    </div>
  )
}

export default TalentFilters;
