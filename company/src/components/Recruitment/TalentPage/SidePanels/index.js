import React from 'react';
import '@ant-design/compatible/assets/index.css';
import NewRequestStateSidePanel from './NewRequestState'
import OtherCompaniesOffers from './OtherCompaniesOffers'
import EditInfo from './EditInfo'
import '../../recruitment.scss'
import { Link } from 'react-router-dom';

const SidePanel = ({
	companyPositionDetails,
	posEmployment, posRole,
	talentName
}) => {

	return (
		<div>
			<EditInfo companyPositionDetails={companyPositionDetails} posEmployment={posEmployment} posRole={posRole} />
			<NewRequestStateSidePanel talentName={talentName} />
			<OtherCompaniesOffers />
		</div>

	)
}
export default SidePanel;

