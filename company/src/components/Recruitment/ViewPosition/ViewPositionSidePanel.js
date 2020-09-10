import React from 'react';
import { Button } from 'antd';
import '../recruitment.scss';
import lookingPosition from '../../../assets/img/looking-position.png'
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux";

function SidePanel({ positionId, positionTitle }) {
	const history = useHistory();
  const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails);

	const goToEditPositionPage = () => {
		history.push(`/company/hire/recruitment/edit-position/${positionId}`);
	}
	const goToRequirementsPage = () => {
		history.push(`/company/hire/recruitment/details/${positionId}`);
	}
	return (

		<div style={{ margin: '15px', textAlign: 'center' }}>
			<h5 style={{ borderBottom: '1px solid', marginBottom: '35px' }}>{positionTitle}</h5>
			<h4 style={{ marginBottom: '35px' }}>We are working on your pool request</h4>
			<div style={{ marginBottom: '45px' }}>
				<p>The Position is now sent to our account manager.</p>

				<p>Every [3] days we will send out a fresh batch(group) of technically assed candidates that are matched using our algorithm and human curators.</p>

				<p>days until the next group is sent: 2</p>
			</div>

			<div style={{ marginBottom: '25px' }}>
				<Button type='primary' onClick={goToEditPositionPage}>
					Edit Position Requirements
			</Button>
				</div>
				<div style={{ marginBottom: '25px' }}>
					<Button type='primary' onClick={goToRequirementsPage}>
						Go To Recruitment Page
                      </Button>
				</div>
				<div style={{ marginBottom: '105px' }}>
					<p>Note that editing the position requirements will require our talent managers to rework on the position. (the time until next group will be restart)
					For any questions, issues, and concerns contact your account manager at {companyPositionDetails?.assignedAccountManager?.email}</p>

				</div>
				<div style={{ marginBottom: '45px' }}>
					<img src={lookingPosition} width='150px' height='120px' />
				</div>
			</div>

	)
}

export default SidePanel;
