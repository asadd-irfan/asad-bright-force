import React from 'react';
import { Button, Input, Form, Row, Col, notification } from 'antd';
import MainInfo from './MainInfo';
import { useDispatch, useSelector } from "react-redux";
import { changeTalentProfileStatus, ApproveTalentProfile } from '../../../../../../actions/talent'
import { updateCodingChallenge, updateVideoInterview } from '../../../../../../actions/evaluation'

const { TextArea } = Input;

function ProfileApproval({
	mainInfoHeading,
	mainInfoSubHeading,
	mainInfoSubHeadingColor,
	mainInfoLastModified,
	mainInfoContacts,
	talent
}) {
	const dispatch = useDispatch();
	const btnLoading = useSelector(state => state.talents.btnLoading);
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
		// if (!talent.isDeveloper) {
		if (values.videoLink === '' || values.videoLink === null || values.videoLink === undefined) {
			notification.error({
				message: 'Error',
				description: 'Add Valid Video Link!!!',
			});
		}
		else {
			dispatch(ApproveTalentProfile(id)).then(() => {
				setTimeout(() => {
					let id = talent && talent._id;
					let allValues = {
						videoLink: values.videoLink,
						result: 'pending',

					};
					console.log('allValues', allValues)
					console.log('id', id)
					dispatch(updateVideoInterview(allValues, id))
				}, 1000);
			});
		}
		// }
		// else {
		// 	dispatch(ApproveTalentProfile(id)).then(() => {
		// 		setTimeout(() => {
		// 			let allValues = values;
		// 			allValues = { ...values, result: 'pending' }
		// 			dispatch(updateCodingChallenge(allValues, id));
		// 		}, 1000);
		// 	});
		// }
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
			<div>
				<h5 className="my-5" style={{ color: '#5992C8' }}>Video Interview Parameters</h5>
			</div>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				// onFinishFailed={onFinishFailed}
				className="form-wrapper"
			>
				<div>
					{/* {talent && talent.isDeveloper &&
						<div>
							<div className='mb-20'>
								<h5>Name</h5>
								<Form.Item name='name' rules={[
									{
										required: true,
										message: 'Please input Test name',
									},
								]}>
									<Input />
								</Form.Item>
							</div>
							<div className='mb-20'>
								<h5>Code Challenge Link</h5>
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
								<h5>Code Challenge Description</h5>
								<Form.Item name='instructions'>
									<TextArea rows={7} />
								</Form.Item>
							</div>

						</div>
					} */}

					<div className='mb-20'>
						<h5>Video Interview Link</h5>
						<Form.Item name='videoLink' rules={
							[
								{
									type: "url",
									message: "The input is not valid URL"
								}
							]
						}>
							<Input />
						</Form.Item>

					</div>


					<Row>
						<Col xs={24} sm={24} md={24} lg={24}>
							<Form.Item>
								{talent && talent.profileStatus === 'active' &&
									<div className='text-center'>
										<Button htmlType="submit" loading={btnLoading} type="default" className='btn-green'>
											Approve Profile and Send Link
										</Button>
									</div>}
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Form>

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

export default ProfileApproval;
