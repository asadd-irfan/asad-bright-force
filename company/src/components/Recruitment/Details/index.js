import React, { useState, useEffect } from 'react';
import { Layout, Tabs } from 'antd';
import '@ant-design/compatible/assets/index.css';
import SidePanel from './SidePanel'
import Candidates from './Candidates'
import PoolRequest from './PoolRequest'
import Shortlist from './Shortlist'
import Interview from './Interview'
import { getCompanyPositionDetails, getRecruitmentCandidatesList } from '../../../actions/positions'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router";
import moment from 'moment'
import AccountManagerCard from '../AccountManager/AccountManagerCard'
import OfferCard from './OfferCard'
import { useHistory, useLocation } from 'react-router-dom'
import { MOMENT_DATE_FORMAT } from '../../../common/constants'

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

const GroupTabs = ({
	onChangeGroupTabsPaneKey,
	tabKey
}) => {
	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)
	return (
		<Tabs onChange={onChangeGroupTabsPaneKey} defaultActiveKey={tabKey} activeKey={tabKey}>
			{companyPositionDetails?.groupsInfo && companyPositionDetails?.groupsInfo?.map((obj, index) => {
				let dispatchedDate = moment(obj.dispatchDate).format(MOMENT_DATE_FORMAT)
				return <TabPane tab={`${'Group ' + (index + 1) + ` (${dispatchedDate})`}`} key={index + 1}>
				</TabPane>
			})}
		</Tabs>
	)
}

const RecruitmentDetails = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const positionId = id;
	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)
	const recruitmentCandidatesList = useSelector(state => state.positions.recruitmentCandidatesList)
	const [longListCandidates, setLongListCandidates] = useState([])
	const [shortListCandidates, setShortListCandidates] = useState([])
	const [interviewCandidates, setInterviewCandidates] = useState([])
	const [activeGroupTabKey, setActiveGroupTabKey] = useState("1")
	const history = useHistory();


	let query = new URLSearchParams(useLocation().search)
	let currentTab = query.get('tab')

	const [tabPaneKey, setTabPaneKey] = useState(currentTab ? currentTab : "candidates")


	useEffect(() => {
		dispatch(getCompanyPositionDetails(positionId))
	}, [])

	useEffect(() => {
		const candidatesLongList = recruitmentCandidatesList && recruitmentCandidatesList.filter(candidate => candidate.status === 'long-list')
		setLongListCandidates(candidatesLongList)
		const candidatesShortList = recruitmentCandidatesList && recruitmentCandidatesList.filter(candidate => candidate.status === 'short-list')
		setShortListCandidates(candidatesShortList)
		const candidatesInterviewList = recruitmentCandidatesList && recruitmentCandidatesList.filter(candidate => candidate.status === 'interview')
		setInterviewCandidates(candidatesInterviewList)
	}, [recruitmentCandidatesList])

	useEffect(() => {
		getFirstGroupData()
	}, [companyPositionDetails])


	const onChangeGroupTabsPaneKey = (key) => {
		setActiveGroupTabKey(key)
		if (companyPositionDetails?.groupsInfo?.length > 0) {
			let obj = {
				"groupId": companyPositionDetails?.groupsInfo?.[key - 1]?._id
			}
			dispatch(getRecruitmentCandidatesList(obj, positionId))
		}
	}

	const onSetTabsPaneKey = (key) => {
		history.push('/company/hire/recruitment/details/' + id + '?tab=' + key)
		setTabPaneKey(key)
		getFirstGroupData()
		setActiveGroupTabKey("1")
	}

	const getFirstGroupData = () => {
		if (companyPositionDetails?.groupsInfo?.length > 0) {
			let obj = {
				"groupId": companyPositionDetails?.groupsInfo?.[0]?._id
			}
			dispatch(getRecruitmentCandidatesList(obj, positionId))
		}
	}

	return (
		<div style={{ padding: '25px 15px' }}>
			<Layout>
				<Sider
					breakpoint="lg"
					collapsedWidth="0"
					onBreakpoint={broken => {
						// console.log(broken);
					}}
					onCollapse={(collapsed, type) => {
						console.log(collapsed, type);
					}}
					theme='light'
					width={300}
				>
					<SidePanel
						positionId={positionId}
						onSetTabsPaneKey={onSetTabsPaneKey}
					/>
					<div className="my-5">
						<OfferCard />
					</div>
					<div className="my-5">
						<AccountManagerCard />
					</div>
				</Sider>
				<Layout>
					<Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
						<div style={{ backgroundColor: 'white', marginLeft: '25px', borderRadius: '7px', padding: '15px' }}>
							{companyPositionDetails?.groupsInfo?.length === 0 || companyPositionDetails?.groupsInfo?.[0] === undefined
								? <PoolRequest companyPositionDetails={companyPositionDetails} />
								: <Tabs onChange={onSetTabsPaneKey} type="card" defaultActiveKey={tabPaneKey} activeKey={tabPaneKey}>
									<TabPane tab="Candidates" key="candidates">
										<GroupTabs onChangeGroupTabsPaneKey={onChangeGroupTabsPaneKey} tabKey={activeGroupTabKey} />
										<Candidates longListCandidates={longListCandidates} />
									</TabPane>
									<TabPane tab="Shortlist" key="shortlist">
										<GroupTabs onChangeGroupTabsPaneKey={onChangeGroupTabsPaneKey} tabKey={activeGroupTabKey} />
										<Shortlist shortListCandidates={shortListCandidates} />
									</TabPane>
									<TabPane tab="Interview" key="interview">
										<GroupTabs onChangeGroupTabsPaneKey={onChangeGroupTabsPaneKey} tabKey={activeGroupTabKey} />
										<Interview interviewCandidates={interviewCandidates} />
									</TabPane>
									<TabPane tab="Hire" key="hire">
										{/* <GroupTabs onChangeGroupTabsPaneKey={onChangeGroupTabsPaneKey} tabKey={activeGroupTabKey} />
										<Interview interviewCandidates={interviewCandidates} /> */}
									</TabPane>
								</Tabs>
							}
						</div>

					</Content>
				</Layout>
			</Layout>
		</div>
	)
}
export default RecruitmentDetails;

