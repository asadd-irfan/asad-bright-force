import React, { useState, } from 'react';
import { Form, Row, Col, Typography, Select, InputNumber } from 'antd';
import { useSelector } from 'react-redux'

const { Title } = Typography;
const { Option } = Select;

const OfferModal = () => {
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const positionOfferOptions = appConfigs && appConfigs['position-offer']
    const currencyOptions = appConfigs && appConfigs['currency']
    const [currencyName, setCurrencyName] = useState(null)
    const [monthlySalary, setMonthlySalary] = useState(0)

    function numberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const changeAnnualSalary = (value) => {
        setMonthlySalary(value / 12);
    };
    function handleChange(value) {
        const currencyObj = currencyOptions.find(element => element._id === value);
        setCurrencyName(currencyObj.name)
    }
    return (
        <div className="my-5">
            <div className="my-5">
                <h2>What would you like to offer candidates?</h2>
            </div>
            <b>The position salary is used for matching an a tailored offer can and be made<br /> and is recommended for talents that are in more demand</b>
            <div className='position-offer-wrapper'>


                <div style={{ margin: '20px 0px' }}>
                    <Row>
                        <Col xs={24} sm={24} md={15} lg={15}>
                            <h6>Salary</h6>
                        </Col>
                        <Col xs={0} sm={0} md={1} lg={1} />
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <h6>Currency</h6>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} style={{ wordWrap: 'break-word' }}>
                            <Form.Item name='salary' >

                                <InputNumber style={{ width: '250px' }} type="number" onChange={changeAnnualSalary} />
                            </Form.Item>

                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} style={{ wordWrap: 'break-word' }}>
                            <b style={{ fontSize: '16px' }}> {numberWithCommas(monthlySalary.toFixed(0))} {currencyName && currencyName} per month </b>

                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8} style={{ wordWrap: 'break-word' }}>
                            <Form.Item name='currency' >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select a Currency"
                                    optionFilterProp="children"
                                    style={{ width: '250px' }}
                                    onChange={handleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {currencyOptions && currencyOptions.map((item, index) => {
                                        return <Option key={index} value={item._id}>{item.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <h6>Equity</h6>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item name='equity'>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select Equity"
                                    optionFilterProp="children"
                                    style={{ width: 250 }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {positionOfferOptions && positionOfferOptions.map((item, index) => {
                                        return <Option key={index} value={item._id}>{item.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <h6>Performance bonus </h6>
                    </Row>
                    <Row>

                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Row>
                                <Col xs={21} sm={21} md={21} lg={21}>
                                    <Form.Item name='performanceBonus'>
                                        <InputNumber style={{ width: '250px' }} type="number" />
                                    </Form.Item>
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} className="mt-1">
                                    <b style={{ fontSize: 16 }}>%</b>
                                </Col>

                            </Row>

                        </Col>
                    </Row>

                    <Row>
                        <h6>Signing bonus</h6>
                    </Row>
                    <Row>

                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Form.Item name='signingBonus'>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Select a Bonus"
                                    optionFilterProp="children"
                                    style={{ width: 250 }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {positionOfferOptions && positionOfferOptions.map((item, index) => {
                                        return <Option key={index} value={item._id}>{item.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            </div>

        </div>
    )
}

export default OfferModal;
