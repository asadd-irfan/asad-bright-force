import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import '../../recruitment.scss'
import { getPosCandidateById } from '../../../../actions/positions'
import { getTalentOffers, getTalentById } from '../../../../actions/talent'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router";

function OtherCompaniesOffers() {

	const dispatch = useDispatch();
	const { id } = useParams();
	const posCandidateId = id;
	
	  const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
		const selectedTalent = useSelector(state => state.talents.selectedTalent);
	  const selectedTalentOffers = useSelector(state => state.talents.selectedTalentOffers);

		useEffect(() => {
			dispatch(getPosCandidateById(posCandidateId))
	  }, [])
	
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const currencyOptions = appConfigs && appConfigs['currency']
	const positionOfferOptions = appConfigs && appConfigs['position-offer']
	const companyPositionOffer = useSelector(state => state.positions.companyPositionOffer);

	useEffect(() => {
		dispatch(getTalentOffers(selectedPositionRecruitment?.candidateId?._id))
		dispatch(getTalentById(selectedPositionRecruitment?.candidateId?._id))
	  }, [selectedPositionRecruitment])

	return (
		selectedTalentOffers && selectedTalentOffers.length > 0 && <div style={{ padding: '20px' }}>
			<h5>{selectedTalent?.name} also got offers from:</h5>
			
			{selectedTalentOffers && selectedTalentOffers.map((offer, index) => {
				return	<div key={index} style={{ border: '1px solid', margin: '5px 0px 30px 0px', }}>
			<div style={{ marginTop: '5px', textAlign: 'center' }}>
				<h4>{offer.companyName}</h4>
			</div>
			<div style={{ marginTop: '5px', padding: '10px', borderTop: '1px solid' }}>
				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						<b>Salary:</b>
					</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
						{offer.offerDetails?.salary}
					</Col>
				</Row>
				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
					<b>Currency:</b>
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
					{currencyOptions && currencyOptions.map((currency, index) => {
                    if (currency._id === offer.offerDetails?.currency) {
                        return <span key={index}>{currency.name} </span>
                    }

                })}
					</Col>
				</Row>

				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						<b>Equity:</b>
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
					{positionOfferOptions && positionOfferOptions.map((pos, index) => {
                    if (pos._id === offer.offerDetails?.equity) {
                        return <span key={index}>{pos.name} </span>
                    }

                })}
				</Col>
				</Row>

				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						<b>Performance Bonus:</b>
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
					{offer.offerDetails?.performanceBonus}{offer.offerDetails?.performanceBonus ? offer.offerDetails?.performanceBonus === 0 ? '' : '%' : '%'}
				</Col>
				</Row>

				<Row>
					<Col xs={14} sm={14} md={14} lg={14}>
						<b>Sign Bonus:</b>
				</Col>
					<Col xs={10} sm={10} md={10} lg={10}>
						{positionOfferOptions && positionOfferOptions.map((pos, index) => {
                    if (pos._id === offer.offerDetails?.equity) {
                        return <span key={index}>{pos.name} </span>
                    }

                })}
				</Col>
				</Row>

			</div>

				</div>
			})}
			
		</div>
	)
}

export default OtherCompaniesOffers;
