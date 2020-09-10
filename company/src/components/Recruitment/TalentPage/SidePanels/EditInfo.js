import React from 'react';
import '@ant-design/compatible/assets/index.css';
import '../../recruitment.scss'
// import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Row } from 'antd'
import { useHistory } from "react-router-dom";

const EditInfoSidePanel = ({
	companyPositionDetails,
	posRole,
	posEmployment
}) => {
	const history = useHistory();

	const gotoPositionPage = (id) => {
		history.push(`/company/hire/recruitment/edit-position/${id}`);
	}

	return (
		<div style={{ backgroundColor: '#5986B0', padding: 20 }}>
			<div style={{ textAlign: 'center', marginBottom: '5px', paddingBottom: '5px' }}>
				<Row justify="space-between">

					<h6>
						{/* <Link to={'/company/hire/recruitment/edit-position/' + companyPositionDetails?._id}>  */}
						{companyPositionDetails?.title}
						{/* </Link> */}
					</h6> <div style={{ cursor: "pointer" }} >
						<EditOutlined style={{ fontSize: "26px", marginBottom: 10 }} onClick={() => gotoPositionPage(companyPositionDetails?._id)} />
					</div>
				</Row>
				<h6>{posRole}, {posEmployment}</h6>
				{/* <h6><Link to={'/company/hire/recruitment/edit-position/' + companyPositionDetails?._id}>Position Location: {companyPositionDetails?.companyId?.location}</Link></h6> */}
			</div>
		</div>

	)
}
export default EditInfoSidePanel;

