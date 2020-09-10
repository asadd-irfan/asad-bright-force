import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import '@ant-design/compatible/assets/index.css';
import { ArrowLeftOutlined } from "@ant-design/icons";
import TalentDetails from '../TalentPage/TalentDetails/index'
import OfferSent from '../TalentPage/SidePanels/OfferSent'
import ResendOffer from './ResendOffer'
import EditInfo from '../TalentPage/SidePanels/EditInfo'
import { useDispatch, useSelector } from 'react-redux';
import { getPosCandidateById, getCompanyPositionDetails, getPosOfferById } from '../../../actions/positions'
import { getTalentById } from '../../../actions/talent'
import { useParams, useHistory } from "react-router";

const { Content, Sider } = Layout;


const ViewOffer = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams();
	const posCandidateId = id;
	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)
	const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
	const companyPositionOffer = useSelector(state => state.positions.companyPositionOffer);
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const configRoleOptions = appConfigs && appConfigs['roles']
	const employmentOptions = appConfigs && appConfigs['employment-type']
	const [posRole, setPosRole] = useState();
	const [posEmpType, setPosEmpType] = useState();

	// console.log('companyPositionOffer', companyPositionOffer)
	useEffect(() => {
		dispatch(getPosCandidateById(posCandidateId))
	}, [])

	useEffect(() => {
		dispatch(getTalentById(selectedPositionRecruitment?.candidateId?._id))
		dispatch(getCompanyPositionDetails(selectedPositionRecruitment?.position))
		dispatch(getPosOfferById(selectedPositionRecruitment?.positionOffer))
	}, [selectedPositionRecruitment])


	useEffect(() => {

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

	}, [companyPositionDetails])

	// console.log('companyPositionDetails', companyPositionDetails)

	return (
		<div>

			<div style={{ padding: '0px 15px' }}>
				<Row>
					<Col xs={2} sm={2} md={6} lg={6}>

					</Col>
					<Col xs={22} sm={22} md={5} lg={5}>
						<div style={{ padding: '5px' }}>
							<span className="go-back" onClick={() => {
								history.goBack()
							}}><ArrowLeftOutlined /> &nbsp;&nbsp;<strong>Back</strong></span>
						</div>
					</Col>
				</Row>
			</div>
			<div style={{ padding: '5px 15px' }}>
				<Layout>
					<Sider
						breakpoint="lg"
						collapsedWidth="0"
						onBreakpoint={broken => {
							console.log(broken);
						}}
						onCollapse={(collapsed, type) => {
							console.log(collapsed, type);
						}}
						theme='light'
						width={300}
					>

						<EditInfo companyPositionDetails={companyPositionDetails} posEmployment={posEmpType} posRole={posRole} />
						{selectedPositionRecruitment?.status === 'short-list' && selectedPositionRecruitment?.shortListStatus !== 'rejected' && <OfferSent talentName={selectedPositionRecruitment?.candidateId?.name} />}
						{selectedPositionRecruitment?.shortListStatus === 'rejected' && <ResendOffer talentName={selectedPositionRecruitment?.candidateId?.name} companyPositionOffer={companyPositionOffer} />}
					</Sider>
					<Layout>
						<Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
							<div style={{ backgroundColor: 'white', marginLeft: '25px', borderRadius: '7px', padding: '15px' }}>
								<TalentDetails />
							</div>
						</Content>
					</Layout>
				</Layout>
			</div>
		</div>

	)
}
export default ViewOffer;

