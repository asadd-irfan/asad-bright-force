import React, { useState, useEffect } from "react";
import { Row, Col, Typography, } from "antd";
import { useSelector } from "react-redux";
import axios from 'axios';
import { VideoCameraOutlined } from '@ant-design/icons';


import './mainSection.scss'

const { Paragraph } = Typography
function VideoInterview() {
	const selectedTalent = useSelector(state => state.talents.selectedTalent)
	const [videoInterview, setVideoInterview] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get('/api/company/talent-evaluation/' + selectedTalent?._id);
			if (res?.data?.message) {
				setVideoInterview(null)
			} else {
				let evaluation = res?.data?.result
				setVideoInterview(evaluation?.videoInterview)
			}
		}
		if (selectedTalent) {
			fetchData();
		}
	}, [selectedTalent]);

	// console.log('selectedTalent', selectedTalent)
	// console.log('videoInterview', videoInterview)
	return (
		<div>
			<h3>Video Interview  results</h3>
			{
				videoInterview && videoInterview
					?
					<div className="my-5">
						<Row className="my-5">
							<Col xs={3} sm={3} md={3} lg={3} />
							<Col xs={7} sm={7} md={7} lg={7} style={{ textAlign: 'center' }}>
								<a href={videoInterview?.resultLink && videoInterview?.resultLink} target='_blank' rel="noopener noreferrer">	<VideoCameraOutlined
									style={{ fontSize: "100px" }}
								/> </a>
								<h4>Watch Interview</h4>
							</Col>
							<Col xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'start' }} >
								<Paragraph style={{ marginTop: '20px' }}>
									a picture is worth a thousand words
									a video is worth a million!
									 {" " + selectedTalent?.name} Pre recorded one sided video interview is waiting for you.
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
