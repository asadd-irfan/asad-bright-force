import React, { useState, useEffect} from 'react';
import { Collapse, Row, Col, Typography } from 'antd';
import { useSelector } from "react-redux";
import '../positions.scss'
const { Panel } = Collapse;
const { Paragraph } = Typography;


function OfferPanel({
  selectedPosition,
}) {
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const positionOfferOptions = appConfigs && appConfigs['position-offer']

  const [signingBonus, setSigningBonus] = useState(null)
  const [equity, setEquity] = useState(null)
  
  useEffect(() => {
    if (selectedPosition) {
      positionOfferOptions && positionOfferOptions.map(offer => {
        if (offer._id === selectedPosition?.positionOffer?.signingBonus) {
          setSigningBonus(offer.name)
        } 
        if (offer._id === selectedPosition?.positionOffer?.equity) {
          setEquity(offer.name)
        } 
      }) 
       
    }
  }, [positionOfferOptions, selectedPosition])

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Positions Offer Panel" key="1">
            <h6>Offer</h6>
            <Row>
              <Col xs={24} sm={24} md={5} lg={5}>
                <h6>Salary</h6>
                <Paragraph>{selectedPosition?.positionOffer?.salary}</Paragraph>
              </Col>
              <Col xs={24} sm={24} md={5} lg={5}>
                <h6>Performers bonus</h6>
                <Paragraph>{selectedPosition?.positionOffer?.performanceBonus}</Paragraph>
              </Col>
              <Col xs={24} sm={24} md={5} lg={5}>
                <h6>Equity</h6>
                <Paragraph>{equity}</Paragraph>
              </Col>
              <Col xs={24} sm={24} md={5} lg={5}>
                <h6>Signing bonus</h6>
                <Paragraph>{signingBonus}</Paragraph>
              </Col>
            </Row>
        </Panel>
      </Collapse>
    </div>
  )
}

export default OfferPanel;
