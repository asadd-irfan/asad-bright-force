import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import '../../recruitment.scss'
import { getPosOfferById, getPosCandidateById } from '../../../../actions/positions'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router";

function OfferDetails() {

	const dispatch = useDispatch();
	const { id } = useParams();
	const posCandidateId = id;

	const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
	useEffect(() => {
		dispatch(getPosCandidateById(posCandidateId))
	}, [])


	const appConfigs = useSelector(state => state.auth.appConfigs);
	const currencyOptions = appConfigs && appConfigs['currency']
	const positionOfferOptions = appConfigs && appConfigs['position-offer']
	const companyPositionOffer = useSelector(state => state.positions.companyPositionOffer);
	const [monthlySalary, setMonthlySalary] = useState(0)

	useEffect(() => {
		dispatch(getPosOfferById(selectedPositionRecruitment?.positionOffer))
	}, [selectedPositionRecruitment])
	useEffect(() => {
		if (companyPositionOffer?.salary) {
			let salary = companyPositionOffer?.salary / 12;
			salary = salary.toFixed(0)
			setMonthlySalary(salary);
		}
	}, [companyPositionOffer])
	function numberWithCommas(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	return (
		<>
			<div style={{ marginTop: '25px', textAlign: 'center', backgroundColor: "#5986B0", padding: 10 }}>
				<h4>Offer Details</h4>
			</div>
			<div style={{ marginTop: '5px', padding: '10px', borderBottom: '1px solid' }}>
				<Row>
					<Col xs={10} sm={10} md={10} lg={10}>
						<b>Salary:</b>
					</Col>
					<Col xs={14} sm={14} md={14} lg={14}>
						{companyPositionOffer?.salary} <br />
						({numberWithCommas(monthlySalary)} {currencyOptions && currencyOptions.map((currency, index) => {
							if (currency._id === companyPositionOffer?.currency) {
								return <span key={index}>{currency.name} </span>
							}

						})} per month)

					</Col>
				</Row>


				<Row>
					<Col xs={10} sm={10} md={10} lg={10}>
						<b>Equity:</b>
					</Col>
					<Col xs={14} sm={14} md={14} lg={14}>
						{positionOfferOptions && positionOfferOptions.map((pos, index) => {
							if (pos._id === companyPositionOffer?.equity) {
								return <span key={index}>{pos.name} </span>
							}

						})}
					</Col>
				</Row>

				<Row>
					<Col xs={16} sm={16} md={16} lg={16}>
						<b>Performance Bonus:</b>

					</Col>
					<Col xs={8} sm={8} md={8} lg={8}>
						{companyPositionOffer?.performanceBonus}{companyPositionOffer?.performanceBonus ? companyPositionOffer?.performanceBonus === 0 ? '' : '%' : '%'}
					</Col>
				</Row>

				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<b>Signing Bonus:</b>
					</Col>
					<Col xs={12} sm={12} md={12} lg={12}>
						{positionOfferOptions && positionOfferOptions.map((pos, index) => {
							if (pos._id === companyPositionOffer?.equity) {
								return <span key={index}>{pos.name} </span>
							}

						})}
					</Col>
				</Row>

			</div>

		</>
	)
}

export default OfferDetails;
