import React, { useEffect, useState } from 'react';
import Accepted from './Accepted';
import CodeChallenge from './CodeChallenge';
import ProfileApproval from './ProfileApproval';
import Registered from './Registered';
import CodeChallengeFail from './CodeChallengeFail';
import VideoInterviewFail from './VideoInterviewFail';
import VideoInterviewPending from './VideoInterviewPending';
import CodeChallengeResult from './Results/CodeChallengeResult';
import VideoInterviewResult from './Results/VideoInterviewResult';
import { useSelector } from "react-redux";
import moment from 'moment'
import Timeline from './Timeline';
import EventLogs from './EventLogs';
import { MOMENT_DATE_FORMAT } from '../../../../../../common/constants'


function SidePanel() {
	const talent = useSelector(state => state.talents.selectedTalent && state.talents.selectedTalent);
	const evaluationDetails = useSelector(state => state.talents.selectedTalentEvaluation && state.talents.selectedTalentEvaluation);
	let lastModified = talent && moment(talent.updatedAt).format(MOMENT_DATE_FORMAT)
	const [contacts, setContacts] = useState([])

	const [selectedTimelineNumber, setSelectedTimelineNumber] = useState(0)
	const [selectedTimeline, setSelectedTimeline] = useState('')
	const [selectedSection, setSelectedSection] = useState(talent && talent.currentStatus)
	const [selectedTimelineResult, setSelectedTimelineResult] = useState('')

	useEffect(() => {
		talent && talent.contactInfo && talent.contactInfo.length >= 0 && setContacts(talent.contactInfo)
		setSelectedTimeline(talent && talent.currentStatus)
		setSelectedSection(talent && talent.currentStatus)
		changeGotoBackStatus();
	}, [talent])


	const changeGotoBackStatus = () => {
		if ((talent && (selectedSection === 'profile-approved' || selectedSection === 'coding-challenge-pending'))) {
			setSelectedTimelineNumber(1);
		}
		else if (talent && talent.currentStatus === 'coding-challenge-fail') {
			setSelectedTimelineNumber(2);
		}
		else if (talent && (talent.currentStatus === 'coding-challenge-pass')) {
			setSelectedTimelineNumber(3);
		}

		else if (talent && (talent.currentStatus === 'video-interview-fail')) {
			setSelectedTimelineNumber(4);
		}

		else if (talent && (talent.currentStatus === 'talent-accepted')) {
			setSelectedTimelineNumber(11);
		}
	}

	const onChangeTimelineStatus = (state) => {
		setSelectedTimeline(state);
		setSelectedSection(state)
		setSelectedTimelineResult('')
	}
	const onChangeTimelineResult = (state) => {
		setSelectedTimelineResult(state)
	}

	return (
		<div style={{ padding: '10px 15px' }}>
			{selectedTimelineResult === 'coding-challenge-result'
				? <CodeChallengeResult talentEvaluationDetails={evaluationDetails} />
				: selectedTimelineResult === 'video-interview-result'
					? <VideoInterviewResult talentEvaluationDetails={evaluationDetails} />
					: <div>
						{talent && (selectedSection === 'profile-not-completed' || selectedSection === 'profile-completed') &&
							<Registered
								mainInfoHeading='Registered'
								mainInfoSubHeading={talent && talent.profileStatus === 'hold' ? 'on Hold' : ''}
								mainInfoSubHeadingColor={talent && talent.profileStatus !== 'hold' ? '#6AA84F' : '#FF7875'}
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
							/>}
						{talent && selectedSection === 'profile-submitted-for-approval' &&
							<ProfileApproval
								mainInfoHeading='Profile Approval'
								mainInfoSubHeading={talent && talent.profileStatus === 'hold' ? 'on Hold' : ''}
								mainInfoSubHeadingColor={talent && talent.profileStatus !== 'hold' ? '#6AA84F' : '#FF7875'}
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
							/>}
						{(talent && (selectedSection === 'profile-approved' || selectedSection === 'video-interview-pending')) &&
							<VideoInterviewPending
								mainInfoHeading='Video Interview'
								mainInfoSubHeading='Pending Results'
								mainInfoSubHeadingColor='#6AA84F'
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
								talentEvaluationDetails={evaluationDetails}
							/>}
						{talent && (selectedSection === 'video-interview-fail') &&
							<VideoInterviewFail
								mainInfoHeading='Video Interview'
								mainInfoSubHeading='Failed'
								mainInfoSubHeadingColor='#FF7875'
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
								talentEvaluationDetails={evaluationDetails}
							/>}

						{(talent && talent.isDeveloper && (selectedSection === 'coding-challenge-pending')) &&
							<CodeChallenge
								mainInfoHeading='Coding Challenge'
								mainInfoSubHeading='Pending Results'
								mainInfoSubHeadingColor='#6AA84F'
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
								talentEvaluationDetails={evaluationDetails}
							/>}
						{talent && talent.isDeveloper && selectedSection === 'coding-challenge-fail' &&
							<CodeChallengeFail
								mainInfoHeading='Coding Challenge'
								mainInfoSubHeading='Failed'
								mainInfoSubHeadingColor='#FF7875'
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
								talentEvaluationDetails={evaluationDetails}
							/>}
						{talent && (selectedSection === 'talent-accepted') &&
							<Accepted
								mainInfoHeading='Accepted'
								mainInfoSubHeading=''
								mainInfoSubHeadingColor=''
								mainInfoLastModified={lastModified}
								mainInfoContacts={contacts}
								talent={talent && talent}
								talentEvaluationDetails={evaluationDetails}
							/>}
					</div>
			}


			<Timeline
				talent={talent && talent}
				selectedTimeline={selectedTimeline}
				onChangeTimelineStatus={onChangeTimelineStatus}
				onChangeTimelineResult={onChangeTimelineResult}
				selectedTimelineResult={selectedTimelineResult}
				selectedTimelineNumber={selectedTimelineNumber}
				// isTmMeetingTimePassed={isTmMeetingTimePassed}
				// isTmMeetingDateTime={isTmMeetingDateTime}
				// isProfInterviewTimePassed={isProfInterviewTimePassed}
				// isProfInterviewDateTime={isProfInterviewDateTime}
				disable={talent && talent.profileStatus === 'hold' ? true : false} />
			<EventLogs
				talent={talent && talent}
			/>
		</div>
	)
}

export default SidePanel;
