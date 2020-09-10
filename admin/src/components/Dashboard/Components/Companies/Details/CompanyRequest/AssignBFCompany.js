import React, { useState, useEffect } from 'react';
import { Row, Form, Col, Card, Input, Button, Modal } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import '../../companies.scss'
import AssignTable from './AssignTable';
import { addCompany, assignCompanyToUser, getAllCompanies } from '../../../../../../actions/company'

function AssignBFCompany({ selectedCompanyRequest }) {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [companyModalVisible, setCompanyModalVisible] = useState(false)
  const [searchedCompanyName, setSearchedCompanyName] = useState('')
  const [companyExists, setCompanyExists] = useState(false)
  const allCompanies = useSelector(state => state.company.allCompanies);
  const selectedCompanyForAssign = useSelector(state => state.company.selectedCompanyForAssign);
  const btnLoading = useSelector(state => state.company.btnLoading)

  useEffect(() => {
    if (selectedCompanyRequest !== null) {
      allCompanies && allCompanies.map(company => {
        if (company.name === selectedCompanyRequest.companyName) {
          setCompanyExists(true)
        }
      })
    }

  }, [allCompanies])
  const showCompanyModal = () => {
    setCompanyModalVisible(true);
  };

  const handleCompanyModalOk = e => {
    let obj = {
      companyName: selectedCompanyRequest && selectedCompanyRequest.companyName
    }
    dispatch(addCompany(obj));
    setCompanyModalVisible(false);
  };

  const handleCompanyModalCancel = e => {
    setCompanyModalVisible(false);
  };

  const assignCompany = e => {
    let id = selectedCompanyRequest && selectedCompanyRequest._id
    let obj = {
      companyId: selectedCompanyForAssign && selectedCompanyForAssign.key
    }
    dispatch(assignCompanyToUser(obj, id));
  };
  const searchCompanyByName = e => {
    let params = '?';
    if (searchedCompanyName === '' || searchedCompanyName === null || searchedCompanyName === undefined) {
      params = '?';
    }
    else {
      params = `?name=${searchedCompanyName}`;
    }
    dispatch(getAllCompanies(params));
  };


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <div style={{ marginRight: '10px' }}>
      <Card bordered={false} style={{ border: '2px solid', borderRadius: '5px' }}>
        <Form
          {...layout}
          labelAlign={'left'}
          form={form}
        >
          <Row style={{ marginBottom: '10px' }}>
            <Col xs={2} sm={2} md={2} lg={2}
              style={{
                alignSelf: 'center',
              }}
            >
              <div className='circle'>{1}</div>
            </Col>
            <Col xs={22} sm={22} md={22} lg={22}>
              <h4>Assign to a Bright force Company</h4>
            </Col>
          </Row>
          <hr style={{ border: '1px solid', marginBottom: '10px' }} />
          <Row>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14}>
              <Form.Item label="Company Name:">
                <Input value={searchedCompanyName} onChange={(e) => setSearchedCompanyName(e.target.value)} />
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2}>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Button type='default' loading={btnLoading} onClick={searchCompanyByName}>Search</Button>
            </Col>
          </Row>
          <div style={{ marginBottom: '50px' }}>
            <AssignTable />
          </div>
          <div className='text-center' style={{ marginBottom: '50px' }}>
            <Button type='primary' disabled={selectedCompanyForAssign !== null ? false : true} loading={btnLoading} onClick={assignCompany}>Assign to Selected</Button>
          </div>
          <div className='text-center'>
            <p><strong>If no company exists, go ahead and create one </strong></p>
            <Button type='primary' disabled={companyExists} loading={btnLoading} onClick={showCompanyModal}>Add this Company</Button>
          </div>
        </Form>
      </Card>
      <Modal
        title="Create a new Company"
        visible={companyModalVisible}
        onOk={handleCompanyModalOk}
        onCancel={handleCompanyModalCancel}
      >
        <p>Are you sure to Create this company</p>
            Company Name : {selectedCompanyRequest && selectedCompanyRequest.companyName} <br />
            Company Website : {selectedCompanyRequest && selectedCompanyRequest.companyWebsite}
      </Modal>
    </div>
  )
}

export default AssignBFCompany;
