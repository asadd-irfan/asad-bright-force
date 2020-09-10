import React, { useState, useEffect } from 'react'
import { Col, Row, Card } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';

const OfferCard = () => {
    const companyPositionDetails = useSelector(state => state.positions.companyPositionDetails)

    const appConfigs = useSelector(state => state.auth.appConfigs);
    const positionOfferOptions = appConfigs && appConfigs['position-offer']
    const currencyOptions = appConfigs && appConfigs['currency']

    const [currencyName, setCurrencyName] = useState()
    const [equity, setEquity] = useState()
    const [signingBonus, setSigningBonus] = useState()
    const [monthlySalary, setMonthlySalary] = useState(0)


    useEffect(() => {

        if (currencyOptions.length > 0 && companyPositionDetails?.positionOffer?.currency) {
            const currencyObj = currencyOptions.find(element => element._id === companyPositionDetails?.positionOffer?.currency);
            setCurrencyName(currencyObj.name)
        }
        if (positionOfferOptions.length > 0 && companyPositionDetails?.positionOffer?.equity) {
            const equityObj = positionOfferOptions.find(element => element._id === companyPositionDetails?.positionOffer?.equity);
            setEquity(equityObj.name)
        }
        if (positionOfferOptions.length > 0 && companyPositionDetails?.positionOffer?.signingBonus) {
            const signingBonusObj = positionOfferOptions.find(element => element._id === companyPositionDetails?.positionOffer?.signingBonus);
            setSigningBonus(signingBonusObj.name)
        }

        if (companyPositionDetails?.positionOffer?.salary) {
            let salary = companyPositionDetails?.positionOffer?.salary / 12;
            salary = salary.toFixed(0)
            setMonthlySalary(salary);

        }

    }, [appConfigs, companyPositionDetails])


    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>
            <Card title='Position Offer' headStyle={{ backgroundColor: '#5986B0' }} style={{ border: '2px solid black', borderRadius: '5px', margin: '20px 0px' }}>
                <Row className="my-3">

                    <p><b>Salary:</b> {companyPositionDetails?.positionOffer?.salary} <br />({numberWithCommas(monthlySalary)} {currencyName} per month)
                        </p>
                    <p><b>Equity:</b> {equity}
                    </p>
                    <Row>  <p><b>Performance Bonus:</b> {companyPositionDetails?.positionOffer?.performanceBonus} %
                        </p></Row>
                    <p><b>Signing Bonus:</b> {signingBonus}
                    </p>

                </Row>
            </Card>

        </div>
    )
}

export default OfferCard;