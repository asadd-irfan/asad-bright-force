import React from 'react';
import { Collapse, Row, Form, Input, Col, Button, Select, DatePicker, InputNumber } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getAllCompaniesPositions, getTalentPositions } from '../../../../../actions/positions'
import { makeQueryParamterString } from '../../../../../common/commonMethods'
import moment from 'moment'
import '../positions.scss'
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;


function TalentPositionsFilters() {
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
    let obj = {
      'email': values.email
    }
    dispatch(getTalentPositions(obj));
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
        <Panel header="(Talent Positions) Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            {/* <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Name:" name='name'>
                  <Input placeholder="Enter talent name" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8}>

              </Col>
            </Row>
             */}
            <Row>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Email:" name='email'>
                  <Input placeholder="Enter talent email" />
                </Form.Item>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                
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

export default TalentPositionsFilters;
