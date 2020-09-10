import React, { useEffect } from 'react';
import { Row, Form, Col, Button, Select, Card } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment';
import '../../companies.scss'
import { assignManagerToCompany } from '../../../../../../actions/talentManager'
import { MOMENT_DATE_FORMAT } from "../../../../../../common/constants";

const { Option } = Select;

function InternalRecords({ selectedCompany }) {
  const dispatch = useDispatch();
  const allAdmins = useSelector(state => state.talentManager.allAdmins);
  const openPositions = useSelector(state => state.company.openPositions);
  const btnLoading = useSelector(state => state.company.btnLoading);
  const [form] = Form.useForm();

  const handleSubmit = values => {
    let id = selectedCompany && selectedCompany._id
    let obj = {
      accountManagerId: values.accountManager
    }
    dispatch(assignManagerToCompany(obj, id));
  };

  useEffect(() => {

    form.setFieldsValue({
      accountManager: selectedCompany?.accountManager?._id,
    });
  }, [selectedCompany])


  const layout = {
    labelCol: { span: 6 },
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
            <h2>Internal Records - {selectedCompany?.name}</h2>
          </div>
          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Form.Item label="Membership Date: ">
                <span className="mx-3">{moment(selectedCompany?.registrationDate).format(MOMENT_DATE_FORMAT)}</span>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Form.Item label="Company Name:">
                <span className="mx-3">{selectedCompany?.name}</span>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Form.Item label="Account Manager:" name='accountManager'>
                <Select
                  showSearch
                  allowClear
                  style={{ width: 300 }}
                  placeholder="Select an Account Manager"
                  optionFilterProp="children"
                  // defaultValue={selectedCompany?.accountManager?._id}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {allAdmins && allAdmins.map((manager, index) => {
                    // console.log(manager)
                    return <Option key={index} value={manager._id}>{manager.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11}>
              <Form.Item label="Company Website:">
                <span className="mx-3">{selectedCompany?.website}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16}>
              <Form.Item label="Open Positions:">
                {openPositions}
              </Form.Item>
            </Col>
          </Row>

          <Row>

            <Col xs={0} sm={0} md={22} lg={22}>
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
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Card>
    </div>
  )
}

export default InternalRecords;
