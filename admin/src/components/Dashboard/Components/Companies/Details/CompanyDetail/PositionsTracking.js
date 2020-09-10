import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col } from 'antd';
import { getCompanyAllPositions } from "../../../../../../actions/company";
import { MOMENT_DATE_FORMAT } from "../../../../../../common/constants";
import moment from "moment";
import { useHistory } from "react-router-dom";

const PositionsTracking = ({ selectedCompany }) => {
    const history = useHistory();

    const companyAllPositions = useSelector(state => state.company.companyAllPositions);
    const dispatch = useDispatch()
    const appConfigs = useSelector(state => state.auth.appConfigs);
    const positionTypeOptions = appConfigs && appConfigs['roles']
    const positionRoleOptions = appConfigs && appConfigs['preferred-role']
    const [allPositions, setPositions] = useState(null);

    useEffect(() => {
        let positionsArr = []
        if (selectedCompany) {
            dispatch(getCompanyAllPositions(selectedCompany._id))
        }
    }, [selectedCompany])
    useEffect(() => {
        if (companyAllPositions) {
            let positionsArr = []
            companyAllPositions && companyAllPositions.map((pos) => {
                positionTypeOptions && positionTypeOptions.filter((type) => {
                    if (type._id === pos.name._id) {
                        let role = positionRoleOptions.find(element => element._id === pos.role.name._id);

                        positionsArr.push({
                            id: pos._id,
                            name: type.name,
                            title: pos.title,
                            employment: pos.employmentType,
                            positionCreatedBy: pos.positionCreatedBy.fullName,
                            createdAt: moment(pos.createdAt).format(MOMENT_DATE_FORMAT),
                            positionRole: role.name
                        })
                    }
                })

            })
            setPositions(positionsArr)

        }
    }, [companyAllPositions, positionTypeOptions, positionRoleOptions])

    const gotoPositionPage = (id) => {
        history.push(`/admin/positions/company/${id}`);
    }
    // console.log('companyAllPositions', companyAllPositions)
    // console.log('allPositions', allPositions)

    return (
        <div >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1>Positions Tracking</h1>
                <hr style={{ border: '1px solid black' }} />
            </div>

            <Row className="my-5">
                <Col xs={2} sm={2} md={5} lg={5} />
                <Col xs={20} sm={20} md={15} lg={15} >
                    {allPositions && allPositions.map((position, index) => {
                        return <div key={index} style={{ cursor: "pointer" }} onClick={() => gotoPositionPage(position.id)}>
                            <Row className="m-2">
                                <span style={{ borderRadius: '25%', backgroundColor: 'grey', width: '25px', height: '25px', marginRight: '10px', marginLeft: '10px' }}>
                                </span>
                                <b> {position.title}, {position.name}, {position.positionRole}, {position.employment.name}

                                </b>
                            </Row>
                            <Row className="m-1">
                                <Col xs={2} sm={2} md={2} lg={2} />
                                <Col xs={16} sm={16} md={16} lg={16} >
                                    <b> Position Created By User Name : {position.positionCreatedBy} </b>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} >
                                    <b> Date: {position.createdAt} </b>
                                </Col>

                            </Row>
                            <Row className="m-1">
                                <Col xs={2} sm={2} md={2} lg={2} />
                                <Col xs={16} sm={16} md={16} lg={16} >
                                    <b> Group 1 Sent by: Matching Process/adminUser </b>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6} >
                                    <b> Date: {position.createdAt} </b>
                                </Col>

                            </Row>
                        </div>

                    })}

                </Col>

            </Row>

        </div>
    )
}

export default PositionsTracking;