import React, { useEffect } from 'react';
import { Row, Col, Input, Button, InputNumber, Select, Form, notification } from 'antd';
import '../../recruitment.scss'
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;

function OfferDetails({ talentName }) {

	const dispatch = useDispatch();
	const history = useHistory();
	const [form] = Form.useForm();
	const selectedPositionRecruitment = useSelector(state => state.positions.selectedPositionRecruitment);
	const companyPositionOffer = useSelector(state => state.positions.companyPositionOffer);
	const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails);
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const currencyOptions = appConfigs && appConfigs['currency']
	const positionOfferOptions = appConfigs && appConfigs['position-offer']
	const btnLoading = useSelector(state => state.company.btnLoading);

	useEffect(() => {
		form.setFieldsValue({
			// offerLetter: `Dear ${talentName && talentName}, I was highly impressed by your resume and would like to invite you to interview to position of ${companyPositionDetails?.title} in our company. `,
			offerLetter: companyPositionOffer?.offerLetter,
			salary: companyPositionOffer?.salary ? companyPositionOffer?.salary : '',
			currency: companyPositionOffer?.currency ? companyPositionOffer?.currency : '',
			signingBonus: companyPositionOffer?.signingBonus ? companyPositionOffer?.signingBonus : '',
			equity: companyPositionOffer?.equity ? companyPositionOffer?.equity : '',
			performanceBonus: companyPositionOffer?.performanceBonus ? companyPositionOffer?.performanceBonus : '',
		});

	}, [companyPositionDetails])


	return (
		<>
			<Form
				form={form}
			// onFinish={handleSubmit}
			>
				<div style={{ margin: '15px', textAlign: 'center', marginBottom: '25px', paddingBottom: '35px' }}>
					<h3>Request Sent</h3>
					<b>Your request was sent to the talent and is pending his approval</b>
				</div>

				<div style={{ margin: '15px', marginTop: '25px' }}>
					<div style={{ margin: '20px 0px' }}>
						<Row>
							<Col xs={10} sm={10} md={10} lg={10}>
								Salary
                      </Col>
							<Col xs={10} sm={10} md={10} lg={10}>
								<Form.Item name='salary' rules={
									[
										{
											required: true,
											message: "Please input Salary"
										}
									]
								}>

									<InputNumber style={{ width: '100%' }} type="number" disabled />
								</Form.Item>

							</Col>
						</Row>


						<Row>
							<Col xs={10} sm={10} md={10} lg={10}>
								Currency
                      </Col>
							<Col xs={10} sm={10} md={10} lg={10}>
								<Form.Item name='currency' rules={
									[
										{
											required: true,
											message: "Please select Currency"
										}
									]
								}>
									<Select disabled
										showSearch
										allowClear
										placeholder="Select a Currency"
										optionFilterProp="children"
										style={{ width: 150 }}
										filterOption={(input, option) =>
											option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
									>
										{currencyOptions && currencyOptions.map((item, index) => {
											return <Option key={index} value={item._id}>{item.name}</Option>
										})}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col xs={10} sm={10} md={10} lg={10}>
								Equity
                      </Col>
							<Col xs={10} sm={10} md={10} lg={10}>
								<Form.Item name='equity' rules={
									[
										{
											required: true,
											message: "Please select Equity"
										}
									]
								}>
									<Select disabled
										showSearch
										allowClear
										placeholder="Select Equity"
										optionFilterProp="children"
										style={{ width: 150 }}
										filterOption={(input, option) =>
											option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
									>
										{positionOfferOptions && positionOfferOptions.map((item, index) => {
											return <Option key={index} value={item._id}>{item.name}</Option>
										})}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col xs={10} sm={10} md={10} lg={10}>
								Performance bonus (% out of 100)
                      </Col>
							<Col xs={10} sm={10} md={10} lg={10}>
								<Form.Item name='performanceBonus' rules={
									[
										{
											required: true,
											message: "Please select Performance Bonus"
										}
									]
								}>
									<InputNumber style={{ width: '100%' }} type="number" disabled />
								</Form.Item>

							</Col>
						</Row>

						<Row>
							<Col xs={10} sm={10} md={10} lg={10}>
								Signing bonus
                      </Col>
							<Col xs={10} sm={10} md={10} lg={10}>
								<Form.Item name='signingBonus' rules={
									[
										{
											required: true,
											message: "Please select Sign Bonus"
										}
									]
								}>
									<Select disabled
										showSearch
										allowClear
										placeholder="Select a Bonus"
										optionFilterProp="children"
										style={{ width: 150 }}
										filterOption={(input, option) =>
											option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
									>
										{positionOfferOptions && positionOfferOptions.map((item, index) => {
											return <Option key={index} value={item._id}>{item.name}</Option>
										})}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</div>


					<Row style={{ marginBottom: '9px' }}>
						<Col xs={24} sm={24} md={24} lg={24}>
							<h6>Letter to Candidate</h6>
							<Form.Item name='offerLetter'>
								<TextArea rows={8} disabled />
							</Form.Item>

						</Col>
					</Row>




				</div>
			</Form>
		</>
	)
}

export default OfferDetails;
