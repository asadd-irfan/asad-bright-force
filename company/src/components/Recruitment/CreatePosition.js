import React, { useEffect, useState } from 'react';
import { Steps, Button, Row, Col, Form, notification } from 'antd';
import './recruitment.scss';
import { useSelector, useDispatch } from 'react-redux'
import { createPosition, getAllPositionsByType, getAllCompanyPositions } from '../../actions/positions'
import { useHistory } from 'react-router-dom';
import RoleModal from './CreatePositionsModals/RoleModal';
import TitleModal from './CreatePositionsModals/TitleModal';
import EmploymentModal from './CreatePositionsModals/EmploymentModal';
import RoleAndSkillsModal from './CreatePositionsModals/RoleAndSkillsModal';
import ManagementExpModal from './CreatePositionsModals/ManagementExpModal';
import WorkHourModal from './CreatePositionsModals/WorkHourModal';
import PositionFeaturesModal from './CreatePositionsModals/PositionFeaturesModal';
import ResponsibilitiesModal from './CreatePositionsModals/ResponsibilitiesModal';
import OfferModal from './CreatePositionsModals/OfferModal';
import HiringTeamModal from './CreatePositionsModals/HiringTeamModal';
import SummaryModal from './CreatePositionsModals/SummaryModal';
import {
    NEW_POSITION_FEATURES,
    NEW_POSITION_ROLE_FEATURES,
    NEW_POSITION_SKILLS,
    NEW_POSITION_MANAGEMENT_EXP,
    NEW_POSITION_HIRING_TEAM,

} from '../../actions/types';
const { Step } = Steps;

export default function CreatePosition() {
    const history = useHistory();
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const [stepsArray, setStepsArray] = useState([{
        title: "Position Role",
        content: <RoleModal />
    }]);
    const newPositionSkills = useSelector(state => state.positions.newPositionSkills)
    const newPositionManagementExp = useSelector(state => state.positions.newPositionManagementExp)
    const newPositionHiringTeam = useSelector(state => state.positions.newPositionHiringTeam)
    const newPositionFeatures = useSelector(state => state.positions.newPositionFeatures)
    const newPositionRoleFeatures = useSelector(state => state.positions.newPositionRoleFeatures)
    const companyDetails = useSelector(state => state.company.companyDetails);

    form.setFieldsValue({
        timezone: companyDetails && companyDetails.timezone,
    });

    useEffect(() => {
        return () => {
            dispatch({
                type: NEW_POSITION_FEATURES,
                payload: []
            });
            dispatch({
                type: NEW_POSITION_ROLE_FEATURES,
                payload: []
            });
            dispatch({
                type: NEW_POSITION_SKILLS,
                payload: []
            });
            dispatch({
                type: NEW_POSITION_HIRING_TEAM,
                payload: []
            });
            dispatch({
                type: NEW_POSITION_MANAGEMENT_EXP,
                payload: false
            });
            form.resetFields();
        }
    }, [])

    let steps = [
        {
            title: "Position Role",
            content: <RoleModal />,
        },
        {
            title: "Position Title",
            content: <TitleModal />,
        },
        {
            title: " Employment Type",
            content: <EmploymentModal />,
        },
        {
            title: " Skills",
            content: <RoleAndSkillsModal />,
        },
        {
            title: " Management Experience",
            content: <ManagementExpModal />,
        },
        {
            title: " Work Hours",
            content: <WorkHourModal />,
        },
        {
            title: "Position Features",
            content: <PositionFeaturesModal />,
        },
        {
            title: "Main Responsibilities",
            content: <ResponsibilitiesModal />,
        },
        {
            title: "Position Offer",
            content: <OfferModal />,
        },
        {
            title: "Hiring Team",
            content: <HiringTeamModal />,
        },
        {
            title: "Position Summary",
            content: <SummaryModal form={form} />,
        },
    ];

    const next = () => {
        if (form.getFieldValue('positionType') === undefined && current === 0) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Type.',
            });
        } else if (form.getFieldValue('title') === undefined && current === 1) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Title.',
            });
        } else if (form.getFieldValue('employmentType') === undefined && current === 2) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Employment Type.',
            });
        } else if (form.getFieldValue('roleName') === undefined && current === 3) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Role.',
            });
        } else if (form.getFieldValue('roleExp') === undefined && current === 3) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Role Experience.',
            });
        } else if (newPositionSkills.length === 0 && current === 3) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Skills.',
            });

        } else if (newPositionManagementExp && form.getFieldValue('managementExperience') === undefined && current === 4) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Management Year Of Experience.',
            });
        } else if (form.getFieldValue('timezone') === undefined && current === 5) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Timezone.',
            });
        } else if (form.getFieldValue('workingTimeFlexibility') === undefined && current === 5) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Work Hours Range.',
            });
        } else if (newPositionRoleFeatures.length === 0 && newPositionFeatures.length === 0 && current === 6) {
            notification.error({
                message: 'Error',
                description: 'Please Select Position Features.',
            });
        } else if (form.getFieldValue('mainResponsibilities') === undefined && current === 7) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Main Responsibilities.',
            });
        } else if (form.getFieldValue('salary') === undefined && current === 8) {
            notification.error({
                message: 'Error',
                description: 'Please Enter Position Salary.',
            });
        } else if (form.getFieldValue('currency') === undefined && current === 8) {
            notification.error({
                message: 'Error',
                description: 'Please Enter currency.',
            });
        } else if (newPositionHiringTeam.length === 0 && current === 9) {
            notification.error({
                message: 'Error',
                description: 'Please Select Hiring Team Members.',
            });
        }
        else {
            const currentStep = current + 1;
            setStepsArray([...stepsArray, steps[current + 1]])
            setCurrent(currentStep);
        }
    }
    const prev = () => {
        const currentStep = current - 1;
        setCurrent(currentStep);
        stepsArray.pop();
        setStepsArray(stepsArray)
    }

    const handleSubmit = () => {
        let hiringTeam = newPositionHiringTeam.map(user => user.userId)
        let skills = newPositionSkills.map(skill => skill.experienceId)
        let roleFeatures = newPositionFeatures.map((item, index) => {
            if (item.tagId) {
                return {
                    feature: item.tagId,
                    priorityOrder: index + 1
                }
            }
        }).filter(Boolean)

        let obj = {
            "hiringTeam": hiringTeam,
            "name": form.getFieldValue('positionType'),
            "title": form.getFieldValue('title'),
            "role": {
                "name": form.getFieldValue('roleName'),
                "yearsOfExperience": form.getFieldValue('roleExp')
            },
            "skills": skills,
            "managementExperience": {
                "status": newPositionManagementExp,
                "yearsOfExperience": newPositionManagementExp ? form.getFieldValue('managementExperience') : null
            },
            "employmentType": form.getFieldValue('employmentType'),
            "mainResponsibilities": form.getFieldValue('mainResponsibilities'),
            "positionFeatures": roleFeatures,
            "positionOffer": {
                "salary": form.getFieldValue('salary'),
                "currency": form.getFieldValue('currency'),
                "equity": form.getFieldValue('equity'),
                "performanceBonus": form.getFieldValue('performanceBonus'),
                "signingBonus": form.getFieldValue('signingBonus'),
            },
            "workingTimeFlexibility": form.getFieldValue('workingTimeFlexibility'),
            "timezone": form.getFieldValue('timezone'),
            "sentToAccountManager": true
        }
        // console.log('obj', obj)
        dispatch(createPosition(obj)).then(() => {
            dispatch(getAllCompanyPositions())
            dispatch(getAllPositionsByType())
            history.push('/company/hire/recruitment');
        });
    };
    const onChangeStep = current => {
        setCurrent(current);
    }

    return (
        <div>
            <Row>
                <Col xs={4} sm={4} md={4} lg={4} style={{ wordWrap: 'break-word' }}>
                    <Steps current={current} direction="vertical" onChange={onChangeStep}>
                        {stepsArray.map((item, index) => (
                            <Step key={index} title={<b>{item.title}</b>} />
                        ))}

                    </Steps>
                </Col>
                <Col xs={20} sm={20} md={20} lg={20} >
                    <Form
                        layout={'vertical'}
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <div className="steps-content">{steps[current].content}</div>
                        <div className="steps-action">
                            <Row justify="space-between">
                                <div>
                                    {current > 0 && (
                                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                            Back
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    {current < 10 && (
                                        <Button type="primary" onClick={() => next()}>
                                            Next
                                        </Button>
                                    )}
                                    {current === 10 && (
                                        <Button type="primary" htmlType='submit' >
                                            Sent to Account Manager
                                        </Button>
                                    )}
                                </div>
                            </Row>



                        </div>
                    </Form>
                </Col>

            </Row>


        </div>
    )
}
