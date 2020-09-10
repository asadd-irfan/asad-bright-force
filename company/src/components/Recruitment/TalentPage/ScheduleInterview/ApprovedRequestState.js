import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import '../../recruitment.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getPosOfferById, getPosCandidateById } from '../../../../actions/positions'
import { useParams } from "react-router";

const { Paragraph } = Typography;

function ApprovedRequestState({
	onChangeShowCalendar
}) {
	const dispatch = useDispatch();
	const { id } = useParams();
	const posCandidateId = id;

	const selectedTalent = useSelector(state => state.talents.selectedTalent)
	const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
	const companyPositionOffer = useSelector(state => state.positions.companyPositionOffer);

	useEffect(() => {
		dispatch(getPosCandidateById(posCandidateId))
	}, [])

	useEffect(() => {
		dispatch(getPosOfferById(selectedPositionRecruitment?.positionOffer))
	}, [selectedPositionRecruitment])

	return (
		<>
			<div style={{ margin: '15px', textAlign: 'center', marginBottom: '25px', paddingBottom: '35px' }}>
				<h4>Schedule an Interview</h4>
			</div>

			<div style={{ margin: '15px', marginTop: '25px' }}>
				<Paragraph>
					Candidate '{selectedTalent?.name}' is interested in your company
      </Paragraph>
				<h6>Candidate Message:</h6>
				<Paragraph>
					{companyPositionOffer?.candidateMessage}
				</Paragraph>

				<Row style={{ margin: '25px 0px' }}>
					<Col xs={24} sm={24} md={24} lg={24} style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
						<Button style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
							type='primary'
							block
							onClick={() => onChangeShowCalendar(true)}
						>
							Schedule interview with {selectedTalent?.name}
						</Button>
					</Col>
				</Row>

				<Paragraph>
					Once a time has been confirmed you will be notified via mail and a meeting will be created in your calendar
      </Paragraph>
			</div>

		</>
	)
}

export default ApprovedRequestState;
