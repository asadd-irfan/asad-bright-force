import React, { useState, useEffect } from "react";
import { Row, Card, Col, Typography } from "antd";
import { useSelector } from "react-redux";

const { Title, Paragraph } = Typography;

function PositionsTracking() {
  const user = useSelector((state) => state.talents.selectedTalent);

  useEffect(() => {


  }, [user]);


  return (
    <div>
      <Card style={{ margin: "12px 0px", minHeight: "300px" }}>
        <Row>
          <Title level={2}>Positions Tracking </Title>
        </Row>
        <Row className="mt-3">


        </Row>
      </Card>
    </div>
  );
}

export default PositionsTracking;
