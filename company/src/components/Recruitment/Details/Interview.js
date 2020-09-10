import React, { useState } from 'react';
import { Button, Row, Col, Avatar, Modal } from 'antd'
import lookingPosition from '../../../assets/img/looking-position.png'
import { useHistory } from 'react-router-dom'
import TalentDetails from './TalentDetails';
import '@ant-design/compatible/assets/index.css';
import { setSelectedPositionRecruitment, changeInterviewResult } from '../../../actions/positions'
import { useDispatch } from 'react-redux';


const Interview = ({
	interviewCandidates,
}) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const [interviewStatusModalVisible, setInterviewStatusModalVisible] = useState(false)
	const [currentInterviewStatus, setCurrentInterviewStatus] = useState(null)
	const [currentPositionRec, setCurrentPositionRec] = useState(null)

	const onChangeInterviewResult = (status, positionRec) => {
		setCurrentInterviewStatus(status)
		setCurrentPositionRec(positionRec)
		setInterviewStatusModalVisible(true)
	}

	const handleInterviewStatusModalOk = () => {
		let obj = {
			"status": currentInterviewStatus
		}
		dispatch(changeInterviewResult(obj, currentPositionRec)).then(() => {
			setInterviewStatusModalVisible(false)
			setCurrentInterviewStatus(null)
			setCurrentPositionRec(null)
		})

	}
	const handleInterviewStatusModalCancel = () => {
		setInterviewStatusModalVisible(false)
		setCurrentInterviewStatus(null)
		setCurrentPositionRec(null)
	}

	return (
		<div style={{ margin: '10px 0px' }}>
			{interviewCandidates && interviewCandidates?.length > 0 ? interviewCandidates.map((positionRec, index) => {
				{/* console.log('positionRec', positionRec) */ }
				let talent = positionRec?.candidateId
				return <div key={index} style={{ border: '2px solid', margin: '20px 0px', backgroundColor: 'white' }}>
					<Row>
						<Col xs={24} sm={24} md={16} lg={16} style={{ padding: '15px' }}>
							<TalentDetails talentDetails={talent} positionRec={positionRec} />
						</Col>

						<Col xs={24} sm={24} md={8} lg={8} className="talent-list-flex-wrapper" style={{ padding: '15px' }}>
							<div className="talent-list-flex" style={{ width: '100%' }}>
								<Row>
									<Col xs={24} sm={24} md={24} lg={24}>
										<div style={{ float: 'right' }}>
											{positionRec?.interviewStatus == 'scheduled' &&
												<Row>

													<span style={{ borderRadius: '5%', backgroundColor: "#20C997", width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
													</span>

													<span className="mt-1"><b>Status: </b> Interview Scheduled</span>
												</Row>}
											{positionRec?.interviewStatus == 'time-passed' &&
												<Row>

													<span style={{ borderRadius: '5%', backgroundColor: "#FFAE00", width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
													</span>

													<span className="mt-1"><b>Status: </b> Interview Time Passed</span>
												</Row>}
											{positionRec?.interviewStatus == 'pass' &&
												<Row>

													<span style={{ borderRadius: '5%', backgroundColor: "green", width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
													</span>

													<span className="mt-1"><b>Status: </b> Passed Interview </span>
												</Row>}
											{positionRec?.interviewStatus == 'fail' &&
												<Row>

													<span style={{ borderRadius: '5%', backgroundColor: "red", width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
													</span>

													<span className="mt-1"><b>Status: </b> Failed Interview </span>
												</Row>}
											{positionRec?.interviewStatus == 'hired' &&
												<Row>

													<span style={{ borderRadius: '5%', backgroundColor: "#1C7BD1", width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
													</span>

													<span className="mt-1"><b>Status: </b> In Hiring Process</span>
												</Row>}
										</div>
									</Col>
								</Row>
								<Row>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Button block onClick={() => {
											history.push('/company/hire/recruitment/talent-page/schedule-interview/' + positionRec?._id)
											dispatch(setSelectedPositionRecruitment(positionRec))
										}} type="default" style={{ margin: '5px' }}>
											View More
									</Button>
									</Col>
								</Row>


							</div>
						</Col>

					</Row>
					<Row>
						{positionRec?.interviewStatus == 'scheduled' && <><Col span={8}>

							<Button block type="primary"
								onClick={() => {
									history.push('/company/hire/recruitment/talent-page/reschedule-interview/' + positionRec?._id)
									dispatch(setSelectedPositionRecruitment(positionRec))
								}}
								style={{ background: "#6FA8DC", borderColor: "#6FA8DC", float: 'right', margin: '5px' }}>
								Reschedule Interview
									</Button>
						</Col>
							<Col span={16}>
								<Button
									block
									type="primary"

									onClick={() => {
										history.push('/company/hire/recruitment/talent-page/schedule-interview/' + positionRec?._id)
										dispatch(setSelectedPositionRecruitment(positionRec))
									}}

									style={{ background: "#45818E", borderColor: "#45818E", margin: '5px' }}>
									Interview Scheduled
									</Button>

							</Col> </>}
						{positionRec?.interviewStatus == 'time-passed' && <><Col span={10}>

							<Button block type="primary"
								onClick={() => onChangeInterviewResult('fail', positionRec)}
								style={{ background: "red", borderColor: "red", float: 'right', margin: '5px' }}>
								Failed  Interview
									</Button>
						</Col>
							<Col span={14}>
								<Button
									block
									type="primary"
									onClick={() => onChangeInterviewResult('pass', positionRec)}

									style={{ background: "#20C997", borderColor: "#20C997", margin: '5px' }}>
									Passed Scheduled
									</Button>

							</Col> </>}
						{positionRec?.interviewStatus == 'pass' && <Col span={24}>

							<Button block type="primary"
								onClick={() => onChangeInterviewResult('hired', positionRec)}
								style={{ background: "rgb(106, 168, 79)", borderColor: "rgb(106, 168, 79)", float: 'right', margin: '5px' }}>
								Hire  Now
									</Button>
						</Col>
						}
						{positionRec?.interviewStatus == 'fail' && <Col span={24}>

							<Button block type="primary"
								style={{ background: "red", borderColor: "red", float: 'right', margin: '5px' }}>
								Failed  Interview
									</Button>
						</Col>
						}
						{positionRec?.interviewStatus == 'hired' && <Col span={24}>

							<Button block type="primary"
								style={{ background: "#1D7DD4", borderColor: "#1D7DD4", float: 'right', margin: '5px' }}>
								View in Hiring
						</Button>
						</Col>
						}

					</Row>
					<Modal
						title="Interview Status"
						visible={interviewStatusModalVisible}
						onOk={handleInterviewStatusModalOk}
						onCancel={handleInterviewStatusModalCancel}
					>
						<p>Are your sure to <b>{currentInterviewStatus}</b> this candidate ?</p>
						<p>Name: <b>{currentPositionRec?.candidateId?.name}</b></p>
						<p>Email: <b>{currentPositionRec?.candidateId?.email}</b></p>
					</Modal>

				</div>
			})
				: <div style={{ margin: '10px 0px' }}>
					<h3>No Interview Candidates found</h3>
				</div>}

		</div>
	)
}
export default Interview;
