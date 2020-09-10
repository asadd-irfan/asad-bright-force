import React, { useState, } from 'react';
import { Form, Row, Col, Radio, Select } from 'antd';
import { useSelector, } from "react-redux";
const { Option } = Select

const WorkHourModal = () => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const timezoneOptions = appConfigs && appConfigs['timezone']

    return (
        <div className="my-5">
            <div className="my-5">
                <h2>How flexible is the position work hours?</h2>
            </div>
            <Row>
                <Col xs={24} sm={24} md={14} lg={14}>


                    <div className="my-3">
                        <h5>TimeZone</h5>
                        <Row>
                            <Col xs={24} sm={24} md={20} lg={20}>
                                <Form.Item name='timezone' >

                                    <Select
                                        style={{ width: '100%', marginBottom: "10px" }}
                                        showSearch
                                        showArrow={false}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        placeholder="Type your timezone, e.g. Asia/Karachi"
                                    >
                                        {timezoneOptions && timezoneOptions.map((item, index) => {
                                            let timezone = ("(UTC " + item.timezoneUTC + ") " + item.name).toString()
                                            return <Option key={index} value={item._id}>{timezone}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>



                    </div>
                    <Row>
                        <h5 className="mb-2">Position work hours range</h5>

                        <Col xs={24} sm={24} md={16} lg={16}>


                            <Form.Item name='workingTimeFlexibility'>
                                <Radio.Group >
                                    <Radio value='very-flexible'>Very flexible - No overlapping work hours are required</Radio>
                                    <Radio value='somewhat-flexible'>Somewhat flexible - at least 2 overlapping work hours</Radio>
                                    <Radio value='flexible'>Flexible - at least 4 overlapping work hours</Radio>
                                    <Radio value='not-flexible'>Not flexible - at least 6 overlapping work hours</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>


                    </Row>

                </Col>


            </Row>
        </div>
    )
}

export default WorkHourModal;
