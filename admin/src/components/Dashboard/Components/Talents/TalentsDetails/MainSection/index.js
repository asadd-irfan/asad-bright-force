import React from "react";
import { Collapse } from "antd";
import BasicInfo from "./BasicInfo";
import { useSelector } from "react-redux";
import WorkPlaceFeaturesCard from "./WorkPlaceFeaturesCard";
import WorkHourCard from "./WorkHourCard";
import PositionsTracking from "./PositionsTracking";
import ExperienceCard from "./ExperienceCard";
import WorkHistoryCard from "./WorkHistoryCard";
import TalentEducationCard from "./TalentEducationCard";
import BlockedCompaniesCard from "./BlockedCompaniesCard";
import CodingChallenge from "./CodingChallenge";
import VideoInterview from "./VideoInterview";

const { Panel } = Collapse;

function MainSection() {
  const isDeveloper = useSelector(
    (state) =>
      state.talents.selectedTalent && state.talents.selectedTalent.isDeveloper
  );

  let componentsArray = [
    <Panel header="Basic Info" key="1">
      <BasicInfo />
    </Panel>,
    <Panel header="Professional Experience" key="2">
      <ExperienceCard />
    </Panel>,
    <Panel header="Work Hours" key="3">
      <WorkHourCard />
    </Panel>,
    <Panel header="WorkPlace Features" key="4">
      <WorkPlaceFeaturesCard />
    </Panel>,
    <Panel header="Employment" key="5">
      <WorkHistoryCard />
    </Panel>,
    <Panel header="Education" key="6">
      <TalentEducationCard />
    </Panel>,

    <Panel header="Video Interview" key="8">
      <VideoInterview />
    </Panel>,
    isDeveloper && (
      <Panel header="Coding Challenge" key="7">
        <CodingChallenge />
      </Panel>
    ),
    <Panel header="Blocked Companies" key="9">
      <BlockedCompaniesCard />
    </Panel>,
    <Panel header="Positions Tracking" key="10">
      <PositionsTracking />
    </Panel>,
  ];
  return (
    <div>
      <Collapse defaultActiveKey={["1"]} expandIconPosition={"right"}>
        {componentsArray.map((component, i) => component)}
        {/* return < key= { i } >
          { component }
          </>
      )} */}
      </Collapse>
    </div>
  );
}

export default MainSection;
