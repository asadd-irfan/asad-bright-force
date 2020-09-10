import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Form, Radio, Row, Col, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { createPosition, getAllPositionsByType, getAllCompanyPositions } from '../../../actions/positions'
import { useHistory } from 'react-router-dom';


function CreatePosition(props) {
	const history = useHistory();
	const [form] = Form.useForm();
	const dispatch = useDispatch()
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const latestCreatedCompanyPosition = useSelector(state => state.positions.latestCompanyPosition);
	const rolesOptions = appConfigs && appConfigs['roles']
	const btnLoading = useSelector(state => state.company.btnLoading);


	const handleSubmit = values => {
		let obj = {
			name: values.position
		}
		dispatch(createPosition(obj)).then(
			() => {
				// dispatch(getAllCompanyPositions())
				// dispatch(getAllPositionsByType())
			}
		);
	};

	useEffect(() => {
		if (latestCreatedCompanyPosition !== null) {
			history.push(`/company/hire/recruitment/edit-position/${latestCreatedCompanyPosition?._id}`);
		}
	}, [latestCreatedCompanyPosition])

	// const openPositionModal = () => {
	//   props.setPositionModal(true)
	// };

	const handlePositionModalCancel = () => {
		props.setPositionModal(false)
	};


	return (
		<div >

			<Modal
				title="Add new Position"
				visible={props.positionModal}
				onCancel={handlePositionModalCancel}
				footer={[]}
			>
				<div style={{ backgroundColor: 'white', marginLeft: '25px', borderRadius: '7px', padding: '15px' }}>
					<h3>What are you looking for?</h3>
					<Form
						layout={'vertical'}
						form={form}
						onFinish={handleSubmit}
					>

						<Row style={{ marginTop: '20px' }}>
							<Col xs={24} sm={24} md={24} lg={24}>
								<div>
									<Form.Item name='position'>
										<Radio.Group style={{ width: '100%' }}>
											<Row>
												{rolesOptions ? rolesOptions.map((radio, index) => {
													return (
														<Col xs={24} sm={24} md={12} lg={12} key={index}>
															<Radio value={radio._id} key={radio._id} >
																{radio.name}
															</Radio >
														</Col>
													);
												}) : <div>Loading...</div>}
											</Row>
										</Radio.Group>
									</Form.Item>
								</div>
							</Col>
						</Row>


						<Row>
							<Col xs={12} sm={12} md={12} lg={12}>
								<Form.Item>
									<Button type='primary' htmlType='submit' loading={btnLoading}>
										Create Position
                                </Button>
								</Form.Item>
							</Col>
							<Col xs={10} sm={10} md={10} lg={10} />
						</Row>
					</Form>
				</div>
			</Modal>
		</div>
	)
}

export default CreatePosition;
