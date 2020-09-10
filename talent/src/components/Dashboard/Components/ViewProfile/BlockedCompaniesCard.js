import React from "react";
import { Row, Card, Col, Typography } from "antd";

const { Title, Paragraph } = Typography;

function BlockedCompaniesCard() {
  return (
    <div>
      <Card style={{ margin: "12px 0px", minHeight: "300px" }}>
        <Row>
          <Title level={2}>Blocked Companies </Title>
        </Row>
        <Row justify="space-between" className="mt-3">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Paragraph>lorem ipsum</Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default BlockedCompaniesCard;
