import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import '../recruitment.scss'
import { useSelector } from 'react-redux';
import EditInfo from '../TalentPage/SidePanels/EditInfo'
import LatestMessages from '../LatestMessages/LatestMessages'
import '../recruitment.scss'
import axios from 'axios';

function SidePanel({
	onSetTabsPaneKey,
	positionId
}) {

	const appConfigs = useSelector(state => state.auth.appConfigs);
	const currencyOptions = appConfigs && appConfigs['currency']
	const positionOfferOptions = appConfigs && appConfigs['position-offer']
	const configRoleOptions = appConfigs && appConfigs['roles']
	const roleOptions = appConfigs && appConfigs['preferred-role']
	const employmentOptions = appConfigs && appConfigs['employment-type']

	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)
	const [longListCandidatesCount, setLongListCandidatesCount] = useState(0)
	const [shortListCandidatesCount, setShortListCandidatesCount] = useState(0)
	const [interviewCandidatesCount, setInterviewCandidatesCount] = useState(0)
	const [posRole, setPosRole] = useState();
	const [posEmpType, setPosEmpType] = useState();

	useEffect(() => {
		let longListCandidates = 0
		let shortListCandidates = 0
		let interviewCandidates = 0
		async function fetchData() {

			if (companyPositionDetails?.groupsInfo?.length > 0) {
				for (let i = 0; i < companyPositionDetails?.groupsInfo?.length; i++) {
					let group = companyPositionDetails?.groupsInfo[i]
					let obj = {
						"groupId": group?._id
					}
					const config = {
						headers: {
							'Content-Type': 'application/json'
						}
					};
					const body = JSON.stringify(obj);
					const res = await axios.post('/api/company/position-recruitment/' + positionId, body, config);
					if (res?.data?.result) {
						let recruitmentArray = res?.data?.result
						recruitmentArray && recruitmentArray.map(rec => {
							if (rec.status === 'long-list') {
								longListCandidates = longListCandidates + 1
							}
							if (rec.status === 'short-list') {
								shortListCandidates = shortListCandidates + 1
							}
							if (rec.status === 'interview') {
								interviewCandidates = interviewCandidates + 1
							}
						})
						setLongListCandidatesCount(longListCandidates)
						setShortListCandidatesCount(shortListCandidates)
						setInterviewCandidatesCount(interviewCandidates)
					}
				}
			}
		}
		fetchData();
		if (companyPositionDetails) {
			configRoleOptions && configRoleOptions.filter((role) => {
				if (role._id === companyPositionDetails?.name._id) {
					setPosRole(role.name)
				}
			})
			employmentOptions && employmentOptions.filter((emp) => {
				if (emp._id === companyPositionDetails?.employmentType?._id) {
					setPosEmpType(emp.name)
				}
			})

		}

	}, [companyPositionDetails]);



	return (
		<div >
			<div style={{ border: '2px solid black', borderRadius: '5px', }} >
				<EditInfo companyPositionDetails={companyPositionDetails} posEmployment={posEmpType} posRole={posRole} />
				<div style={{ margin: '15px', marginTop: '25px' }}>
					{/* <Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						Salary
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
						{companyPositionDetails?.positionOffer?.salary}
					</Col>
				</Row>

				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						Currency
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
						{currencyOptions && currencyOptions.map((currency, index) => {
							if (currency._id === companyPositionDetails?.positionOffer?.currency) {
								return <span key={index}>{currency.name} </span>
							}

						})}
					</Col>
				</Row>

				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						Equity
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
						{positionOfferOptions && positionOfferOptions.map((pos, index) => {
							if (pos._id === companyPositionDetails?.positionOffer?.equity) {
								return <span key={index}>{pos.name} </span>
							}

						})}
					</Col>
				</Row>

				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						Performance Bonus
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
						{companyPositionDetails?.performanceBonus}{companyPositionDetails?.performanceBonus ? companyPositionDetails?.performanceBonus === 0 ? '' : '%' : ''}
					</Col>
				</Row> */}

					<Row style={{ margin: '20px 0px' }}>
						<Col xs={0} sm={0} md={5} lg={5}>
						</Col>
						<Col xs={10} sm={10} md={10} lg={10}>
							<span onClick={() => onSetTabsPaneKey('candidates')} className='hover-cursor'>
								Candidates
						</span>

						</Col>
						<Col xs={9} sm={9} md={9} lg={9}>
							<div className='number-circle'>{longListCandidatesCount}</div>
						</Col>
					</Row>
					<Row style={{ margin: '20px 0px' }}>
						<Col xs={0} sm={0} md={5} lg={5}>
						</Col>
						<Col xs={10} sm={10} md={10} lg={10}>
							<span onClick={() => onSetTabsPaneKey('shortlist')} className='hover-cursor'>
								Shortlist
						</span>

						</Col>
						<Col xs={9} sm={9} md={9} lg={9}>
							<div className='number-circle'>{shortListCandidatesCount}</div>

						</Col>
					</Row>
					<Row style={{ margin: '20px 0px' }}>
						<Col xs={0} sm={0} md={5} lg={5}>
						</Col>
						<Col xs={10} sm={10} md={10} lg={10}>
							<span onClick={() => onSetTabsPaneKey('interview')} className='hover-cursor'>
								Interview
						</span>

						</Col>
						<Col xs={9} sm={9} md={9} lg={9}>
							<div className='number-circle'>{interviewCandidatesCount}</div>

						</Col>
					</Row>

				</div>
			</div>
			<LatestMessages positionId={positionId} />
		</div>
	)
}

export default SidePanel;
