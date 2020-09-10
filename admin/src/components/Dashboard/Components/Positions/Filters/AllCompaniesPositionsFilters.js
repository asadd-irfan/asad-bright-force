import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, Select, DatePicker, InputNumber, Checkbox } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAllCompaniesPositions } from '../../../../../actions/positions'
import { makeQueryParamterString } from '../../../../../common/commonMethods'
import moment from 'moment'
import '../positions.scss'
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;


function AllCompaniesPositionsFilters() {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.positions.btnLoading);
  const allCompanies = useSelector(state => state.company.allCompanies);
  const allAdmins = useSelector(state => state.talentManager.allAdmins);
  const [form] = Form.useForm();

  const rolesOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['preferred-role']
  );
  const typeOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['roles']
  );

  const handleSubmit = values => {

    let paramsDictionary = {
      title: values.title,
      positionId: values.positionId,
      companyId: values.companyId,
      name: values.type,
      'roles': values.role,
      "assignedAccountManager": values.accountManager,
    }
    if (values.unAssignManager !== false) {
      paramsDictionary = {
        ...paramsDictionary,
        "unAssignManager": values.unAssignManager
      }
    }
    let params = makeQueryParamterString(paramsDictionary);
    if (values.date !== null && values.date !== undefined && values.date !== '') {
      const fromDate = moment(values.date[0]).format('YYYY-MM-DD');
      const toDate = moment(values.date[1]).format('YYYY-MM-DD');
      params += `&createdAt[gte]=${fromDate}&createdAt[lte]=${toDate}`
    }
    console.log('params', params)
    dispatch(getAllCompaniesPositions(params));

  };

  const resetAllData = e => {
    form.resetFields();
    dispatch(getAllCompaniesPositions(''));
  };


  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="(Companies Positions) Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Position ID:" name='positionId'>
                  <InputNumber type="number" placeholder="input ID" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Position Title:" name='title'>
                  <Input placeholder="input title" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Company Name:" name='companyId'>
                  {/* <Input placeholder="input company name" /> */}
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select Company"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {allCompanies && allCompanies.map((company, index) => {
                      return <Option key={index} value={company._id}>{company.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Type:" name='type'>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select Type"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {typeOptions && typeOptions.map((type, index) => {
                      return <Option key={index} value={type._id}>{type.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />

              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Role:" name='role'>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select a role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {rolesOptions && rolesOptions.map((ind, index) => {
                      return <Option key={index} value={ind._id}>{ind.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Number of Groups(batches):" >

                  <Row>
                    <Col xs={10} sm={10} md={8} lg={8}>
                      {/* <b>Min</b> */}
                      <InputNumber type="number" />
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={1} />
                    <Col xs={2} sm={2} md={2} lg={2}>
                      <b style={{ fontSize: 18 }}> - </b>
                    </Col>
                    <Col xs={1} sm={1} md={1} lg={1} />

                    <Col xs={10} sm={10} md={8} lg={8}>
                      {/* <b>Max</b> */}
                      <InputNumber type="number" />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Date:" name='date'>
                  <RangePicker style={{ width: 320 }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Account Manager:" name='accountManager'>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 306 }}
                    placeholder="Select Account Manager"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {allAdmins && allAdmins.map((type, index) => {
                      return <Option key={index} value={type._id}>{type.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={6} lg={6} style={{ marginTop: '40px' }}>
                <Form.Item name="unAssignManager" valuePropName="checked" >
                  <Checkbox>Unassigned Account Manager</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            {/* <p>Number of Groups(batches)</p> */}


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

          </Form>

        </Panel>
      </Collapse>
    </div>
  )
}

export default AllCompaniesPositionsFilters;
