import React, { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import DetailsInfo from '../../Talent/DetailsInfo'

const { Paragraph } = Typography; 

function LongListCandidates({
  longListCandidates,
}) {

  const [talents, setTalents] = useState(longListCandidates)

  useEffect(() => {
    
    setTalents(longListCandidates)
  }, [longListCandidates]) 
  // console.log('longListCandidates',longListCandidates)

  return (
    <div style={{ margin: '10px 0px' }}>
      {talents && talents.map((talentData, index) => {
        let talent = talentData?.candidateId
        return <div key={index} style={{ border: '2px solid', margin: '10px 0px', backgroundColor: 'white' }}>
          <Row className='vertical-middle-align'>
            <Col xs={7} sm={7} md={5} lg={5} style={{ textAlign: 'center'}}>
            <Paragraph>
              <b>Number (Rank):</b> {index+1}
              </Paragraph>
              <Paragraph>
                <b>Matching Score:</b> {talentData.matchingScore}
              </Paragraph>
            </Col>
            <Col xs={17} sm={17} md={19} lg={19} style={{ borderLeft: '2px solid', padding: '15px'}}>
            <DetailsInfo talent={talent} />
            </Col>
          </Row>
        </div>
      })}
    </div>
  )
}

export default LongListCandidates
