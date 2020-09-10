import React from 'react';
import { Timeline } from 'antd';
import './sidePanel.scss'

const Heading = ({ title, isFail, isCurrent, onClick }) => {
	return (
		<div
			style={isCurrent ? isFail ? { color: '#FF7875', fontWeight: 'bold' } : { color: '#6AA84F', fontWeight: 'bold' } : { color: '' }}
			onClick={onClick}
		>
			{title}
		</div>
	)
}

function TimelineComponent({
	talent,
	disable,
	onChangeTimelineStatus,
	selectedTimeline,
	selectedTimelineNumber,
	onChangeTimelineResult,
	selectedTimelineResult
}) {
	return (
		<Timeline>
			<Timeline.Item color={disable ? "gray" : "green"}>
				<Heading
					title={'Registered'}
					isCurrent={(selectedTimeline === 'profile-not-completed' || selectedTimeline === 'profile-completed') ? true : false}
				/>
			</Timeline.Item>
			<Timeline.Item color={disable ? "gray" : "green"}>
				<Heading
					title={'Profile Approval'}
					isCurrent={selectedTimeline === 'profile-submitted-for-approval' ? true : false}
				/>
			</Timeline.Item>

			<Timeline.Item color={disable ? "gray" : selectedTimelineResult === 'video-interview-result' ? "red" : "green"}>
				<div className={selectedTimelineNumber > 3 ? 'on-hover' : ''}>
					<Heading
						title={'Video Interview'}
						isCurrent={(
							selectedTimeline === 'coding-challenge-pass'
						) ? true : false}
						onClick={selectedTimelineNumber > 3 ? () => onChangeTimelineResult('video-interview-result') : null}
					/>
				</div>
				{selectedTimelineNumber > 4 ? <div></div> :
					<div>
						<div className='ml-20 mt-10 on-hover'>
							<Heading
								title={'Pending Results'}
								isCurrent={(selectedTimeline === 'profile-approved' || selectedTimeline === 'video-interview-pending' || (talent && !talent.isDeveloper && selectedTimeline === 'profile-approved')) ? true : false}
								onClick={selectedTimelineNumber >= 4 ? () => onChangeTimelineStatus('profile-approved') : null}
							/>
						</div>
						<div className='ml-20 mt-10 on-hover'>
							<Heading
								title={'Failed'}
								isFail={true}
								isCurrent={(selectedTimeline === 'video-interview-fail') ? true : false}
								onClick={selectedTimelineNumber >= 5 ? () => onChangeTimelineStatus('video-interview-fail') : null}
							/>
						</div>
					</div>
				}
			</Timeline.Item>

			{talent && talent.isDeveloper &&
				<Timeline.Item color={disable ? "gray" : selectedTimelineResult === 'coding-challenge-result' ? "red" : "green"}>
					<div className={selectedTimelineNumber > 6 ? 'on-hover' : ''}>
						<Heading
							title={'Coding Challenge'}
							isCurrent={(
								selectedTimeline === 'video-interview-pass'
								|| selectedTimeline === 'coding-challenge-pending'
							) ? true : false}
							onClick={selectedTimelineNumber > 2 ? () => onChangeTimelineResult('coding-challenge-result') : null}
						/>
					</div>
					{selectedTimelineNumber > 6 ? <div></div> :
						<div>
							<div className='ml-20 mt-10 on-hover'>
								<Heading
									title={'Pending Results'}
									isCurrent={(selectedTimeline === 'video-interview-pass' || selectedTimeline === 'coding-challenge-pending') ? true : false}
									onClick={selectedTimelineNumber >= 7 ? () => onChangeTimelineStatus('profile-approved') : null}
								/>
							</div>
							<div className='ml-20 mt-10 on-hover'>
								<Heading
									title={'Failed'}
									isFail={true}
									isCurrent={(selectedTimeline === 'coding-challenge-fail') ? true : false}
									onClick={selectedTimelineNumber >= 8 ? () => onChangeTimelineStatus('coding-challenge-fail') : null}
								/>
							</div>
						</div>
					}
				</Timeline.Item>
			}
			<Timeline.Item color={disable ? "gray" : "green"}>
				<div className={selectedTimelineNumber > 10 ? 'on-hover' : ''}>
					<Heading
						title={'Talent Accepted'}
						isCurrent={(selectedTimeline === 'talent-accepted') ? true : false}
						onClick={selectedTimelineNumber >= 10 ? () => onChangeTimelineStatus('talent-accepted') : null}
					/>
				</div>
			</Timeline.Item>
		</Timeline>
	)
}

export default TimelineComponent;
