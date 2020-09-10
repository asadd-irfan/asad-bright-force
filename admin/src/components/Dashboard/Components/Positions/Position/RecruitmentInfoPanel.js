import React from 'react';
import { Collapse, Row, Col } from 'antd';
import '../positions.scss'
const { Panel } = Collapse;


function RecruitmentInfoPanel({
  companyPositionDetails,
}) {
  let totalTalents = 0;
  let totalGroups = companyPositionDetails?.groupsInfo?.length;
    const sentTalents = companyPositionDetails?.groupsInfo.map(element => {
      totalTalents = element.totalDispatchCandidates + totalTalents
    })
    // console.log('companyPositionDetails',companyPositionDetails)
    // console.log('totalTalents',totalTalents)
    // console.log('totalGroups',totalGroups)

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Recruitment Info Panel" key="1">
            <h6>Recruitment</h6>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                {totalTalents === 0 && totalGroups === 0 &&
                <p>No Recruitment Details Found</p>}
                {totalTalents > 0 && totalGroups > 0 &&
                <ul>
                  <li>Up until now {totalTalents} Talents were sent on {totalGroups} separate groups</li>
                  <li>All talents have an average matching score of {companyPositionDetails?.groupConfigs?.matchingScore} .</li>
                  <li>Cycle Time: 3 days</li>
                  {/* <li>Time Until next group: 2 days</li> */}
                </ul>}
              </Col>
            </Row>
        </Panel>
      </Collapse>
    </div>
  )
}

export default RecruitmentInfoPanel;
