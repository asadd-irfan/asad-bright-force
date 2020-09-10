import React, { Fragment, useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { onFinishFailed } from "../../../../../../common/commonMethods";
import { updateCompanyDetails } from "../../../../../../actions/company";

const { Option } = Select;

const TimeZoneCurrencySettings = ({ selectedCompany }) => {

  const [form] = Form.useForm();
  const btnLoading = useSelector(state => state.auth.authBtnLoading);
  const user = useSelector(state => state.auth.user);
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const currencyOptions = appConfigs && appConfigs['currency']
  const timeZoneOptions = appConfigs && appConfigs['timezone']
  const [isModerator, setIsModerator] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    form.setFieldsValue({
      currency: selectedCompany?.currency ? selectedCompany?.currency : null,
      timezone: selectedCompany?.timezone ? selectedCompany?.timezone : null,
    });
  }, [selectedCompany])

  const handleSubmit = values => {
    dispatch(updateCompanyDetails(values, selectedCompany._id))
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
      span: 16,
      offset: 8,
    },
  };

  return (
    <Fragment>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Time zone & currency</h1>
        <hr style={{ border: '1px solid black' }} />
      </div>
      <Form
        {...formItemLayout}
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        form={form}
      >

        <Form.Item label='Time Zone :' name='timezone' rules={
          [
            {
              required: true,
              message: 'Please Select Time Zone'
            }
          ]
        }>
          {/* <Select
            placeholder="Select a Time Zone"
            optionFilterProp="children"
            disabled={isModerator}
          >
            {timeZoneOptions && timeZoneOptions.map((item, index) => {
              return <Option key={index} value={item._id}>{item.name}</Option>
            })}
          </Select> */}
          <Select
            style={{ width: '100%', marginBottom: "20px" }}
            showSearch
            showArrow={false}
            filterOption={(input, option) =>
              // console.log('option',option)
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

            }
            placeholder="Type your timezone, e.g. Asia/Karachi"
          >
            {timeZoneOptions && timeZoneOptions.map((item, index) => {
              let timezone = ("(UTC " + item.timezoneUTC + ") " + item.name).toString()
              return <Option key={index} value={item._id}>{timezone}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item label='Currency :' name='currency' rules={
          [
            {
              required: true,
              message: 'Please Select Currency'
            }
          ]
        }>
          <Select
            placeholder="Select a Currency"
            optionFilterProp="children"
            disabled={isModerator}
          >
            {currencyOptions && currencyOptions.map((item, index) => {
              return <Option key={index} value={item._id}>{item.name}</Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item {...tailFormItemLayout} >
          <Button type='primary' htmlType='submit' loading={btnLoading}>
            Save
          </Button>
        </Form.Item>

      </Form>


    </Fragment>
  );
}
export default TimeZoneCurrencySettings;

