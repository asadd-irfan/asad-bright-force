import React from 'react';
import { Row, Col, Menu, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { getTalentsData, getProfileSubmitTalentsData } from '../../../../actions/talent'
import './talents.scss';

const { SubMenu } = Menu;

const MenuItem = ({ text, count, getTalents, isClickAble }) => {
	return (
		<Row>
			<Col xs={1} sm={1} md={1} lg={1}>
			</Col>
			<Col xs={20} sm={20} md={20} lg={20} onClick={getTalents} className={isClickAble && 'purple-color'}>
				{text}
			</Col>
			<Col xs={2} sm={2} md={2} lg={2}
				style={{
					alignSelf: 'center',
				}}
			>
				<div className='circle'>{count}</div>
			</Col>
			<Col xs={1} sm={1} md={1} lg={1}>
			</Col>
		</Row>
	)
}

function NavigationBar() {
	const dispatch = useDispatch();
	const allTalentsCount = useSelector(state => state.talents.allTalentsCount)
	const allTalentsCountData = useSelector(state => state.talents.allTalentsCountData)

	const getTalents = (queryString) => {
		let params = '?' + queryString;
		dispatch(getTalentsData(params))
	}
	const getProfileSubmitTalents = () => {
		dispatch(getProfileSubmitTalentsData())
	}

	return (

		<div className='menu-wrapper'>
			<Menu theme="dark" mode="inline" defaultOpenKeys={['1', '2']}>
				<Menu.Item className='borderBottom'>
					<MenuItem text='All Talents' getTalents={() => getTalents('')} count={allTalentsCount} />
				</Menu.Item>
				<Menu.Item className='borderBottom'>
					<MenuItem text='Registered' getTalents={() => getTalents('currentStatus=profile-not-completed&currentStatus=profile-completed')} count={allTalentsCountData && allTalentsCountData.talentRegistered} />
				</Menu.Item>
				<Menu.Item className='borderBottom'>
					<MenuItem text='Profile Submit' getTalents={() => getProfileSubmitTalents()} count={allTalentsCountData && allTalentsCountData.talentProfileSubmitted} />
				</Menu.Item>
				{/* <Menu.Item className='borderBottom'>
					<MenuItem text='P.Profile Approval' getTalents={() => getTalents('currentStatus=profile-approved')} count={allTalentsCountData && allTalentsCountData.talentProfileApproved} />
				</Menu.Item> */}

				<SubMenu title="Video Interview" className='borderBottom' key="1">
					<Menu.Item>
						<MenuItem text='Pending Results' getTalents={() => getTalents('currentStatus=video-interview-pending')} count={allTalentsCountData && allTalentsCountData.videoInterviewPending} isClickAble={allTalentsCountData && allTalentsCountData.videoInterviewPending > 0} />
					</Menu.Item>
					<Menu.Item>
						<MenuItem text='Failed' getTalents={() => getTalents('currentStatus=video-interview-fail')} count={allTalentsCountData && allTalentsCountData.videoInterviewFail} />
					</Menu.Item>
				</SubMenu>
				<SubMenu title="Coding Challenge" className='borderBottom' key="2">
					<Menu.Item>
						<MenuItem text='Pending Results' getTalents={() => getTalents('currentStatus=coding-challenge-pending')} count={allTalentsCountData && allTalentsCountData.codingChallengePending} isClickAble={allTalentsCountData && allTalentsCountData.codingChallengePending > 0} />
					</Menu.Item>
					<Menu.Item>
						<MenuItem text='Failed' getTalents={() => getTalents('currentStatus=coding-challenge-fail')} count={allTalentsCountData && allTalentsCountData.codingChallengeFail} />
					</Menu.Item>
				</SubMenu>
				<Menu.Item>
					<MenuItem text='Accepted' getTalents={() => getTalents('currentStatus=talent-accepted')} count={allTalentsCountData && allTalentsCountData.talentAccepted} />
				</Menu.Item>
				<Menu.Item>
					<MenuItem text='Live' getTalents={() => getTalents('availabilityStatus=live')} count={allTalentsCountData && allTalentsCountData.live} />
				</Menu.Item>
				<Menu.Item>
					<MenuItem text='Inactive' getTalents={() => getTalents('availabilityStatus=inactive')} count={allTalentsCountData && allTalentsCountData.inactive} />
				</Menu.Item>
				<Menu.Item>
					<Button type='primary' block onClick={() => getTalents('profileStatus=hold')}  >On Hold List</Button>
				</Menu.Item>
			</Menu>
		</div>

	)
}

export default NavigationBar;
