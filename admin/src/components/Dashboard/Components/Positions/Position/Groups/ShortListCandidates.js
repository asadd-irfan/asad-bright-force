import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import DetailsInfo from '../../Talent/DetailsInfo'

const { Paragraph } = Typography;

function ShortListCandidates({
  shortListCandidates,
}) {
  const [talents, setTalents] = useState(shortListCandidates)

  useEffect(() => {
    setTalents(shortListCandidates)
  }, [shortListCandidates])

  return (
    <div style={{ margin: '10px 0px' }}>
      {talents && talents.map((talentData, index) => {
        let talent = talentData?.candidateId

        return <div key={index} style={{ border: '2px solid', margin: '10px 0px', backgroundColor: 'white' }}>
          <Row className='vertical-middle-align'>
            <Col xs={7} sm={7} md={5} lg={5} style={{ textAlign: 'center' }}>
            <Paragraph>
              <b>Number (Rank):</b> {index+1}
              </Paragraph>
              <Paragraph>
                <b>Matching Score:</b> {talentData.matchingScore}
              </Paragraph>
            </Col>
            <Col xs={17} sm={17} md={19} lg={19} style={{ borderLeft: '2px solid', padding: '15px' }}>
              <DetailsInfo talent={talent} />

              <Paragraph>

                {talentData?.shortListStatus == 'accepted' && <Button type="primary" style={{ background: "#52761D", borderColor: "#52761D", float: 'right', margin: '5px' }}>
                  Request Accepted
									</Button>}
                {talentData?.shortListStatus == 'rejected' && <Button type="primary" style={{ background: "#E06666", borderColor: "#E06666", float: 'right', margin: '5px' }}>
                  Request Rejected
									</Button>}
                {talentData?.shortListStatus == 'pending' && <Button type="primary" style={{ background: "rgb(230,140,71)", borderColor: "rgb(230,140,71)", float: 'right', margin: '5px' }}>
                Talent Approached
									</Button>}
              </Paragraph>


            </Col>
          </Row>
        </div>
      })}
    </div>
  )
}

export default ShortListCandidates
