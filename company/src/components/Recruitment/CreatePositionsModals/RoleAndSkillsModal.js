import React, { useState, } from 'react';
import { Form, Row, Col, Tag, Select, Slider, Typography } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import {
    NEW_POSITION_SKILLS
} from '../../../actions/types';
const { Paragraph } = Typography
const { Option } = Select


const RoleAndSkillsModal = () => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const roleOptions = appConfigs && appConfigs['preferred-role']
    const appConfigTechExp = appConfigs && appConfigs['skills']
    const dispatch = useDispatch()
    const newPositionSkills = useSelector(state => state.positions.newPositionSkills)

    const [selectedMainRoleSkill, setSelectedMainRoleSkill] = useState([]);
    const [autoCompleteMainRoleSkill, setAutoCompleteMainRoleSkill] = useState([]);
    const [mainRoleSkill, setMainRoleSkill] = useState([]);
    const [mainRoleSkills, setMainRoleSkills] = useState(newPositionSkills);
    const mainRoleSkillHandleFocus = e => {
        let value = e.target.value
        let result;
        result = appConfigTechExp && appConfigTechExp.map(item => item.name).filter(item => {
            if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                return item
            }
            return null
        });
        setMainRoleSkill(result);
    };

    const mainRoleSkillsSelectHandler = (value) => {
        let resultObj = appConfigTechExp && appConfigTechExp.filter(item => {
            if (item.name === value) {
                return item
            }
        })
        if (!selectedMainRoleSkill.includes(value)) {
            selectedMainRoleSkill.push(value);
            setSelectedMainRoleSkill([...selectedMainRoleSkill]);
            let mainRoleSkillsLocally = [...mainRoleSkills];
            let isPushed = false;
            selectedMainRoleSkill.map((item, index) => {
                if (isPushed === false) {
                    isPushed = true;
                    let obj = {
                        experienceId: resultObj && resultObj[0]._id,
                        experienceName: value,
                    }
                    mainRoleSkillsLocally.push(obj);
                }
                return null
            });
            setMainRoleSkills([...mainRoleSkillsLocally]);
            dispatch({
                type: NEW_POSITION_SKILLS,
                payload: [...mainRoleSkillsLocally]
            });

            setAutoCompleteMainRoleSkill('')
        }
        return "";
    };

    const mainRoleSkillsClearField = (e, index, value) => {
        e.preventDefault();
        let mainRoleSkillArr = selectedMainRoleSkill.filter(item => {
            if (item !== value) {
                return item
            }
            else { return null }
        })
        setSelectedMainRoleSkill(mainRoleSkillArr)

        let mainRoleSkillsLocally = mainRoleSkills.filter(item => {
            if (item.experienceName !== value) {
                return item
            }
            else { return null }
        })
        setMainRoleSkills(mainRoleSkillsLocally);
        dispatch({
            type: NEW_POSITION_SKILLS,
            payload: mainRoleSkillsLocally
        });
    }


    return (
        <div className="my-5">
            <div className="my-5">
                <h2>What are your position required skills set?</h2>
            </div>

            <Row className="my-3">
                <Col xs={24} sm={24} md={10} lg={10}>
                    <h5>Role </h5>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} style={{ top: '-3px' }}>
                    <Row justify='center'>
                        <h5 className=" my-2">Years of Experience</h5>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10}>
                    <Form.Item name='roleName'>
                        <Select
                            allowClear
                            placeholder="Select Position Role"
                            style={{ width: 300 }}
                        >
                            {roleOptions && roleOptions.map((role, index) => {
                                return <Option key={index} value={role._id}>{role.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={0} sm={0} md={1} lg={1}>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} style={{ top: '-3px' }}>
                    {/* <Paragraph className="font-weight-bold mb-2 d-flex justify-content-center">Years of Experience</Paragraph > */}
                    <Form.Item name='roleExp'>
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
            </Row>

            <div className="my-3">
                <Row >
                    {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                    <Col xs={24} sm={24} md={16} lg={16}>
                        <h5 >Skills</h5>
                    </Col>
                </Row>
                <Row >
                    {/* <Col xs={0} sm={0} md={5} lg={5}>
                      </Col> */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Select
                            style={{ width: '100%', marginBottom: "20px" }}
                            onFocus={mainRoleSkillHandleFocus}
                            onSelect={mainRoleSkillsSelectHandler}
                            value={autoCompleteMainRoleSkill}
                            showSearch
                            showArrow={false}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder="Type a skill, e.g. React"
                        >
                            {mainRoleSkill.map(exp => (
                                <Option key={exp}>{exp}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row justify='start'>
                    {/* <Col xs={1} sm={1} md={5} lg={5}></Col> */}
                    <Col xs={23} sm={23} md={12} lg={12}>
                        {mainRoleSkills.map((item, index) => (
                            <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => mainRoleSkillsClearField(e, index, item.experienceName)}>
                                {item.experienceName}
                            </Tag>
                        ))}
                    </Col>
                </Row>

            </div>


        </div>
    )
}

export default RoleAndSkillsModal;
