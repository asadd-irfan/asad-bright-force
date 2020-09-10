import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, DatePicker, InputNumber } from 'antd';
import { useSelector } from "react-redux";

import '../companies.scss'
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

function CompanySuggestionsFilter() {
  const btnLoading = useSelector(state => state.talents.btnLoading);
  const [form] = Form.useForm();


  const handleSubmit = values => {

  };

  const resetAllData = e => {
    form.resetFields();
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="(Company Suggestions) Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Talent Id:" name='talentId'>
                  <InputNumber placeholder="input Id" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Talent Name:" name='talentName'>
                  <Input placeholder="input name" style={{ width: 300 }} />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>

              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Date:" name='date'>
                  <RangePicker />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>

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

export default CompanySuggestionsFilter;
