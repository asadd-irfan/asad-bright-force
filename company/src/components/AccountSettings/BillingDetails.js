import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Form, Row, Col, Select, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { changeBillingData, changeBillingUser } from '../../actions/company';
import { setCurrentSettingSNavbarButton } from '../../actions/common';
import { onFinishFailed } from "../../common/commonMethods";
import '../../App.scss'
import SearchBar from '../PlacesAutoComplete/SearchBar'

const { Option } = Select;

const BillingDetails = () => {
  const [form] = Form.useForm();
  const companyDetails = useSelector(state => state.company.companyDetails);
  const companyUsers = useSelector(state => state.company.companyUsers);
  const currentUser = useSelector(state => state.auth.user);
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [selectedBillingUserId, setSelectedBillingUserId] = useState(null);
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const dispatch = useDispatch()
  const [location, setLocation] = useState("");
  console.log('isModerator', isModerator)
  useEffect(() => {
    if (currentUser && currentUser.role === 'moderator') {
      setIsModerator(true);
    }
    dispatch(setCurrentSettingSNavbarButton('billing'))
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      formalName: companyDetails && companyDetails.billingDetails && companyDetails.billingDetails.formalName,
      // address: companyDetails && companyDetails.billingDetails && companyDetails.billingDetails.address,
      legalForm: companyDetails && companyDetails.billingDetails && companyDetails.billingDetails.legalForm,
      postalCode: companyDetails && companyDetails.billingDetails && companyDetails.billingDetails.postalCode,
      // country: companyDetails && companyDetails.billingDetails && companyDetails.billingDetails.country,
    });
    setLocation(companyDetails?.billingDetails?.address)

  }, [companyDetails])

  const handleSubmit = values => {

    let obj = {
      address: location,
      formalName: values.formalName,
      legalForm: values.legalForm,
      postalCode: values.postalCode,
    }
    // console.log('obj', obj)

    dispatch(changeBillingData(obj));
  };

  const handleSelectUserModalOk = () => {
    if (selectedBillingUserId !== null && selectedBillingUserId !== '' && selectedBillingUserId !== undefined) {
      dispatch(changeBillingUser(selectedBillingUserId)).then(() => {
        setSelectUserModal(false)
      })
    }

  };
  const handleSelectUserModalCancel = () => {
    setSelectUserModal(false)
  };


  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 14,
        offset: 8,
      },
      md: {
        span: 4,
        offset: 20,
      },
      lg: {
        span: 4,
        offset: 20,
      }
    }
  };

  const onSelectNewBillingUser = (userId) => {
    setSelectedBillingUserId(userId)
  }
  const getLocation = (location) => {
    setLocation(location)
  }
  return (
    <Fragment>
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '40px' }}>
        <h1>Billing Info</h1>
        <hr style={{ border: '1px solid black' }} />
      </div>
      <Form
        {...formItemLayout}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Row>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Company Formal Name :' name='formalName'>
              <Input maxLength={25} style={{ color: 'black' }} value={companyDetails && companyDetails.name} disabled={isModerator} />
            </Form.Item>

          </Col>

          {/* <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Country' name='country'>
              <Input maxLength={25} style={{ color: 'black' }} value={companyDetails && companyDetails.country} disabled={isModerator} />
            </Form.Item>
          </Col> */}
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Address :' name='address'>
              {/* <Input  style={{ color: 'black' }} value={companyDetails && companyDetails.address} disabled={isModerator} /> */}
              <SearchBar getLocation={getLocation} talentLocation={location} disabledInput={isModerator} />
            </Form.Item>
          </Col>

          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
        </Row>
        <Row>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Company Legal Form :' name='legalForm'>
              <Input style={{ color: 'black' }} value={companyDetails && companyDetails.legalForm} disabled={isModerator} />
            </Form.Item>
          </Col>
          {/* <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Address :' name='address'>
              <Input  style={{ color: 'black' }} value={companyDetails && companyDetails.address} disabled={isModerator} />
            </Form.Item>
          </Col> */}
          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Postal Code :' name='postalCode'>
              <Input maxLength={25} style={{ color: 'black' }} value={companyDetails && companyDetails.postalCode} disabled={isModerator} />
            </Form.Item>
          </Col>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
        </Row>
        <Row>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
          {/* <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Postal Code :' name='postalCode'>
              <Input maxLength={25} style={{ color: 'black' }} value={companyDetails && companyDetails.postalCode} disabled={isModerator} />
            </Form.Item>
          </Col> */}

        </Row>
        {/* <Row>
          <Col xs={0} sm={0} md={6} lg={6}>

          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Item label='Current Password :' name='currentPassword' rules={
              [
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]
            }>
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            
          </Col>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
        </Row> */}
        <Form.Item  {...tailFormItemLayout}>
          {currentUser?.role === 'admin' && <Button type='primary' htmlType='submit' loading={btnLoading}>
            Save
          </Button>}
        </Form.Item>

      </Form>
      {/* <div style={{ textAlign: 'left', marginTop: '50px', marginBottom: '30px', marginLeft: '100px' }}>
        <p>Someone else on your organization is in charge of billing?</p>
        <Button loading={btnLoading} onClick={() => setSelectUserModal(true)}>Change billing user</Button>
      </div> */}

      <Modal
        title="Select User"
        visible={selectUserModal}
        onOk={handleSelectUserModalOk}
        onCancel={handleSelectUserModalCancel}
      >
        <h6>Change Billing User</h6>
        <Select
          showSearch
          allowClear
          onChange={onSelectNewBillingUser}
          style={{ width: 320 }}
          placeholder="Select a User"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {companyUsers && companyUsers.map((user, index) => {
            return <Option key={index} value={user._id}>{user.fullName}</Option>
          })}
        </Select>
      </Modal>

    </Fragment>
  );
}
export default BillingDetails;

