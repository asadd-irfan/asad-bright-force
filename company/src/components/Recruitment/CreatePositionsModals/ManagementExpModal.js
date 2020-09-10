import React, { useState, useEffect } from 'react';
import { Form, Radio, Row, Col, Slider, Tag, Checkbox, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import {
    NEW_POSITION_MANAGEMENT_EXP
} from '../../../actions/types';
const { Paragraph } = Typography;



const ManagementExpModal = () => {
    const dispatch = useDispatch()
    const newPositionManagementExp = useSelector(state => state.positions.newPositionManagementExp)
    const [manageExpCheckBox, setManageExpCheckBox] = useState(newPositionManagementExp);

    const manageExpCheckBoxHandler = (e) => {
        setManageExpCheckBox(e.target.checked)
        dispatch({
            type: NEW_POSITION_MANAGEMENT_EXP,
            payload: e.target.checked
        });

    }

    return (
        <div className="my-5">

            <div className="my-5">
                <h2>Does the position require management experience?</h2>
            </div>

            <div className="my-3">
                <h5>Management Experience</h5>
                <Row className="my-5" style={{ marginBottom: "30px" }}
                >

                    {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Checkbox onChange={manageExpCheckBoxHandler} className="checkbox-style" checked={manageExpCheckBox}>
                            This position require Management Experience
              </Checkbox>
                    </Col>

                </Row>

                {manageExpCheckBox && <Row className="my-5">

                    {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                    <Col xs={10} sm={10} md={7} lg={7} className="mt-3">
                        <Tag>Management Experience </Tag>
                    </Col>
                    <Col xs={14} sm={14} md={13} lg={13}>
                        <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph>
                    </Col>
                    <Col xs={10} sm={10} md={7} lg={7} />
                    <Col xs={14} sm={14} md={12} lg={12}>

                        <Form.Item name='managementExperience'>
                            <Slider
                                marks={{
                                    0: "0",
                                    5: "5",
                                    10: "10",
                                    15: "15",
                                    20: "20"
                                }}
                                min={0}
                                max={20}
                                style={{ marginLeft: "25px", marginTop: "5px" }}
                                className="ant-slider-custom-styles"
                            />
                        </Form.Item>
                    </Col>

                </Row>}

            </div>
        </div>
    )
}

export default ManagementExpModal;
