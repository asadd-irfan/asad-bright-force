import React from 'react';
import { Collapse, Card } from 'antd';
import BasicInfo from './BasicInfo';
import { useSelector } from "react-redux";
import WorkPlaceFeaturesCard from './WorkPlaceFeaturesCard';
import WorkHourCard from './WorkHourCard';
import ExperienceCard from './ExperienceCard';
import WorkHistoryCard from './WorkHistoryCard';
import TalentEducationCard from './TalentEducationCard';
import CodingChallenge from './CodingChallenge';
import VideoInterview from './VideoInterview';

const { Panel } = Collapse;

function MainSection() {
	// const isDeveloper = useSelector(state => state.talents.selectedTalent && state.talents.selectedTalent.isDeveloper);
	const selectedTalent = useSelector(state => state.talents.selectedTalent)

	return (
		<div>
			<Card className="m-2" key="11">
				<BasicInfo index="1" />
			</Card>
			<Card className="m-2" key="12">
				<ExperienceCard key="2" />
			</Card>
			<Card className="m-2" key="13">
				<WorkHourCard key="3" />
			</Card>
			<Card className="m-2" key="14">
				<WorkPlaceFeaturesCard key="4" />
			</Card>
			<Card className="m-2" key="15">
				<WorkHistoryCard key="5" />
			</Card>
			<Card className="m-2" key="16">
				<TalentEducationCard key="6" />
			</Card>
			<Card className="m-2" key="18">
				<VideoInterview key="8" />
			</Card>
			{selectedTalent?.isDeveloper &&
				<Card className="m-2" key="17">
					<CodingChallenge key="7" />
				</Card>}




		</div>
	)
}

export default MainSection;
