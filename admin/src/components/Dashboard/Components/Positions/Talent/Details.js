import React, { useEffect, useState } from 'react';
import { Collapse, Row, Col, Button, Typography } from 'antd';
import '../positions.scss'
import moment from 'moment'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DetailsInfo from "./DetailsInfo";

const { Panel } = Collapse;
const { Paragraph } = Typography;


function TalentPositionsDetails() {
  const history = useHistory();
  const talent = useSelector(state => state.positions.selectedTalentPositions?.talent);

  return (
    <div style={{ marginBottom: '10px' }}>
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition={'right'}
      >
        <Panel header="Talent Details" key="1">
          <DetailsInfo talent={talent} />

          <Row>
            <Col xs={0} sm={0} md={20} lg={20}>
            </Col>
            <Col xs={14} sm={14} md={4} lg={4}>
              <Button
                type="primary"
                block
                onClick={
                  () => {
                    history.push(`/admin/talents/${talent?._id}`)
                  }
                }
              >
                Go To Talent Page
                </Button>
            </Col>
          </Row>

        </Panel>
      </Collapse>
    </div>
  )
}

export default TalentPositionsDetails;
