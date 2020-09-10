import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, Select } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAllAccountsManager } from '../../../../../actions/talentManager'
import { makeQueryParamterString } from '../../../../../common/commonMethods'

const { Panel } = Collapse;
const { Option } = Select;

function CompaniesAllFilter() {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.talentManager.btnLoading);
  const [form] = Form.useForm();
  

  const handleSubmit = values => {
    let paramsDictionary = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      country: values.country
    }
    let params = makeQueryParamterString(paramsDictionary);
    dispatch(getAllAccountsManager(params));

  };

  const resetAllData = e => {
    form.resetFields();
    dispatch(getAllAccountsManager(''));

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
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Name:" name='name'>
                  <Input placeholder="input name" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Email:" name='email'>
                  <Input placeholder="input email" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>
                <Form.Item label="Phone:" name='phone'>
                  <Input placeholder="input phone" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="City:" name='city'>
                  <Input placeholder="input city" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Country:" name='country'>
                  <Input placeholder="input country" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={9} lg={9}>

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
