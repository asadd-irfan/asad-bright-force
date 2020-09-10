import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Form, Row, Col, Select, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import SearchBar from '../../../../../PlacesAutoComplete/SearchBar'
import { onFinishFailed } from "../../../../../../common/commonMethods";
import { updateCompanyBillingDetails } from "../../../../../../actions/company";

const { Option } = Select;

const BillingDetails = ({ selectedCompany }) => {

  const [form] = Form.useForm();
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const dispatch = useDispatch()
  const [location, setLocation] = useState("");


  useEffect(() => {
    form.setFieldsValue({
      formalName: selectedCompany && selectedCompany.billingDetails && selectedCompany.billingDetails.formalName,
      legalForm: selectedCompany && selectedCompany.billingDetails && selectedCompany.billingDetails.legalForm,
      postalCode: selectedCompany && selectedCompany.billingDetails && selectedCompany.billingDetails.postalCode,
    });
    setLocation(selectedCompany?.billingDetails?.address)

  }, [selectedCompany])

  const handleSubmit = values => {

    let obj = {
      address: location,
      formalName: values.formalName,
      legalForm: values.legalForm,
      postalCode: values.postalCode,
    }
    // console.log('obj', obj)

    dispatch(updateCompanyBillingDetails(obj, selectedCompany?._id));
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
              <Input maxLength={25} style={{ color: 'black' }} value={selectedCompany && selectedCompany.name} />
            </Form.Item>

          </Col>


          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Address :' name='address'>
              <SearchBar getLocation={getLocation} talentLocation={location} />
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
              <Input style={{ color: 'black' }} value={selectedCompany && selectedCompany.legalForm} />
            </Form.Item>
          </Col>


          <Col xs={12} sm={12} md={10} lg={10}>
            <Form.Item label='Postal Code :' name='postalCode'>
              <Input maxLength={25} style={{ color: 'black' }} value={selectedCompany && selectedCompany.postalCode} />
            </Form.Item>
          </Col>
          <Col xs={0} sm={0} md={2} lg={2}>

          </Col>
        </Row>




        <Form.Item  {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' loading={btnLoading}>
            Save
          </Button>
        </Form.Item>

      </Form>





    </Fragment>
  );
}
export default BillingDetails;

