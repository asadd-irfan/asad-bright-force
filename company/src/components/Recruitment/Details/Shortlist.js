import React, { useState } from 'react';
import { Button, Row, Col, Avatar, Modal } from 'antd'
import TalentDetails from './TalentDetails';
import '@ant-design/compatible/assets/index.css';
import lookingPosition from '../../../assets/img/looking-position.png'
import '../recruitment.scss'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { removeShortListCandidate, setSelectedPositionRecruitment } from '../../../actions/positions'
import { getTalentById } from '../../../actions/talent'
import { MOMENT_DATE_FORMAT } from '../../../common/constants'

import moment from 'moment'

const Shortlist = ({
  shortListCandidates,
}) => {
  const dispatch = useDispatch();

  const history = useHistory();
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [allSendIds, setAllSendIds] = useState(null)
  const [selectedPosRec, setSelectedPosRec] = useState(null)

  const removeCandidate = (positionRec) => {
    setAllSendIds({
      'id': positionRec?._id, 'groupId': positionRec?.groupId, 'positionId': positionRec?.position
    })
    setRemoveModalVisible(true)
    setSelectedPosRec(positionRec)
  }

  const handleRemoveModalOk = () => {
    let obj = {
      "groupId": allSendIds.groupId
    }
    dispatch(removeShortListCandidate(allSendIds.id, obj, allSendIds.positionId)).then(() => {
      setRemoveModalVisible(false)
      setAllSendIds(null)
    })


  }
  const handleRemoveModalCancel = () => {
    setRemoveModalVisible(false)
    setAllSendIds(null)
  }

  return (
    <div style={{ margin: '10px 0px' }}>
      {shortListCandidates && shortListCandidates?.length > 0 ? shortListCandidates.map((positionRec, index) => {
        let talent = positionRec?.candidateId
        return <div key={index} style={{ border: '2px solid', margin: '10px 0px', backgroundColor: 'white' }}>
          <Row>
            <Col xs={24} sm={24} md={15} lg={15} style={{ padding: '10px' }}>
              <TalentDetails talentDetails={talent} positionRec={positionRec} />
            </Col>

            <Col xs={24} sm={24} md={9} lg={9} className="talent-list-flex-wrapper" style={{ padding: '10px' }}>
              <div className="talent-list-flex" style={{ width: '100%' }}>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <div style={{ float: 'right' }}>

                      {positionRec?.shortListStatus == 'rejected' && <Row>

                        <span style={{ borderRadius: '5%', backgroundColor: 'red', width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
                        </span>

                        <span className="mt-1"><b>Status: </b> Request Declined</span>
                      </Row>}
                      {positionRec?.shortListStatus == 'pending' && <><Row>

                        <span style={{ borderRadius: '5%', backgroundColor: 'orange', width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
                        </span>
                        <span className="mt-1"><b>Status: </b> Request Sent</span>
                      </Row>
                        <span style={{ fontSize: 11 }}>({moment(positionRec?.offerSentDate).format(MOMENT_DATE_FORMAT)})</span></>
                      }
                      {positionRec?.shortListStatus == 'accepted' && <Row>

                        <span style={{ borderRadius: '5%', backgroundColor: 'green', width: '12px', height: '12px', marginTop: '8px', marginRight: '7px' }}>
                        </span>

                        <span className="mt-1"><b>Status:</b>Awaiting Interview Schedule</span>
                      </Row>}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Button block onClick={() => {
                      history.push('/company/hire/recruitment/talent-details/' + positionRec?._id)
                      dispatch(setSelectedPositionRecruitment(positionRec))
                    }} type="default" style={{ margin: '5px' }}>
                      View More
									</Button>
                  </Col>
                </Row>

              </div>
            </Col>

          </Row>
          <Row>
            <Col span={10}>

              <Button block type="primary" onClick={() => removeCandidate(positionRec)} style={{ background: "#E06666", borderColor: "#E06666", float: 'right', margin: '5px' }}>
                Remove From Shortlist (Cancel Request)
									</Button>
            </Col>
            {positionRec?.shortListStatus == 'rejected' && <Col span={14}>
              <Button
                block
                type="primary"
                onClick={() => {
                  history.push('/company/hire/recruitment/view-offer/' + positionRec?._id)
                  dispatch(getTalentById(talent?._id))
                  dispatch(setSelectedPositionRecruitment(positionRec))
                }}
                style={{ background: "#45818E", borderColor: "#45818E", margin: '5px' }}>
                Revise Your Offer
									</Button>

            </Col>}
            {positionRec?.shortListStatus == 'accepted' && <Col span={14}>
              <Button
                block
                type="primary"
                onClick={() => {
                  history.push('/company/hire/recruitment/talent-page/schedule-interview/' + positionRec?._id)
                  dispatch(getTalentById(talent?._id))
                  dispatch(setSelectedPositionRecruitment(positionRec))
                }}
                style={{ background: "#6aa84f", borderColor: "#6aa84f", margin: '5px' }}>
                Schedule an Interview
									</Button>

            </Col>}
            {positionRec?.shortListStatus == 'pending' && <Col span={14}>

              <Button
                block
                type="primary"
                onClick={() => {
                  history.push('/company/hire/recruitment/view-offer/' + positionRec?._id)
                  dispatch(getTalentById(talent?._id))
                  dispatch(setSelectedPositionRecruitment(positionRec))
                }}
                style={{ background: "#FFAE00", borderColor: "#FFAE00", margin: '5px' }}>
                Talent Approached
									</Button>
            </Col>}

          </Row>
          <Modal
            title="Interview Status"
            visible={removeModalVisible}
            onOk={handleRemoveModalOk}
            onCancel={handleRemoveModalCancel}
          >
            <h6>Are your sure to Remove the candidate ?</h6>
            <h6>Name: {selectedPosRec?.candidateId?.name}</h6>
            <h6>Email: {selectedPosRec?.candidateId?.email}</h6>
          </Modal>
        </div>
      })
        : <div style={{ margin: '10px 0px' }}>
          <h3>No Shortlist Candidates found</h3>
        </div>}

    </div>
  )
}
export default Shortlist;
