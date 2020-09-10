import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Typography, Modal, Avatar } from 'antd';
import '../../recruitment.scss'
import { useSelector, useDispatch } from "react-redux";
import { getPosInterviewById, getPosCandidateById } from '../../../../actions/positions'
import moment from 'moment'
import { useParams } from "react-router";
import { useHistory } from 'react-router-dom'
import { MailOutlined } from '@ant-design/icons'
import { MOMENT_DATE_FORMAT } from '../../../../common/constants'

const { Paragraph } = Typography;

function ScheduledInterviewSidePanel() {
	const history = useHistory();
	const [showInterviewModal, setInterviewModal] = useState(false)

	const dispatch = useDispatch();
	const { id } = useParams();
	const posCandidateId = id;

	const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
	const companyPositionInterview = useSelector(state => state.positions.companyPositionInterview);
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const currencyOptions = appConfigs && appConfigs['currency']
	const positionOfferOptions = appConfigs && appConfigs['position-offer']
	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)
	const configRoleOptions = appConfigs && appConfigs['roles']

	const companyPositionOffer = useSelector(state => state.positions.companyPositionOffer)

	const goToCalendarPage = () => {
		history.push('/company/hire/calender')
	}
	const OpenInterviewModal = () => {
		setInterviewModal(true)
	}
	const handleInterviewModalCancel = () => {
		setInterviewModal(false)
	}
	useEffect(() => {
		dispatch(getPosCandidateById(posCandidateId))
	}, [])

	useEffect(() => {
		dispatch(getPosInterviewById(selectedPositionRecruitment?.interviewId))
	}, [selectedPositionRecruitment])

	return (
		<>

			<div style={{ margin: '15px', textAlign: 'center', marginBottom: '25px', paddingBottom: '35px' }}>
				<h4>Scheduled Interview</h4>
			</div>

			<div style={{ margin: '15px', marginTop: '25px' }}>
				<Paragraph>
					Your interview meeting with {selectedPositionRecruitment?.candidateId?.name} is scheduled for ,
      </Paragraph>

				<div style={{ borderLeft: '1px solid', padding: '10px' }}>
					<Paragraph>
						Date: <strong>{moment(companyPositionInterview?.startTime).format(MOMENT_DATE_FORMAT)}</strong>
					</Paragraph>
					<Paragraph>
						Time: <strong>{moment(companyPositionInterview?.startTime).format('hh:mm a')}</strong>
					</Paragraph>
					<Paragraph>
						Format: <strong>{companyPositionInterview?.format}</strong>
					</Paragraph>
					<Paragraph>
						Duration: <strong>{companyPositionInterview?.duration}</strong>
					</Paragraph>

				</div>
				<Row style={{ margin: '25px 0px' }}>
					<Col xs={24} sm={24} md={24} lg={24}>
						{/* <Button
							type='primary'
							block
							onClick={() => goToCalendarPage()}
						>
							View Meetings on Calendar
					</Button> */}
						<Button
							type='primary'
							block
							onClick={() => OpenInterviewModal()}
						>
							View Interview Details
					</Button>
					</Col>
				</Row>

				{/* <Paragraph>
					<strong>	Meeting Details:</strong> {companyPositionInterview?.meetingDetails}
					</Paragraph>
          <Paragraph>
					<strong>	Notes: </strong>{companyPositionInterview?.notes}
					</Paragraph> */}






			</div>

			<Modal
				title="Interview Details"
				onCancel={handleInterviewModalCancel}
				visible={showInterviewModal}
				footer={null}
				style={{ top: 20 }}
			>
				<Row className="m-2">
					<Col span={20}>
						<h4>Interview with: {selectedPositionRecruitment?.candidateId?.name}</h4>
					</Col>
					<Col span={1} />
					<Col span={3}>
						<Button
							type='primary'

							onClick={() => {
								history.push('/company/hire/recruitment/talent-page/reschedule-interview/' + companyPositionInterview?.recruitmentId)
							}}>
							Edit
					</Button>
					</Col>

				</Row>
				<Row className="m-2">
					<h6>Position Title: {companyPositionDetails?.title}</h6>

				</Row>
				<Row className="m-2">
					<b >Your interview is scheduled on {moment(companyPositionInterview?.startTime).format(MOMENT_DATE_FORMAT)} at {moment(companyPositionInterview?.startTime).format('hh:mm a')}</b>

				</Row>
				<Row className="my-4 mx-2">
					<h6>Company Contact Details:</h6>
				</Row>

				<Row className="m-2">
					<Col span={5}>
						<Avatar size={50} icon={<img src={
							companyPositionDetails?.positionCreatedBy?.profileImage.includes("http")
								? companyPositionDetails?.positionCreatedBy?.profileImage
								: `/${companyPositionDetails?.positionCreatedBy?.profileImage}`
						} width='90px' height='80px' />}
						/>
					</Col>
					<Col span={18} className="mt-3">
						<h6>{companyPositionDetails?.positionCreatedBy?.fullName}, {companyPositionDetails?.positionCreatedBy?.title}</h6>
					</Col>
				</Row>
				<Row className="m-2">
					<Col span={5} style={{ marginLeft: 5 }}>
						<MailOutlined style={{ fontSize: 40 }} />

					</Col>
					<Col span={18} className="mt-2">
						<h6>{companyPositionDetails?.positionCreatedBy?.email} </h6>
					</Col>
				</Row>
				<div>
					{companyPositionInterview !== null ?
						<div>
							<>
								<div style={{ marginTop: '5px', padding: '10px', borderTop: '1px solid' }}>



									<Row className="m-2">
										<Col xs={12} sm={12} md={12} lg={12}>
											<b>Format</b><br />
											{companyPositionInterview?.format}


										</Col>

										<Col xs={12} sm={12} md={12} lg={12}>
											<b>Duration</b><br />
											{companyPositionInterview?.duration}

										</Col>

									</Row>

									<Row className="m-2">
										<Col xs={24} sm={24} md={24} lg={24}>
											<b>Meeting Details</b>
										</Col>
										<Col xs={24} sm={24} md={24} lg={24}>
											{companyPositionInterview?.meetingDetails}
										</Col>
									</Row>
									<Row className="m-2">
										<Col xs={24} sm={24} md={24} lg={24}>
											<b>Notes</b>
										</Col>
										<Col xs={24} sm={24} md={24} lg={24}>
											{companyPositionInterview?.notes}
										</Col>
									</Row>
									<Row justify='center' className="my-5">
										<Button
											type='primary'
											block
											onClick={() => goToCalendarPage()}
										>
											View Meetings on Calendar
					</Button>
									</Row>

								</div>

							</>
						</div>
						: <h6>Loading...</h6>
					}
				</div>


			</Modal>
		</>
	)
}

export default ScheduledInterviewSidePanel;
