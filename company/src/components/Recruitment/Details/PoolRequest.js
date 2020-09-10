import React from 'react';
import { Button, Row, Col } from 'antd'
import '@ant-design/compatible/assets/index.css';
import lookingPosition from '../../../assets/img/looking-position.png'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AuditOutlined, FileDoneOutlined } from "@ant-design/icons";


const PoolRequest = ({
    companyPositionDetails
}) => {
    const history = useHistory();
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const appConfigSkills = appConfigs && appConfigs['skills']
    const currencyOptions = appConfigs && appConfigs['currency']
    const employmentOptions = appConfigs && appConfigs['employment-type']
    const positionOfferOptions = appConfigs && appConfigs['position-offer']
    const roleFeaturesOptions = appConfigs && appConfigs['role-features']


    return (
        <div>
            <div style={{ textAlign: 'center', borderBottom: '1px solid' }}>
                <h4>We are working on your pool request</h4>
                <p>The Position is now sent to our account manager.</p>
                <p>Every [3] days we will send out a fresh batch(group) of technically assed candidates that are matched using our algorithm and human curators.</p>
                <h6>days until the next group is sent: 2</h6>
                <p>For any questions, issues, and concerns contact your account manager at {companyPositionDetails?.assignedAccountManager?.email}</p>
                <div style={{ marginBottom: '45px' }}>
                    <img src={lookingPosition} width='150px' height='120px' />
                </div>
            </div>
            <div style={{ padding: '20px' }}>
                <Row className="my-3">
                    <Col xs={0} sm={0} md={6} lg={6} />

                    <Col xs={22} sm={22} md={18} lg={18}>
                        <p><b>Position Title:</b> {companyPositionDetails?.title}</p>
                        <p><b>Employment Type:</b> {companyPositionDetails?.employmentType?.name}</p>
                        <p><b>Role:</b> {companyPositionDetails?.role?.name?.name} ({companyPositionDetails?.role?.yearsOfExperience} years of experience)</p>
                        <p><b>Skills:</b> {appConfigSkills && appConfigSkills.map((appSkill) => {
                            return companyPositionDetails?.skills && companyPositionDetails?.skills.map((skill, index) => {
                                if (appSkill._id === skill) {
                                    return <span key={index}>{index > 0 && ','} {appSkill.name} </span>
                                }
                            })

                        })}</p>
                    </Col>

                </Row>
                <Row className="my-3">
                    <Col xs={12} sm={12} md={6} lg={6} >
                        <Row> <AuditOutlined style={{ fontSize: 24 }} />  <p style={{ fontSize: 18, marginLeft: 5 }}><b>Position Details:</b> </p></Row>

                    </Col>

                    <Col xs={22} sm={22} md={18} lg={18}>
                        <p><b>Management Experience:</b> {companyPositionDetails?.managementExperience?.status === true ? 'Required, ' + (companyPositionDetails?.managementExperience?.yearsOfExperience + ' years of experience') : 'Not Required.'} </p>
                        <p><b>Position Work Hours:</b> {companyPositionDetails?.workingTimeFlexibility === 'very-flexible' ? 'Very Flexible - No overlapping work hours are required' :
                            companyPositionDetails?.workingTimeFlexibility === 'somewhat-flexible' ? 'Somewhat Flexible - at least 2 overlapping work hours' :
                                companyPositionDetails?.workingTimeFlexibility === 'flexible' ? 'Flexible - at least 4 overlapping work hours' :
                                    companyPositionDetails?.workingTimeFlexibility === 'not-flexible' ? 'Not Flexible - at least 6 overlapping work hours' : ''}
                        </p>
                        <p><b>Position Features: </b> {roleFeaturesOptions && roleFeaturesOptions.map((appRoleFeature) => {
                            return companyPositionDetails?.positionFeatures && companyPositionDetails?.positionFeatures.map((feature, index) => {
                                if (appRoleFeature._id === feature?.feature) {
                                    return <span key={index}>{index > 0 && ','} {appRoleFeature.name} </span>
                                }
                            })

                        })}</p>

                        <p><b>Main Responsibilities:</b> {companyPositionDetails?.mainResponsibilities} </p>
                        {/* <p><b>Hiring Team:</b>  {newPositionHiringTeam.map((item, index) => {
                            return (
                                <span key={index}>{index > 0 && ', '}{item.userName}</span>
                            )
                        })}</p> */}
                    </Col>


                </Row>

                <Row className="my-3">
                    <Col xs={12} sm={12} md={6} lg={6} >
                        <Row> <FileDoneOutlined style={{ fontSize: 24 }} />  <p style={{ fontSize: 18, marginLeft: 5 }}><b>Position Offer:</b> </p></Row>

                    </Col>

                    <Col xs={22} sm={22} md={18} lg={18}>
                        <p><b>Salary:</b>  {companyPositionDetails?.positionOffer?.salary}
                        </p>
                        <p><strong>Currency:</strong> {currencyOptions && currencyOptions.map((currency, index) => {
                            if (currency._id === companyPositionDetails?.positionOffer?.currency) {
                                return <span key={index}>{currency.name} </span>
                            }

                        })}</p>
                        <p><b>Equity:</b> {positionOfferOptions && positionOfferOptions.map((pos, index) => {
                            if (pos._id === companyPositionDetails?.positionOffer?.equity) {
                                return <span key={index}>{pos.name} </span>
                            }

                        })}</p>
                        <p><strong>Performance Bonus:</strong> {companyPositionDetails?.positionOffer?.performanceBonus}%</p>
                        <p><strong>Sign On Bonus:</strong> {positionOfferOptions && positionOfferOptions.map((pos, index) => {
                            if (pos._id === companyPositionDetails?.positionOffer?.signingBonus) {
                                return <span key={index}>{pos.name} </span>
                            }

                        })}</p>                    </Col>

                </Row>




                <Row className="my-5">
                    <Col span={2} />
                    <Col span={6}>
                        <Button type="primary" block onClick={() => {
                            history.push('/company/hire/recruitment/edit-position/' + companyPositionDetails?._id);
                        }}>
                            Edit Position
                </Button>

                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default PoolRequest;

