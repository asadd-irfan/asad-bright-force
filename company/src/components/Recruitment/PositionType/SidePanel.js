import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import '../recruitment.scss';
import { useSelector, useDispatch } from 'react-redux'
import { getActivePositions, setSelectedPositionId } from '../../../actions/positions'
import { useHistory } from 'react-router-dom';

function SidePanel({
	openPositionModal
}) {
	const history = useHistory();
	const [positions, setPositions] = useState(null);
	const dispatch = useDispatch()
	const appConfigs = useSelector(state => state.auth.appConfigs);
	const rolesOptions = appConfigs && appConfigs['roles']
	const companyPositions = useSelector(state => state.positions.allCompanyPositions);

	useEffect(() => {
		dispatch(getActivePositions())
	}, [])

	useEffect(() => {
		let positionsArr = []
		companyPositions && companyPositions.map((pos) => {
			rolesOptions && rolesOptions.filter((role) => {
				if (role._id === pos.name._id) {
					positionsArr.push({
						id: pos._id,
						name: role.name,
						title: pos.title,
						employment: pos.employmentType
					})
				}
			})

		})
		setPositions(positionsArr)
	}, [companyPositions, rolesOptions])

	const goToDetails = (key) => {
		history.push(`/company/hire/recruitment/details/${key}`);
		dispatch(setSelectedPositionId(key))
	}

	return (
		<>
			<div style={{ margin: '15px' }}>
				<h3>Your Positions</h3>
				<div>
					<div style={{ margin: '10px 0px' }}>
						<Button type='primary' onClick={openPositionModal}>+ New Position</Button>
					</div>
					<div>
						{positions && positions.map((pos, index) => {
							// console.log('pospospos',pos)
							return <div style={{ margin: '30px 0px', }} key={index} onClick={() => goToDetails(pos?.id)} className='position-heading' >
								<h6
									style={{ margin: '20px 0px', display: 'inline' }}
								>{pos?.title}
								</h6><br />

								<h6
									style={{ margin: '20px 0px', display: 'inline' }}
								>{pos?.name}
								</h6>, &nbsp;

                <h6
									style={{ margin: '20px 0px', display: 'inline' }}
								>{pos?.employment?.name}

								</h6>

							</div>
						})}
					</div>

				</div>
			</div>
		</>
	)
}

export default SidePanel;