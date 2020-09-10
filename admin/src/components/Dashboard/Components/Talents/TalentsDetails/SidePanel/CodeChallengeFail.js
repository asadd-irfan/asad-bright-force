import React from 'react';
import { Button, Input, Row, Col, Form } from 'antd';
import MainInfo from './MainInfo';
import { useDispatch, useSelector } from "react-redux";
import { changeTalentProfileStatus } from '../../../../../../actions/talent'
import { updateCodingChallenge } from '../../../../../../actions/evaluation'

const { TextArea } = Input;

function CodeChallenge({
	mainInfoHeading,
	mainInfoSubHeading,
	mainInfoSubHeadingColor,
	mainInfoLastModified,
	mainInfoContacts,
	talent,
	talentEvaluationDetails
}) {
	const dispatch = useDispatch();
	const btnLoading = useSelector(state => state.talents.btnLoading);
	const codingChallenge = talentEvaluationDetails && talentEvaluationDetails.codingChallenge
	const [form] = Form.useForm();

	const onChangeProfileStatus = (status) => {
		let id = talent && talent._id;
		const obj = {
			profileStatus: status
		}
		dispatch(changeTalentProfileStatus(obj, id))
	}

	const handleSubmit = values => {
		let id = talent && talent._id;
		let allValues = {
			...values,
			result: 'pending',
			isCompleted: false,
			resultDetails: '',
			categoriesScores: [],
		}
		dispatch(updateCodingChallenge(allValues, id));
	};

	return (
		<div>
			<div className='mb-20'>
				<MainInfo
					heading={mainInfoHeading}
					subHeading={mainInfoSubHeading}
					subHeadingColor={mainInfoSubHeadingColor}
					lastModified={mainInfoLastModified}
					contacts={mainInfoContacts}
				/>
			</div>

			<div className='mb-20'>
				<h5>Result</h5>
				<div className='text-center'>
					<a target='_blank' rel='noopener noreferrer' href={codingChallenge && codingChallenge.websiteLink}>
						{codingChallenge && codingChallenge.websiteLink}
					</a>
					<div className='mb-20'>
						{codingChallenge && codingChallenge.resultDetails}
					</div>
					<div>
						{codingChallenge && codingChallenge.categoriesScores.map((obj, index) => (
							<Row key={index}>
								<Col xs={12} sm={12} md={12} lg={12}>
									{obj.name}
								</Col>
								<Col xs={12} sm={12} md={12} lg={12}>
									{obj.percentage}
								</Col>
							</Row>
						))}
					</div>
				</div>


			</div>

			<div>
				<h5>New Test</h5>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					// onFinishFailed={onFinishFailed}
					className="form-wrapper"
				>
					<div>
						{/*<div className='mb-20'>
						<h6>Name</h6>
						 <Form.Item name='name' rules={[
						{
							required: true,
							message: 'Please input Test name',
						},
					]}>
							<Input />
						</Form.Item> 
					</div>*/}
						<div className='mb-20'>
							<h6>Coding Challenge Link</h6>
							<Form.Item name='websiteLink' rules={
								[
									{
										type: "url",
										message: "The input is not valid URL"
									},
									{
										required: true,
										message: 'Please input Test URL',
									},
								]
							}>
								<Input />
							</Form.Item>
						</div>

						<div className='mb-20'>
							<h6>Coding Challenge Description</h6>
							<Form.Item name='instructions'>
								<TextArea rows={7} />
							</Form.Item>
						</div>

						<Row>
							<Col xs={24} sm={24} md={24} lg={24}>
								<Form.Item>
									{talent && talent.profileStatus === 'active' &&
										<div className='text-center'>
											<Button htmlType="submit" loading={btnLoading} type="default" className='btn-green'>
												Send a new Coding Challenge
									</Button>
										</div>}
								</Form.Item>
							</Col>
						</Row>
					</div>
				</Form>
			</div>

			{talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
				<Button loading={btnLoading} type="danger" onClick={() => onChangeProfileStatus('hold')}>
					Move to on hold
                </Button>
			</div>}
			{talent && talent.profileStatus === 'hold' && <div className='text-center mb-20'>
				<Button loading={btnLoading} type="default" className='btn-green' onClick={() => onChangeProfileStatus('active')}>
					Move back to active list
                </Button>
			</div>}
		</div>
	)
}

export default CodeChallenge;
