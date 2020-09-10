import React from 'react';
import { Button } from 'antd';
import '../recruitment.scss';
import happyFaceImg from '../../../assets/img/happy-face.png'
import { useSelector } from "react-redux";
import lookingPosition from '../../../assets/img/looking-position.png'

function SidePanel({
	positionTitle,
	positionRole,
	positionEmpType,
	onSendToAccountManager }) {

	const btnLoading = useSelector(state => state.company.btnLoading);

	return (

		<div style={{ margin: '15px', textAlign: 'center' }}>
			<h5 style={{ marginBottom: '5px' }}>{positionTitle}</h5> <br />
			<h5 style={{ borderBottom: '1px solid', marginBottom: '35px' }}>{positionRole}, {positionEmpType}</h5>
			<div style={{ marginBottom: '45px' }}>
				<p>Note that editing the position requirements will require our talent managers to rework on the position. (the time until next group will be restart)
				<br />
					<br />
				For any questions, issues, and concerns contact your account manager at support@brightfroce.io
				</p>
			</div>
			<div style={{ marginBottom: '45px' }}>

				<img src={happyFaceImg} width='50px' height='50px' />
			</div>
			<div style={{ marginBottom: '25px' }}>
				{/* <Button type='primary' htmlType='submit' loading={btnLoading}>
				Save
			</Button> */}
			</div>

			<div>
				<Button type='primary' onClick={onSendToAccountManager} loading={btnLoading}>
					Send to account manager
			</Button>
			</div>
			<div style={{ margin: '45px' }}>
				<img src={lookingPosition} width='150px' height='100px' />

			</div>
		</div>

	)
}

export default SidePanel;
