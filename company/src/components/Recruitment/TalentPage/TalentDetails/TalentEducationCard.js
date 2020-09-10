import React from 'react';
import { Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";


const { Title, Paragraph } = Typography

function TalentEducationCard() {

    const education = useSelector(state => state.talents.selectedTalent && state.talents.selectedTalent.education[0]);
    const selfTaught = useSelector(state => state.talents.selectedTalent && state.talents.selectedTalent.selfTaught);


    return (
        <div>
            <Row>
                <Title level={2}>Education</Title>
            </Row>
            {
                selfTaught ? <Row justify='center' className='mt-3 text-center'>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Paragraph className="font-weight-bold ">I am self taught (I don't have a degree)</Paragraph>
                    </Col> </Row> : <>
                        <Row justify='space-between' className='mt-3'>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <span className="font-weight-bold">University/College : </span> {education && education.instituteName}

                            </Col>
                            {/* <Col xs={24} sm={20} md={20} lg={20}>
                                    <Paragraph >{education && education.instituteName}</Paragraph>

                                </Col> */}
                        </Row>
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>

                                <span className="font-weight-bold">Degree : </span> {education && education.degreeTitle}

                            </Col>
                            {/* <Col xs={24} sm={20} md={20} lg={20}>
                                    <Paragraph >{education && education.degreeTitle}</Paragraph>

                                </Col> */}
                        </Row>
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <span className="font-weight-bold">Graduation year : </span> {education && moment(education.graduationYear).format('MMM-YYYY')}

                            </Col>
                            {/* <Col xs={24} sm={20} md={20} lg={20}>
                                    <Paragraph >{education && education.graduationYear}</Paragraph>

                                </Col> */}
                        </Row>
                    </>
            }

        </div>
    )
}

export default TalentEducationCard;
