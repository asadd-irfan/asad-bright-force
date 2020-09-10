import React, { useEffect } from 'react';
import { Row, Form, Col, Button, Select, Card } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment';
import { assignManagerToRequest } from '../../../../../../actions/talentManager'
import { MOMENT_DATE_FORMAT } from '../../../../../../common/constants'
import '../../companies.scss'
const { Option } = Select;

function MainInfo({ selectedCompanyRequest }) {
  const dispatch = useDispatch();
  const btnLoading = useSelector(state => state.company.btnLoading);
  const allAdmins = useSelector(state => state.talentManager.allAdmins);
  const [form] = Form.useForm();

  const handleSubmit = values => {
    let id = selectedCompanyRequest && selectedCompanyRequest._id
    let obj = {
      accountManagerId: values.accountManager
    }
    dispatch(assignManagerToRequest(obj, id));
  };

  useEffect(() => {
    let matchedAccountManager = []
    if (selectedCompanyRequest) {
      matchedAccountManager = allAdmins && allAdmins.map(item => {
        if (selectedCompanyRequest.accountManager) {
          if (item._id === selectedCompanyRequest.accountManager) {
            return item
          }
        }
      });
    }
    let updatedAccountManager = matchedAccountManager && matchedAccountManager.filter(Boolean);
    form.setFieldsValue({
      accountManager: updatedAccountManager && updatedAccountManager[0] && updatedAccountManager[0].name,
    });
  }, [selectedCompanyRequest])


  // const resetAllData = e => {
  //   form.resetFields();
  // };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <div style={{ marginBottom: '10px' }}>
      <Card bordered={false} style={{ border: '2px solid', borderRadius: '5px' }}>
        <Form
          {...layout}
          labelAlign={'left'}
          form={form}
          onFinish={handleSubmit}
        >
          <div className='text-center' style={{ marginBottom: '50px', marginTop: '50px' }}>
            <h2>Company Request</h2>
          </div>
          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item label="Status:">
                <span className={
                  selectedCompanyRequest && selectedCompanyRequest.status === 'pending' ? 'status-pending status-wrapper'
                    : selectedCompanyRequest && selectedCompanyRequest.status === 'handled' ? 'status-handled status-wrapper'
                      : selectedCompanyRequest && selectedCompanyRequest.status === 'closed' ? 'status-closed status-wrapper'
                        : selectedCompanyRequest && selectedCompanyRequest.status === 'denied' ? 'status-denied status-wrapper'
                          : ''
                }>
                  {selectedCompanyRequest && selectedCompanyRequest.status}
                </span>
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              {selectedCompanyRequest && selectedCompanyRequest.status !== 'pending' &&
                <Form.Item label="Account Manager:" name='accountManager'>
                  <Select
                    showSearch
                    allowClear
                    style={{ width: 200 }}
                    placeholder="Select a Account Manager"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {allAdmins && allAdmins.map((manager, index) => {
                      return <Option key={index} value={manager._id}>{manager.name}</Option>
                    })}
                  </Select>
                </Form.Item>}
            </Col>
          </Row>

          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item label="Request Date:">
                {moment(selectedCompanyRequest && selectedCompanyRequest.createdAt).format(MOMENT_DATE_FORMAT)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item label="Last Modified:">
                {moment(selectedCompanyRequest && selectedCompanyRequest.updatedAt).format(MOMENT_DATE_FORMAT)}
              </Form.Item>
            </Col>
          </Row>
          <Row>

            <Col xs={0} sm={0} md={22} lg={22}>
            </Col>
            <Col xs={6} sm={6} md={2} lg={2}>
              {selectedCompanyRequest && selectedCompanyRequest.status !== 'pending' &&
                <Form.Item>
                  <Button
                    type="primary"
                    block
                    style={{ float: "right" }}
                    loading={btnLoading}
                    htmlType="submit"
                  >
                    Save
                </Button>
                </Form.Item>}
            </Col>
          </Row>

        </Form>
      </Card>
    </div>
  )
}

export default MainInfo;
