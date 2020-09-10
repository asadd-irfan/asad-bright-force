import React from 'react';
import { Row, Col } from 'antd';

function CodeChallengeResult({
	talentEvaluationDetails
}) {
	const codingChallenge = talentEvaluationDetails && talentEvaluationDetails.codingChallenge
	return (
		<div className='mb-20'>
			<div className='horizontally-middle mb-10'>
				<h4>Coding Challenge</h4>
			</div>
			<div className='mb-20'>
				<div className='mb-20'>
					<h5>Result</h5>
				</div>

				<div>
					<div className='mb-20'>
						<h5>Coding Challenge Link</h5>
						<span><a target='_blank' rel='noopener noreferrer' href={codingChallenge && codingChallenge.websiteLink}>{codingChallenge && codingChallenge.websiteLink}</a></span>
					</div>
					<div className='mb-20'>
						<h6>Result Details</h6>
						{codingChallenge && codingChallenge.resultDetails}
					</div>

					<div>
						<Row className='mb-10'>
							<Col xs={12} sm={12} md={12} lg={12}>
								<h6>Category</h6>
							</Col>
							<Col xs={12} sm={12} md={12} lg={12}>
								<h6>Score</h6>
							</Col>
						</Row>
						{codingChallenge && codingChallenge.categoriesScores.map((obj, index) => (
							<Row key={index}>
								<Col xs={12} sm={12} md={12} lg={12}>
									{obj.name}
								</Col>
								<Col xs={12} sm={12} md={12} lg={12}>
									{obj.percentage}
								</Col>
							</Row>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CodeChallengeResult;
