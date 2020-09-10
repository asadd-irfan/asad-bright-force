import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import '@ant-design/compatible/assets/index.css';
import { getTalentById } from '../../../actions/talent'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SidePanel from './SidePanels/index'
import TalentDetails from './TalentDetails/index'
import '../recruitment.scss'
import { getPosCandidateById, getCompanyPositionDetails } from '../../../actions/positions'

const { Content, Sider } = Layout;


const TalentPage = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { id } = useParams();
	const posCandidateId = id;

	const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const configRoleOptions = appConfigs && appConfigs['roles']
	const employmentOptions = appConfigs && appConfigs['employment-type']
	const [posRole, setPosRole] = useState();
	const [posEmpType, setPosEmpType] = useState();

	useEffect(() => {
		dispatch(getPosCandidateById(posCandidateId))
	}, [])

	useEffect(() => {
		dispatch(getCompanyPositionDetails(selectedPositionRecruitment?.position))
		dispatch(getTalentById(selectedPositionRecruitment?.candidateId?._id))
	}, [selectedPositionRecruitment])
	// console.log('selectedPositionRecruitment', selectedPositionRecruitment)

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
			<div style={{ padding: '5px 10px' }}>
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
						width={280}
					>
						<SidePanel talentName={selectedPositionRecruitment?.candidateId?.name} companyPositionDetails={companyPositionDetails} posEmployment={posEmpType} posRole={posRole} />
					</Sider>
					<Layout>
						<Content style={{ margin: '0' }}>
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
export default TalentPage;

