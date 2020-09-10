import React from 'react';
import { Row, Card, Col, Typography, Timeline } from "antd";
import { useSelector } from "react-redux";
import moment from 'moment';

import './viewProfile.scss'
import { MOMENT_DATE_FORMAT } from '../../../../common/constants'

const { Paragraph, Title } = Typography


function WorkHistoryCard() {
    const workExperience = useSelector(state => state.auth.user && state.auth.user.workExperience)

    return (
        <div>
            <Card style={{ margin: "8px 0px" }}>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Title level={2}>Employment</Title>
                    </Col>
                </Row>
                <Timeline>

                    {
                        workExperience && workExperience.map((item, ind) => {
                            return <Timeline.Item><div key={ind} className='mt-4'>
                                <Row >
                                    {/* <Col xs={12} sm={4} md={4} lg={4}>
                                    <Paragraph className="font-weight-bold">Start Date:</Paragraph >
                                </Col> */}
                                    <Paragraph>
                                        {moment(item.startDate).format(MOMENT_DATE_FORMAT) + " "}
                                    </Paragraph>
                                    <span> - </span>
                                    {
                                        item.currentlyWorking ?
                                            <Paragraph> Currently work here</Paragraph>
                                            : <Paragraph>
                                                {" " + moment(item.endDate).format(MOMENT_DATE_FORMAT)}
                                            </Paragraph>
                                    }

                                </Row> <br />
                                <Row >

                                    {/* <Col xs={12} sm={4} md={4} lg={4}>
                                    <Paragraph className="font-weight-bold">Company Name :</Paragraph >
                                </Col> */}
                                    <Col xs={12} sm={12} md={12} lg={12} className='text-align'>
                                        <Paragraph>{item.title} at {item.companyName}</Paragraph>

                                    </Col>
                                </Row>
                                {/* <Row >
                                <Col xs={12} sm={4} md={4} lg={4}>
                                    <Paragraph className="font-weight-bold">Title :</Paragraph >
                                </Col>
                                <Col xs={12} sm={8} md={8} lg={8}>
                                    <Paragraph>{item.title}</Paragraph>
                                </Col>
                            </Row> */}

                                <Row >
                                    {/* <Col xs={24} sm={4} md={4} lg={4}>
                                    <Paragraph className="font-weight-bold">Description :</Paragraph >
                                </Col> */}
                                    <Col xs={24} sm={20} md={20} lg={20}>
                                        <Paragraph>{item.description}</Paragraph>
                                    </Col>
                                </Row>
                            </div></Timeline.Item>
                        })
                    }
                </Timeline>

            </Card>
        </div>
    )
}

export default WorkHistoryCard;
