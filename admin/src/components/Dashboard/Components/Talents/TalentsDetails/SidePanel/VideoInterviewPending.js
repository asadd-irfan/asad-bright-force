import React from 'react';
import { Button, Input, Form, Row, Col, notification } from 'antd';
import MainInfo from './MainInfo';
import { useDispatch, useSelector } from "react-redux";
import { changeTalentProfileStatus, } from '../../../../../../actions/talent'
import { updateVideoInterview, updateCodingChallenge } from '../../../../../../actions/evaluation'


function VideoInterviewPending({
    mainInfoHeading,
    mainInfoSubHeading,
    mainInfoSubHeadingColor,
    mainInfoLastModified,
    mainInfoContacts,
    talent,
    talentEvaluationDetails
}) {
    const dispatch = useDispatch();
    const btnLoading = useSelector(state => state.talents.btnLoading);
    const [form] = Form.useForm();

    const onChangeProfileStatus = (status) => {
        let id = talent && talent._id;
        const obj = {
            profileStatus: status
        }
        dispatch(changeTalentProfileStatus(obj, id))
    }



    const updateVideoInterviewResult = (status) => {
        if (form.getFieldValue('resultLink') === '' || form.getFieldValue('resultLink') === null || form.getFieldValue('resultLink') === undefined) {
            notification.error({
                message: 'Error',
                description: 'Add Valid Result Link!!!',
            });
        } else {
            let id = talent && talent._id;
            const obj = {
                result: status,
                isCompleted: true,
                "resultLink": form.getFieldValue('resultLink'),

            }
            // console.log('obj', obj)
            dispatch(updateVideoInterview(obj, id))

        }
    }

    const handleSubmit = values => {
        let id = talent && talent._id;
        // if (!talent.isDeveloper) {
        if (values.resultLink === '' || values.resultLink === null || values.resultLink === undefined) {
            notification.error({
                message: 'Error',
                description: 'Add Valid Result Link!!!',
            });
        } else if (values.websiteLink === '' || values.websiteLink === null || values.websiteLink === undefined) {
            notification.error({
                message: 'Error',
                description: 'Add Valid coding challenge Link!!!',
            });
        }
        else {
            const obj = {
                result: 'pass',
                isCompleted: true,
                resultLink: values.resultLink,
            }
            dispatch(updateVideoInterview(obj, id)).then(() => {
                setTimeout(() => {
                    const obj = {
                        result: 'pending',
                        websiteLink: values.websiteLink,
                    }
                    dispatch(updateCodingChallenge(obj, id));
                }, 1000);


            })
        }


    };

    return (
        <div>
            <div className='mb-20'>
                <MainInfo
                    heading={mainInfoHeading}
                    subHeading={mainInfoSubHeading}
                    subHeadingColor={mainInfoSubHeadingColor}
                    lastModified={mainInfoLastModified}
                    contacts={mainInfoContacts}
                />
            </div>

            <div className='mb-20'>
                <h5 className="my-5" style={{ color: '#5992C8' }}>Video Interview Results</h5>
            </div>
            <div className='mb-20'>

                {/* <a target='_blank' rel='noopener noreferrer'  href={talentEvaluationDetails && talentEvaluationDetails.videoInterview && talentEvaluationDetails.videoInterview.videoLink}>
					{talentEvaluationDetails && talentEvaluationDetails.videoInterview && talentEvaluationDetails.videoInterview.videoLink}
				</a> */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    // onFinishFailed={onFinishFailed}
                    className="form-wrapper"
                >
                    <div>


                        <div className='mb-20'>
                            <h5>Video Interview Result Link</h5>
                            <Form.Item name='resultLink' rules={
                                [
                                    {
                                        type: "url",
                                        message: "The input is not valid URL"
                                    }
                                ]
                            }>
                                <Input />
                            </Form.Item>

                        </div>

                        <div className='mb-20 my-4'>
                            <h5 className="my-5" style={{ color: '#5992C8' }}>Coding Challenge Parameters</h5>
                        </div>
                        <div className='mb-20'>
                            <h5>Coding Challenge Link</h5>
                            <Form.Item name='websiteLink' rules={
                                [
                                    {
                                        type: "url",
                                        message: "The input is not valid URL"
                                    }
                                ]
                            }>
                                <Input />
                            </Form.Item>

                        </div>
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Form.Item>
                                    {talent && talent.profileStatus === 'active' &&
                                        <div className='text-center mb-20'>
                                            <Button htmlType="submit" loading={btnLoading} type="default" className='btn-green'>
                                                Move to Coding Challange
										</Button>
                                        </div>}
                                    {talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
                                        <Button loading={btnLoading} type="danger" onClick={() => updateVideoInterviewResult('fail')}>
                                            Move To Failed
                </Button>
                                    </div>}
                                    {talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
                                        <Button loading={btnLoading} type="danger" onClick={() => onChangeProfileStatus('hold')}>
                                            Move to on hold
                </Button>
                                    </div>}
                                    {talent && talent.profileStatus === 'hold' && <div className='text-center mb-20'>
                                        <Button loading={btnLoading} type="default" className='btn-green' onClick={() => onChangeProfileStatus('active')}>
                                            Move back to active list
                </Button>
                                    </div>}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>

            {/*   {talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
				<Button loading={btnLoading} className='btn-green' onClick={() => updateVideoInterviewResult('pass')}>
					Move To Accepted
                </Button>
			</div>}
            
           {talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
				<Button loading={btnLoading} type="danger" onClick={() => updateVideoInterviewResult('fail')}>
					Move To Failed
                </Button>
			</div>}

            {talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
                <Button loading={btnLoading} type="danger" onClick={() => onChangeProfileStatus('hold')}>
                    Move to on hold
                </Button>
            </div>}
            {talent && talent.profileStatus === 'hold' && <div className='text-center mb-20'>
                <Button loading={btnLoading} type="default" className='btn-green' onClick={() => onChangeProfileStatus('active')}>
                    Move back to active list
                </Button>
            </div>} */}
        </div>
    )
}

export default VideoInterviewPending;
