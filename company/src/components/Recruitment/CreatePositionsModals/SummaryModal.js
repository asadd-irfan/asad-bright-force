import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card } from 'antd';
import '../recruitment.scss';
import { AuditOutlined, FileDoneOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux'

const SummaryModal = ({ form }) => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const roleOptions = appConfigs && appConfigs['preferred-role']
    const employmentOptions = appConfigs && appConfigs['employment-type']
    const positionOfferOptions = appConfigs && appConfigs['position-offer']
    const currencyOptions = appConfigs && appConfigs['currency']

    const newPositionSkills = useSelector(state => state.positions.newPositionSkills)
    const newPositionManagementExp = useSelector(state => state.positions.newPositionManagementExp)
    const newPositionHiringTeam = useSelector(state => state.positions.newPositionHiringTeam)
    const newPositionFeatures = useSelector(state => state.positions.newPositionFeatures)
    const [positionRole, setPositionRole] = useState();
    const [employment, setEmployment] = useState();
    const [currencyName, setCurrencyName] = useState()
    const [equity, setEquity] = useState()
    const [signingBonus, setSigningBonus] = useState()
    const [monthlySalary, setMonthlySalary] = useState(0)


    useEffect(() => {
        if (roleOptions.length > 0 && form.getFieldValue('roleName')) {
            const roleObj = roleOptions.find(element => element._id === form.getFieldValue('roleName'));
            setPositionRole(roleObj.name)
        }
        if (employmentOptions.length > 0 && form.getFieldValue('employmentType')) {
            const employmentObj = employmentOptions.find(element => element._id === form.getFieldValue('employmentType'));
            setEmployment(employmentObj.name)
        }
        if (currencyOptions.length > 0 && form.getFieldValue('currency')) {
            const currencyObj = currencyOptions.find(element => element._id === form.getFieldValue('currency'));
            setCurrencyName(currencyObj.name)
        }
        if (positionOfferOptions.length > 0 && form.getFieldValue('equity')) {
            const equityObj = positionOfferOptions.find(element => element._id === form.getFieldValue('equity'));
            setEquity(equityObj.name)
        }
        if (positionOfferOptions.length > 0 && form.getFieldValue('signingBonus')) {
            const signingBonusObj = positionOfferOptions.find(element => element._id === form.getFieldValue('signingBonus'));
            setSigningBonus(signingBonusObj.name)
        }

        if (form.getFieldValue('salary')) {
            let salary = form.getFieldValue('salary') / 12;
            salary = salary.toFixed(0)
            setMonthlySalary(salary);

        }

    }, [appConfigs])
    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    return (
        <div className="my-5">


            <Row style={{ marginTop: '20px' }} className="my-3">
                <Col xs={1} sm={1} md={1} lg={1} />
                <Col xs={22} sm={22} md={22} lg={22}>
                    <Card title="Does this look about right?">
                        <Row className="my-3">
                            <Col xs={0} sm={0} md={6} lg={6} />

                            <Col xs={22} sm={22} md={18} lg={18}>
                                <p><b>Position Title:</b> {form.getFieldValue('title')}</p>
                                <p><b>Employment Type:</b> {employment}</p>
                                <p><b>Role:</b> {positionRole} ({form.getFieldValue('roleExp')} years of experience)</p>
                                <p><b>Skills:</b> {newPositionSkills.length > 0 && newPositionSkills.map((item, index) => {
                                    return (
                                        <span key={index}>{index > 0 && ', '}{item.experienceName}</span>
                                    )
                                })}</p>
                            </Col>

                        </Row>
                        <Row className="my-3">
                            <Col xs={12} sm={12} md={6} lg={6} >
                                <Row> <AuditOutlined style={{ fontSize: 24 }} />  <p style={{ fontSize: 18, marginLeft: 5 }}><b>Position Details:</b> </p></Row>

                            </Col>

                            <Col xs={22} sm={22} md={18} lg={18}>
                                <p><b>Management Experience:</b> {newPositionManagementExp === true ? 'Required, ' + (form.getFieldValue('managementExperience') + ' years of experience') : 'Not Required.'} </p>
                                <p><b>Position Work Hours:</b> {form.getFieldValue('workingTimeFlexibility') === 'very-flexible' ? 'Very Flexible - No overlapping work hours are required' :
                                    form.getFieldValue('workingTimeFlexibility') === 'somewhat-flexible' ? 'Somewhat Flexible - at least 2 overlapping work hours' :
                                        form.getFieldValue('workingTimeFlexibility') === 'flexible' ? 'Flexible - at least 4 overlapping work hours' :
                                            form.getFieldValue('workingTimeFlexibility') === 'not-flexible' ? 'Not Flexible - at least 6 overlapping work hours' : ''}
                                </p>
                                <p><b>Position Features: </b> {newPositionFeatures.length > 0 && newPositionFeatures.map((item, index) => {
                                    return (
                                        <span key={index}>{index > 0 && ', '}{item.tagName}</span>
                                    )
                                })}</p>

                                <p><b>Main Responsibilities:</b> {form.getFieldValue('mainResponsibilities')} </p>
                                <p><b>Hiring Team:</b>  {newPositionHiringTeam.length > 0 && newPositionHiringTeam.map((item, index) => {
                                    return (
                                        <span key={index}>{index > 0 && ', '}{item.userName}</span>
                                    )
                                })}</p>
                            </Col>


                        </Row>

                        <Row className="my-3">
                            <Col xs={12} sm={12} md={6} lg={6} >
                                <Row> <FileDoneOutlined style={{ fontSize: 24 }} />  <p style={{ fontSize: 18, marginLeft: 5 }}><b>Position Offer:</b> </p></Row>

                            </Col>

                            <Col xs={22} sm={22} md={18} lg={18}>
                                <p><b>Salary:</b> {numberWithCommas(form.getFieldValue('salary'))} ({numberWithCommas(monthlySalary)} {currencyName} per month)</p>
                                <p><b>Equity:</b> {equity}</p>
                                <p><b>Performance Bonus:</b>  {form.getFieldValue('performanceBonus')} % </p>
                                <p><b>Signing Bonus:</b>  {signingBonus}</p>
                            </Col>

                        </Row>

                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default SummaryModal;
