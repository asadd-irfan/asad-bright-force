import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, DatePicker } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAllCompanyRequests } from '../../../../../actions/company'
import { makeQueryParamterString } from '../../../../../common/commonMethods'
import moment from 'moment'
import '../companies.scss'

const { Panel } = Collapse;
const { RangePicker } = DatePicker;

function CompanyRequestsFilter() {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.company.btnLoading);
  const [form] = Form.useForm();
  
  const handleSubmit = values => {    
    let paramsDictionary = {
      email: values.email,
      phone: values.phone,
    }
    let params = makeQueryParamterString(paramsDictionary);

    if (values.date !== null && values.date !== undefined && values.date !== '') {
      const fromDate = moment(values.date[0]).format('YYYY-MM-DD');
      const toDate = moment(values.date[1]).format('YYYY-MM-DD');
      params += `&createdAt[gte]=${fromDate}&createdAt[lte]=${toDate}`
    }
    dispatch(getAllCompanyRequests(params));
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
        <Panel header="(Company Requests) Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Email:" name='email' rules={
                  [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    }
                  ]
                }>
                  <Input placeholder="input email" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>
                <Form.Item label="Phone:" name='phone'>
                  <Input type='number' placeholder="input phone" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Date:" name='date'>
                  <RangePicker />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} />
              <Col xs={24} sm={24} md={8} lg={8} />
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

export default CompanyRequestsFilter;
