import React, { useState, useEffect } from "react";
import { Row, Col, Progress } from "antd";
import { useSelector } from "react-redux";
import axios from 'axios';
import './mainSection.scss'

function CodingChallenge() {
	const selectedTalent = useSelector(state => state.talents.selectedTalent)
	const [codingChallengeScores, setCodingChallengeScores] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get('/api/company/talent-evaluation/' + selectedTalent?._id);
			if (res?.data?.message) {
				setCodingChallengeScores(null)
			} else {
				let evaluation = res?.data?.result;
				let scores = evaluation?.codingChallenge?.categoriesScores;
				scores && scores.sort((a, b) => b.percentage - a.percentage);

				setCodingChallengeScores(scores)
			}


		}
		if (selectedTalent) {
			fetchData();
		}
	}, [selectedTalent]);

	// console.log('selectedTalent', selectedTalent)
	// console.log('codingChallengeScores', codingChallengeScores)
	return (
		<div>
			<h3>Online coding challenge results</h3>
			{
				codingChallengeScores && codingChallengeScores
					? <div>
						<div className="progress-bar-disclaimer">
							<Row justify="space-between">

								<Col xs={24} sm={24} md={24} lg={24}>
									{codingChallengeScores && codingChallengeScores.map((item, ind) => {
										return (
											<div key={ind}>
												<Row  >
													<b className={{ fontsize: 18 }}>{item.name}</b>
												</Row>
												<Row  >
													<Col xs={20} sm={20} md={20} lg={20}>
														<Progress className="progress-lg" percent={item.percentage} />
													</Col>

												</Row>
											</div>
										);
									})}
								</Col>
							</Row>
						</div>
					</div>
					: <h5>No Data</h5>
			}
		</div>
	)
}

export default CodingChallenge;
