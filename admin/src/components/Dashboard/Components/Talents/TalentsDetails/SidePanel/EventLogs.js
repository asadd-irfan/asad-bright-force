import React from 'react'
import { Card } from 'antd';
import moment from 'moment';
import './sidePanel.scss'
import { MOMENT_DATE_FORMAT } from '../../../../../../common/constants'

const EventLogs = ({ talent }) => {
    console.log('talent', talent)
    return (
        <div>
            <Card title="Event Logs" style={{ border: '2px solid black' }} >

                <ul>
                    <li>{moment(talent?.createdAt).format(MOMENT_DATE_FORMAT)} : <b>Registered</b></li>
                    {talent?.videoInterviewPassedDate && <li>{moment(talent?.videoInterviewPassedDate).format(MOMENT_DATE_FORMAT)} : <b>Passed Video Interview</b></li>}
                    {talent?.videoInterviewFailedDate && <li>{moment(talent?.videoInterviewFailedDate).format(MOMENT_DATE_FORMAT)} : <b>Failed Video Interview</b></li>}
                    {talent?.codingChallengePassedDate && <li>{moment(talent?.codingChallengePassedDate).format(MOMENT_DATE_FORMAT)} : <b>Passed Coding Challenge</b></li>}
                    {talent?.codingChallengeFailedDate && <li>{moment(talent?.codingChallengeFailedDate).format(MOMENT_DATE_FORMAT)} : <b>Failed Coding Challenge</b></li>}
                    {talent?.talentAcceptedDate && <li>{moment(talent?.talentAcceptedDate).format(MOMENT_DATE_FORMAT)} : <b>Accepted</b></li>}
                    {talent?.statusLiveDate && <li>{moment(talent?.statusLiveDate).format(MOMENT_DATE_FORMAT)} : <b>Live</b></li>}
                    {talent?.statusInactiveDate && <li>{moment(talent?.statusInactiveDate).format(MOMENT_DATE_FORMAT)} : <b>Inactive</b></li>}


                </ul>


            </Card>
        </div>
    )
}

export default EventLogs