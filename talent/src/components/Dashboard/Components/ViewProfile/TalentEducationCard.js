import React from 'react';
import { Row, Card, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import moment from 'moment'

const { Title, Paragraph } = Typography

function TalentEducationCard() {

    const education = useSelector(state => state.auth.user && state.auth.user.education[0]);
    const selfTaught = useSelector(state => state.auth.user && state.auth.user.selfTaught);


    return (
        <div>
            <Card style={{ margin: "12px 0px" }}>
                <Row>
                    <Title level={2}>Education</Title>
                </Row>
                {
                    selfTaught ? <Row justify='center' className='mt-3 text-center'>
                        <Col xs={24} sm={24} md={24} lg={24}>
                            <Paragraph className="font-weight-bold ">I am self taught (I don't have a degree)</Paragraph>
                        </Col> </Row> : <>
                            <Row>

                                <Col xs={16} sm={16} md={16} lg={16}>
                                    <h6 className="font-weight-bold">{education && education.degreeTitle}</h6>

                                </Col>
                                {education && education.graduationYear && <Col xs={4} sm={4} md={4} lg={4}>
                                    <h6 className="font-weight-bold">Graduated in: {education && moment(education.graduationYear).format('MMM-YYYY')} </h6>
                                </Col>}
                            </Row>
                            <Row justify='space-between' className='mt-3'>
                                {/* <Col xs={24} sm={4} md={4} lg={4}>
                                    <span className="font-weight-bold">University/College :</span>
                                </Col> */}
                                <Col xs={24} sm={20} md={20} lg={20}>
                                    <h6   >{education && education.instituteName}</h6>

                                </Col>
                            </Row>

                            {/* <Row>
                            <Col xs={24} sm={4} md={4} lg={4}>
                                    <span className="font-weight-bold">Graduated in: {education && education.graduationYear} </span>
                                </Col>
                                <Col xs={24} sm={20} md={20} lg={20}>
                                    <Paragraph >{education && education.graduationYear}</Paragraph>

                                </Col>
                            </Row> */}
                        </>
                }

            </Card>
        </div>
    )
}

export default TalentEducationCard;
