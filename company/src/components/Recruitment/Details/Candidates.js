import React from 'react';
import { Button, Row, Col, Avatar } from 'antd'
import '@ant-design/compatible/assets/index.css';
import user from '../../../assets/img/user.png'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import '../recruitment.scss'
import TalentDetails from './TalentDetails';
import { setSelectedPositionRecruitment } from '../../../actions/positions';

const Candidates = ({
	longListCandidates,
}) => {
	const history = useHistory();
	const dispatch = useDispatch();
	return (
		<div style={{ margin: '10px 0px' }}>
			{longListCandidates && longListCandidates?.length > 0 ? longListCandidates.map((positionRec, index) => {
				// console.log('positionRec', positionRec)
				let talent = positionRec?.candidateId
				return <div key={index} style={{ border: '2px solid', margin: '20px 0px', backgroundColor: 'white' }}>
					<Row>
						<Col xs={24} sm={24} md={17} lg={17} style={{ padding: '15px' }}>
							<TalentDetails talentDetails={talent} positionRec={positionRec} />
						</Col>

						<Col xs={24} sm={24} md={7} lg={7} className="talent-list-flex-wrapper" style={{ padding: '15px' }}>
							<div className="talent-list-flex" >
								<Row>
									<Col xs={24} sm={24} md={24} lg={24}>
										<div style={{ float: 'right' }}>
											{/* <Avatar size={64} icon={<img src={
												talent?.profileImage.includes("http")
													? talent?.profileImage
													: `/${talent?.profileImage}`
											} width='150px' height='120px' />} /> */}
											<Row>

												<span style={{ borderRadius: '5%', backgroundColor: 'green', width: '15px', height: '15px', marginTop: '8px', marginRight: '7px' }}>
												</span>

												<span className="mt-1"><b>Status:</b> New Candidate</span>
											</Row>

										</div>
									</Col>
								</Row>
								<Row>
									<Col xs={24} sm={24} md={24} lg={24}>
										<Button onClick={() => {
											history.push('/company/hire/recruitment/talent-page/' + positionRec?._id)
											dispatch(setSelectedPositionRecruitment(positionRec))
										}} type="default" >
											View More
								</Button>

									</Col>
								</Row>
							</div>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Button block onClick={() => {
								history.push('/company/hire/recruitment/talent-page/' + positionRec?._id)
								dispatch(setSelectedPositionRecruitment(positionRec))
							}} type="primary" style={{ background: "#6aa84f", borderColor: "#6aa84f" }}>
								Approach Candidate with an Offer
								</Button>

						</Col>
					</Row>
				</div>
			})
				: <div style={{ margin: '10px 0px' }}>
					<h3>No Candidates found</h3>
				</div>}

		</div>
	)
}
export default Candidates;

