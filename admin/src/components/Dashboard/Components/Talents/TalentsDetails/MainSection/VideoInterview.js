import React, { useState } from "react";
import { Row, Col, Typography, Button } from "antd";
import { useSelector } from "react-redux";
import { VideoCameraOutlined } from '@ant-design/icons';

import './mainSection.scss'

const { Paragraph } = Typography
function VideoInterview() {
	const user = useSelector((state) => state.talents.selectedTalent);
	const talentEvaluation = useSelector(state => state.talents.selectedTalentEvaluation && state.talents.selectedTalentEvaluation);
	const [videoInterview] = useState(talentEvaluation && talentEvaluation.videoInterview)

	return (
		<div>
			<h3>Video Interview  results</h3>
			{
				talentEvaluation && talentEvaluation
					?
					<div className="my-5">
						<Row className="my-5">
							<Col xs={3} sm={3} md={3} lg={3} />
							<Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'center' }}>
								<a href={videoInterview?.resultLink && videoInterview?.resultLink} target='_blank' rel="noopener noreferrer">	<VideoCameraOutlined
									style={{ fontSize: "100px" }}
								/> </a>
							</Col>
							<Col xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }} >
								<Paragraph style={{ marginTop: '20px' }}>
									a picture is worth a thousand words
									a video is worth a million!
									{user?.name} Pre recorded one sided video interview is waiting for you.
										</Paragraph>
							</Col>
						</Row>

					</div>
					: <h5>No Data</h5>
			}
		</div>
	)
}

export default VideoInterview;
