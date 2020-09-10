import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteFilled } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { CONFIGS_PAGE_LIMIT } from '../../../../common/constants'
import TableComponent from '../../../Common/TableComponent'
import { deleteAppConfig, editAppConfig } from '../../../../actions/settings'
import { Button, Form, Row, Col, Modal, Input, Select, InputNumber, Checkbox } from "antd";
import axios from 'axios';

const { Option } = Select;

function SettingsAllTable() {
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteConfigId, setDeleteConfigId] = useState(null)
  const [selectedConfigType, setSelectedConfigType] = useState(null)
  const [form] = Form.useForm();

  const dispatch = useDispatch()
  const history = useHistory();
  const [current, setCurrent] = useState(1);
  const [isBelongToConfigs, setIsBelongToConfigs] = useState([])
  const [showExtra, setShowExtra] = useState(false)
  const [checked, setChecked] = useState(false)
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const roleOptions = appConfigs && appConfigs['roles']

  const filterAppConfigs = useSelector(state => state.settings.filterAppConfigs);
  let pageSize = CONFIGS_PAGE_LIMIT;

  const [editConfigObj, setEditConfigObj] = useState(null)

  const [configModal, setConfigModal] = useState(false)
  const appConfigKeys = useSelector(state => state.settings.appConfigKeys);

  // const history = useHistory();
  async function fetchConfigData(id) {
    const res = await axios.get('/api/admin/app-configs/' + id);
    if (res?.data?.result) {
      console.log('res?.data?.result', res?.data?.result)

      return res?.data?.result.type;
    }
  }

  const openConfigModal = async (obj) => {
    setEditConfigObj(obj);
    // console.log('obj',obj);
    let type;
    if (obj.isBelongTo !== null) {
      setShowExtra(true);
      setChecked(true)
      // type = await fetchConfigData(obj.isBelongTo);
      // await fetchData(type);

    } else {
      setShowExtra(false);
      setChecked(false)
    }

    // console.log('type', type)

    form.setFieldsValue({
      name: obj.name,
      type: obj.type,
      weight: obj.weight,
      isBelongToName: obj.isBelongTo,
      // isBelongToType: type ? type : null,
    });

    setConfigModal(true);
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
        "type": values.type,
        "isBelongTo": null

      };
      if (values.weight) {
        obj = {
          ...obj,
          weight: values.weight,
        }
      }
    }
    // console.log('obj', obj)

    let configId = editConfigObj.key;

    dispatch(editAppConfig(obj, configId, values.type)).then(() => {
      setConfigModal(false);
      form.resetFields();

    });

  };

  const handleConfigModalCancel = e => {
    setConfigModal(false);
  };


  const openDeleteModal = (id, type) => {
    setDeleteConfigId(id);
    setSelectedConfigType(type);
    setDeleteModal(true);
  }

  const handleDeleteModalOk = e => {
    dispatch(deleteAppConfig(deleteConfigId, selectedConfigType)).then(() => {
      setDeleteModal(false);
    });

  };

  const handleDeleteModalCancel = e => {
    setDeleteModal(false);
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      sorter: (a, b) => a.weight.length - b.weight.length,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => {
        return (
          <>
            {<EditOutlined style={{ fontSize: '20px', margin: '5px', color: 'blue' }}
              onClick={() => openConfigModal(record)}
            />}
            {<DeleteFilled style={{ fontSize: '20px', margin: '5px', color: 'red' }}
              onClick={() => openDeleteModal(record.key, record.type)}
            />}
          </>
        )
      }
    },
  ];

  const data = filterAppConfigs && filterAppConfigs.map((config) => {
    return {
      key: config._id ? config._id : '',
      name: config.name ? config.name : '',
      type: config.type ? config.type : '',
      weight: config.weight ? config.weight : '',
      isBelongTo: config.isBelongTo ? config.isBelongTo : null,

    }
  })
  async function fetchData(type) {
    const res = await axios.get('/api/admin/configs?type=' + type);

    if (res?.data?.result) {
      setIsBelongToConfigs(res?.data?.result)
    }
  }

  function handleChange(value) {
    // console.log(value);
    fetchData(value);

  }
  function onChange(e) {
    if (e.target.checked) {
      setShowExtra(true);
      setChecked(true)
    } else {
      setShowExtra(false);
      setChecked(false);
    }

  }

  return (
    <React.Fragment>
      <TableComponent
        columns={columns}
        data={data}
        currentPage={current}
        // onChangePage={getPageData}
        pageSize={pageSize}
      />
      <Modal
        title="Delete App Config"
        visible={deleteModal}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
      >
        <h6>Are you sure you want to delete this App Config???</h6>
      </Modal>

      <Modal className="lg-modal"
        title="Edit App Config"
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
                <Checkbox onChange={onChange} checked={checked}></Checkbox>
              </Col>
              {showExtra && <><Col xs={22} sm={22} md={22} lg={22}>
                <Form.Item label="Role Type" name='isBelongToName'>
                  <Select
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select Role Type "
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
                    Edit
                </Button>
                </Form.Item>
              </Col>
            </Row>


          </Form>

          <Col xs={2} sm={2} md={4} lg={4} />

        </Row>
      </Modal>


    </React.Fragment>
  )
}

export default SettingsAllTable;
