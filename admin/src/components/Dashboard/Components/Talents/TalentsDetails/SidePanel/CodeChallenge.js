import React, { useState } from 'react';
import { Button, Input, Modal, Row, Col, InputNumber, notification, Select, Form } from 'antd';
import MainInfo from './MainInfo';
import { useDispatch, useSelector } from "react-redux";
import { changeTalentProfileStatus } from '../../../../../../actions/talent'
import { PlusCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { updateCodingChallenge } from '../../../../../../actions/evaluation';
import { addAppConfigs } from '../../../../../../actions/settings'

const { TextArea } = Input;
const { Option } = Select;

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
	const [resultRemarks, setResultRemarks] = useState('')
	const [deleteModal, setDeleteModal] = useState(false)
	const [scoreModalOpen, setScoreModalOpen] = useState(false)
	let blankCategoryScore = { id: 0, category: '', score: 0 }
	const [categoriesScores, setCategoriesScores] = useState([])
	const [selectedCategoryScore, setSelectedCategoryScore] = useState({ ...blankCategoryScore })
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const allSkills = appConfigs && appConfigs['skills']
	const [configModal, setConfigModal] = useState(false)
	const [form] = Form.useForm();
	const roleOptions = appConfigs && appConfigs['roles']
	// console.log('allSkills', allSkills)

	const onChangeProfileStatus = (status) => {
		let id = talent && talent._id;
		const obj = {
			profileStatus: status
		}
		dispatch(changeTalentProfileStatus(obj, id))
	}


	const updateCodingChallengeResult = (result) => {
		if (categoriesScores.length < 1) {
			notification.error({
				message: 'Error',
				description: 'Add parameter and score First !!!',
			});
		}
		else {
			let categoriesResult = categoriesScores.map(obj => {
				return {
					"name": obj.category,
					"percentage": obj.score
				}
			})
			let id = talent && talent._id;
			let values = {
				result: result,
				resultDetails: resultRemarks,
				categoriesScores: categoriesResult,
				isCompleted: true,
			};
			dispatch(updateCodingChallenge(values, id));
		}

	};


	const onChangeResultRemarks = (e) => {
		setResultRemarks(e.target.value);
	};


	const showScoreModal = () => {
		setScoreModalOpen(true)
		let selectedId = 0;
		if (categoriesScores.length === 0) {
			selectedId = categoriesScores.length + 1;
		}
		else {
			const lastObj = categoriesScores[categoriesScores.length - 1];
			selectedId = lastObj.id + 1;
		}

		setSelectedCategoryScore({
			...selectedCategoryScore,
			id: selectedId
		})
	};

	const cancelScoreModal = () => {
		setScoreModalOpen(false)
		setSelectedCategoryScore({ ...blankCategoryScore })
	};
	const onOkScoreModal = () => {
		setCategoriesScores([...categoriesScores, selectedCategoryScore])
		setScoreModalOpen(true)
		setSelectedCategoryScore({ ...blankCategoryScore })

	};
	console.log('selectedCategoryScore', selectedCategoryScore)
	const cancelDeleteModal = e => {
		setDeleteModal(false);
	};

	const handleOkDeleteModal = e => {
		setDeleteModal(false);
	};

	const showDeleteModal = (id) => {
		let allCategories = categoriesScores.filter(obj => {
			return obj.id !== id
		})
		setCategoriesScores(allCategories)
	};

	const onCategoryChange = (value) => {
		setSelectedCategoryScore({
			...selectedCategoryScore,
			category: value
		})
	};
	const onScoreChange = (value) => {
		setSelectedCategoryScore({
			...selectedCategoryScore,
			score: value
		})
	};
	// console.log('selectedCategoryScore', selectedCategoryScore)
	const openConfigModal = () => {
		setConfigModal(true);
	}


	const handleSubmit = values => {
		let obj = {};

		obj = {
			"name": values.name,
			"type": "skills",
			"weight": values.weight,
			"isBelongTo": values.isBelongToName
		};

		// console.log('obj', obj)
		dispatch(addAppConfigs(obj, values.type)).then(() => {
			setConfigModal(false);
			form.resetFields();
		});

	};

	const handleConfigModalCancel = e => {
		setConfigModal(false);
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
			</div>
			<div className='mb-20'>
				<h5>Coding Challenge link</h5>
				<a target='_blank' rel='noopener noreferrer' href={talentEvaluationDetails && talentEvaluationDetails.codingChallenge && talentEvaluationDetails.codingChallenge.websiteLink}>
					{talentEvaluationDetails && talentEvaluationDetails.codingChallenge && talentEvaluationDetails.codingChallenge.websiteLink}
				</a>
			</div>
			<div>
				<div className='mb-20'>
					<h5>Results</h5>
					<TextArea rows={7} value={resultRemarks} onChange={onChangeResultRemarks} />
				</div>
			</div>

			<div className='mb-10'>
				<h6>Parameter & Score</h6>
				{categoriesScores.map((obj, index) => {

					return (
						<div key={index} className='mb-10'>
							<Row className='word-break'>
								<Col xs={1} sm={1} md={1} lg={1}>

								</Col>
								<Col xs={10} sm={10} md={10} lg={10}>
									{obj.category}
								</Col>
								<Col xs={1} sm={1} md={1} lg={1}>

								</Col>
								<Col xs={9} sm={9} md={9} lg={9}>
									{obj.score}
								</Col>
								<Col xs={1} sm={1} md={1} lg={1}>

								</Col>
								<Col xs={2} sm={2} md={2} lg={2} style={{ bottom: '8px', fontSize: '20px' }} >
									<DeleteOutlined onClick={() => showDeleteModal(obj.id)} />
								</Col>
							</Row>
						</div>
					)
				})}
				<PlusCircleFilled style={{ fontSize: '25px' }}
					onClick={showScoreModal}
				/>
			</div>



			<div>
				{talent && talent.profileStatus === 'active' &&
					<div className='text-center mb-20'>
						<Button loading={btnLoading} type="default" className='btn-green' onClick={() => updateCodingChallengeResult('pass')}>
							Move to Accepted
						</Button>
					</div>}
			</div>

			{talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
				<Button loading={btnLoading} type="danger" onClick={() => updateCodingChallengeResult('fail')}>
					Move To Failed
                </Button>
			</div>}
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

			<Modal
				visible={deleteModal}
				onOk={handleOkDeleteModal}
				onCancel={cancelDeleteModal}
			>
				<h6>Are your sure to delete!</h6>
			</Modal>

			<Modal
				title="Add Category Score"
				visible={scoreModalOpen}
				onOk={onOkScoreModal}
				onCancel={cancelScoreModal}
				footer={null}
			>
				<h6>Add Category:</h6>
				{/* <Input value={selectedCategoryScore.category} onChange={onCategoryChange} /> */}
				<Select
					allowClear
					style={{ width: '100%' }}
					placeholder="Select a skill "
					onChange={onCategoryChange}
					value={selectedCategoryScore.category}
					showSearch
					showArrow={false}
					filterOption={(input, option) =>
						option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
					{allSkills && allSkills.map((skill, index) => {
						return <Option key={index} value={skill.name}>{skill.name}</Option>
					})}
				</Select>

				<h6>Add Score: (out of 100)</h6>
				<InputNumber className='mb-20' style={{ width: '200px' }} type='number' min={0} max={100} value={selectedCategoryScore.score} onChange={onScoreChange} />
				<Row className="m-3">
					<Col xs={5} sm={5} md={5} lg={5}>
						<Button
							type="primary"
							block
							style={{ float: "right" }}
							onClick={() => openConfigModal()}
						>
							Add Skill
                				</Button>
					</Col>
					<Col xs={10} sm={10} md={10} lg={10}></Col>
					<Col xs={4} sm={4} md={4} lg={4}>
						<Button type='default' onClick={cancelScoreModal}>
							Cancel
						</Button>
					</Col>
					<Col xs={1} sm={1} md={1} lg={1}></Col>
					<Col xs={4} sm={4} md={4} lg={4}>
						<Button type='primary' onClick={onOkScoreModal} disabled={(selectedCategoryScore.category === '' || selectedCategoryScore.score < 0 || selectedCategoryScore.score > 100) ? true : false}>
							Add Score
						</Button>
					</Col>
				</Row>
			</Modal>

			<Modal className="lg-modal"
				title="Add a skill"
				visible={configModal}
				footer={null}
				onCancel={handleConfigModalCancel}

			>
				<Row>

					<Col xs={2} sm={2} md={4} lg={4} />

					<Form
						layout={'vertical'}
						form={form}
						onFinish={handleSubmit}
					>
						<Row>
							<Col xs={22} sm={22} md={22} lg={22}>
								<Form.Item label="Skill Name:" name='name' rules={
									[
										{
											required: true,
											message: 'Please input Skill name'
										}
									]
								}>
									<Input placeholder="input Skill name" />
								</Form.Item>
							</Col>


							<Col xs={22} sm={22} md={22} lg={22}>
								<Form.Item label="Skill Weight:" name='weight' rules={
									[
										{
											required: true,
											message: 'Please input Skill weight'
										}
									]
								}>
									<InputNumber style={{ width: '100%' }} type="number" />
								</Form.Item>
							</Col>
							<Col xs={20} sm={20} md={20} lg={20}>

								<h5>Is Belong To: </h5>
							</Col>
							{/* <Col xs={4} sm={4} md={4} lg={4}>
								<Checkbox onChange={onChange}></Checkbox>
							</Col> */}
							<Col xs={22} sm={22} md={22} lg={22}>
								<Form.Item label="Role Type" name='isBelongToName' rules={
									[
										{
											required: true,
											message: 'Please input Is Belong To Role Type'
										}
									]
								}>
									<Select
										allowClear
										style={{ width: '100%' }}
										placeholder="Select role Type "
									// onChange={handleChange}
									>
										{roleOptions && roleOptions.map((role, index) => {
											return <Option key={index} value={role._id}>{role.name}</Option>
										})}
									</Select>
								</Form.Item>
							</Col>


						</Row>
						<Row className="m-3">

							<Col xs={12} sm={12} md={12} lg={12}>
							</Col>
							<Col xs={6} sm={6} md={6} lg={6}>
								<Button
									type="primary"
									block
									style={{ float: "right" }}
									onClick={handleConfigModalCancel}
								>
									Cancel
                </Button>
							</Col>
							<Col xs={0} sm={0} md={1} lg={1}>
							</Col>
							<Col xs={6} sm={6} md={5} lg={5}>
								<Form.Item>
									<Button
										type="primary"
										block
										style={{ float: "right" }}
										htmlType="submit"
									>
										Add
                </Button>
								</Form.Item>
							</Col>
						</Row>


					</Form>

					<Col xs={2} sm={2} md={4} lg={4} />

				</Row>
			</Modal>


		</div>
	)
}

export default CodeChallenge;
