import React, { useState, useEffect } from 'react';
import { Collapse, Row, Form, Input, Col, Button, Select } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { filterAppConfigs } from '../../../../actions/settings'
import { makeQueryParamterString } from '../../../../common/commonMethods'
import { loadAppConfigs } from '../../../../actions/auth';
import { SET_APP_CONFIG_KEYS } from '../../../../actions/types';

const { Panel } = Collapse;
const { Option } = Select;

function SettingsAllFilter() {
  const dispatch = useDispatch();
  // const btnLoading = useSelector(state => state.talentManager.btnLoading);
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const [filterConfigs, setFilterConfigs] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(loadAppConfigs());

  },[]) 
  useEffect(() => {
    if (appConfigs) {
      let keys = Object.keys(appConfigs)
      keys = keys.filter((element) => {
        if (element !== 'coefficient') {
          return element;
        }
      })
      setFilterConfigs(keys)
      dispatch({
        type: SET_APP_CONFIG_KEYS,
        payload: keys
    });

    }

    
  },[appConfigs]) 


  const handleSubmit = values => {
    let paramsDictionary = {};
    if (values.name) {
      paramsDictionary = {
        name: values.name,
        type: values.type,
      }  
    } else {
      paramsDictionary = {
        type: values.type,
      }
    }
    let params = makeQueryParamterString(paramsDictionary);

    dispatch(filterAppConfigs(params));

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
        <Panel header="Search Panel" key="1">
          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
            <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Config Type:" name='type' rules={
                  [
                    {
                      required: true,
                      message: 'Please Select config type'
                    }
                  ]
                }>
                  {/* <Input placeholder="input email" /> */}
                  <Select
												allowClear
												style={{ width: 300 }}
												placeholder="Select Config Type"
											>
												{filterConfigs && filterConfigs.map((title, index) => {
													return <Option key={index} value={title}>{title}</Option>
												})}
											</Select> 
                </Form.Item>
              </Col>

              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7}>
                <Form.Item label="Config Name:" name='name'>
                  <Input placeholder="input config name" />
                </Form.Item>
              </Col>

              <Col xs={0} sm={0} md={1} lg={1}>
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
                    // loading={btnLoading}
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

export default SettingsAllFilter;
