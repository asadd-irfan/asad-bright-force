import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, Select, InputNumber, Checkbox } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAllCompanies } from '../../../../../actions/company'
import { makeQueryParamterString } from '../../../../../common/commonMethods'
import '../companies.scss'
const { Panel } = Collapse;
const { Option } = Select;

function CompaniesAllFilter() {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.company.btnLoading);
  const [form] = Form.useForm();


  const companySizesOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['company-size']
  );
  const indPrefOptions = useSelector(state =>
    state.auth.appConfigs && state.auth.appConfigs['industry-preference']
  );
  const allAdmins = useSelector(state => state.talentManager.allAdmins);

  const handleSubmit = values => {
    let paramsDictionary = {
      companyId: values.companyId,
      name: values.name,
      industries: values.industries,
      size: values.size,
      country: values.country,
      accountManager: values.accountManager,
      unAssignManager: values.unAssignManager === true ? values.unAssignManager : null,
    }
    let params = makeQueryParamterString(paramsDictionary);
    console.log('params', params)

    dispatch(getAllCompanies(params));
  };

  const resetAllData = e => {
    form.resetFields();
    dispatch(getAllCompanies(''));
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="(Companies All) Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="ID:" name='companyId'>
                  <InputNumber type="number" placeholder="input ID" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1}>
              </Col>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Name:" name='name'>
                  <Input style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Country:" name='country'>
                  <Input style={{ width: 300 }} />
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Industry:" name='industries'>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select company Industry"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {indPrefOptions && indPrefOptions.map((ind, index) => {
                      return <Option key={index} value={ind._id}>{ind.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={6} lg={6}>
                <Form.Item label="Size:" name='size'>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 300 }}
                    placeholder="Select company Size"
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
              </Col>
            </Row>
            <Row className="mb-5 mt-3">
              <Col xs={11} sm={11} md={5} lg={5}>
                <Form.Item label="No. Open Positions:" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber type="number" defaultValue={0} />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber type="number" defaultValue={999} />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} />
              <Col xs={11} sm={11} md={5} lg={5}>
                <Form.Item label="No. Closed Positions:" >

                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Min</b>
                      <InputNumber type="number" defaultValue={0} />
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10}>
                      <b>Max</b>
                      <InputNumber type="number" defaultValue={999} />
                    </Col>
                  </Row>
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

export default CompaniesAllFilter;
