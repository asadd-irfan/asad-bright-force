import React, { useState } from "react";
import { Row, Col, Typography, Progress } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


import './mainSection.scss'

const { Paragraph } = Typography
function CodingChallenge() {
	const talentEvaluation = useSelector(state => state.talents.selectedTalentEvaluation && state.talents.selectedTalentEvaluation);
	const [codingChallengeScores] = useState(talentEvaluation && talentEvaluation.codingChallenge.categoriesScores)

	codingChallengeScores && codingChallengeScores.sort((a, b) => b.percentage - a.percentage);

	return (
		<div>
			<h3>Online coding challenge results</h3>
			{
				talentEvaluation && talentEvaluation
					? <div>
						<div className="progress-bar-disclaimer">
							<Row justify="space-between">
								{/* <Col xs={24} sm={24} md={10} lg={10}>
										<Paragraph>
											result of coding challenge will be defined by supplier and the
              score they present <br />
              Written assessment <br />
              Measurable parameters (ranked pairs of parameter, score)
              <br /><Link to="">A Video Recording</Link>
										</Paragraph>
									</Col> */}
								<Col xs={24} sm={24} md={24} lg={24}>
									{codingChallengeScores && codingChallengeScores.map((item, ind) => {
										return (
											<div key={ind}>
												<Row  >
													<Paragraph>{item.name}</Paragraph>
												</Row>
												<Row  >
													<Col xs={20} sm={20} md={20} lg={20}>
														<Progress className="progress-lg" percent={item.percentage} />
													</Col>
													{/* <Col xs={24} sm={24} md={8} lg={8}>
														<Paragraph>{item.name}</Paragraph>
													</Col> */}
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
