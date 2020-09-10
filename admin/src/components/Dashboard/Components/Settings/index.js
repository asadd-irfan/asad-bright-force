import React, { useState, useEffect } from 'react';
import SettingsTable from './SettingsTable';
import SettingsFilter from './SettingsFilter';
import { Button, Form, Row, Col, Modal, Input, Select, InputNumber, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux'
import { addAppConfigs } from '../../../../actions/settings'
// import { useHistory } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

function Settings() {
  const [configModal, setConfigModal] = useState(false)
  const [isBelongToConfigs, setIsBelongToConfigs] = useState([])
  const [showExtra, setShowExtra] = useState(false)
  const [form] = Form.useForm();
  const appConfigKeys = useSelector(state => state.settings.appConfigKeys);
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const roleOptions = appConfigs && appConfigs['roles']

  // console.log('roleOptions', roleOptions)
  // const history = useHistory();
  const dispatch = useDispatch();

  const openConfigModal = () => {
    setConfigModal(true);
  }

  async function fetchData(type) {
    const res = await axios.get('/api/admin/configs?type=' + type);

    if (res?.data?.result) {
      setIsBelongToConfigs(res?.data?.result)
    }
  }

  const handleSubmit = values => {
    let obj = {};
    if (showExtra) {
      obj = {
        "name": values.name,
        "type": values.type,
        "isBelongTo": values.isBelongToName
      };
      if (values.weight) {
        obj = {
          ...obj,
          weight: values.weight,
        }
      }
    } else {
      obj = {
        "name": values.name,
        "type": values.type
      };
      if (values.weight) {
        obj = {
          ...obj,
          weight: values.weight,
        }
      }
    }
    // console.log('obj', obj)
    dispatch(addAppConfigs(obj, values.type)).then(() => {
      setConfigModal(false);
      form.resetFields();

    });

  };

  const handleConfigModalCancel = e => {
    setConfigModal(false);
  };
  function handleChange(value) {
    // console.log(value);
    fetchData(value);

  }
  function onChange(e) {
    if (e.target.checked) {
      setShowExtra(true);
    } else {
      setShowExtra(false);
    }

  }
  // console.log('isBelongToConfigs',isBelongToConfigs)
  return (
    <div>
      <div style={{ padding: '25px 15px', textAlign: 'center' }}>
        <h1>CONFIG SETTINGS</h1>
      </div>
      <div style={{ padding: '25px 15px' }}>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => openConfigModal()}>
          Add App Config</Button>
      </div>
      <div style={{ padding: '25px 15px' }}>
        <SettingsFilter />
        <SettingsTable />
      </div>

      <Modal className="lg-modal"
        title="Add App Config"
        visible={configModal}
        footer={null}
        onCancel={handleConfigModalCancel}

      >
        <Row>

          <Col xs={2} sm={2} md={4} lg={4} />

          <Form
            layout={'vertical'}
            form={form}
            onFinish={handleSubmit}
          >
            <Row>
              <Col xs={22} sm={22} md={22} lg={22}>
                <Form.Item label="Config Name:" name='name' rules={
                  [
                    {
                      required: true,
                      message: 'Please input config name'
                    }
                  ]
                }>
                  <Input placeholder="input config name" />
                </Form.Item>
              </Col>

              <Col xs={22} sm={22} md={22} lg={22}>
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
                    style={{ width: '100%' }}
                    placeholder="Select Config Type"

                  >
                    {appConfigKeys && appConfigKeys.map((title, index) => {
                      return <Option key={index} value={title}>{title}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={22} sm={22} md={22} lg={22}>
                <Form.Item label="Config Weight:" name='weight'>
                  <InputNumber style={{ width: '100%' }} type="number" />
                </Form.Item>
              </Col>
              <Col xs={20} sm={20} md={20} lg={20}>

                <h5>Is Belong To: </h5>
              </Col>
              <Col xs={4} sm={4} md={4} lg={4}>
                <Checkbox onChange={onChange}></Checkbox>
              </Col>
              {showExtra && <><Col xs={22} sm={22} md={22} lg={22}>
                <Form.Item label="Role Type" name='isBelongToName'>
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select role Type "
                    onChange={handleChange}
                  >
                    {roleOptions && roleOptions.map((role, index) => {
                      return <Option key={index} value={role._id}>{role.name}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Col>
                {/* <Col xs={22} sm={22} md={22} lg={22}>
                  <Form.Item label="Name" name='isBelongToName'>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                    // placeholder="Select Config Type"
                    >
                      {isBelongToConfigs && isBelongToConfigs.map((element, index) => {
                        return <Option key={index} value={element._id}>{element.name}</Option>
                      })}
                    </Select>
                  </Form.Item>
                </Col> */}
              </>}
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6}>
                <Button
                  type="primary"
                  block
                  style={{ float: "right" }}
                  onClick={handleConfigModalCancel}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1}>
              </Col>
              <Col xs={6} sm={6} md={5} lg={5}>
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    htmlType="submit"
                  >
                    Add
                </Button>
                </Form.Item>
              </Col>
            </Row>


          </Form>

          <Col xs={2} sm={2} md={4} lg={4} />

        </Row>
      </Modal>

    </div>
  )
}

export default Settings;
