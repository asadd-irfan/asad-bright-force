import React, { useState } from 'react';
import { Button, notification, Input } from 'antd';
import MainInfo from './MainInfo';
import { useDispatch, useSelector } from "react-redux";
import { changeTalentProfileStatus } from '../../../../../../actions/talent'
import { updateVideoInterview } from '../../../../../../actions/evaluation'
import { isValidUrl } from '../../../../../../common/commonMethods'

function VideoInterviewFail({
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
    const [videoLink, setVideoLink] = useState('')
    let videoInterview = talentEvaluationDetails && talentEvaluationDetails.videoInterview

    const onChangeProfileStatus = (status) => {
        let id = talent && talent._id;
        const obj = {
            profileStatus: status
        }
        dispatch(changeTalentProfileStatus(obj, id))
    }

    const updateVideoInterviewResult = () => {
        if (!isValidUrl(videoLink)) {
            notification.error({
                message: 'Error',
                description: 'Add Valid Video Link!!!',
            });
        }
        else {
            let id = talent && talent._id;
            let values = {
                result: 'pending',
                isCompleted: true,
                resultDetails: '',
                videoLink: videoLink
            };
            dispatch(updateVideoInterview(values, id))
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
                <h5>Results - Last Test</h5>
                <span><a target='_blank' rel='noopener noreferrer' href={videoInterview && videoInterview.resultLink}>{videoInterview && videoInterview.resultLink}</a></span>
            </div>

            <div className='mb-20'>
                <h5>New Test:</h5>
            </div>


            <div className='mb-20'>
                <h6>Video Interview Link</h6>
                <Input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
            </div>

            <div>
                {talent && talent.profileStatus === 'active' &&
                    <div className='text-center mb-20'>
                        <Button loading={btnLoading} type="default" className='btn-green' onClick={() => updateVideoInterviewResult()}>
                            Send a New Video Interview
									</Button>
                    </div>}
            </div>

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
        </div>
    )
}

export default VideoInterviewFail;
