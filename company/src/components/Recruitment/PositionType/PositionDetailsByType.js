import React, { useEffect, useState } from 'react';
import { Collapse, Button, Row, Col, Modal } from 'antd';
import '../recruitment.scss';
import { useSelector, useDispatch } from 'react-redux'
import { editCompanyPosition, restoreCompanyPosition, getAllPositionsByType, setSelectedPositionId } from '../../../actions/positions'
import { useHistory } from 'react-router-dom';
import './style.scss'
import { HistoryOutlined, PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons'

const { Panel } = Collapse;

function PositionDetails({
  openPositionModal
}) {
  const history = useHistory();
  const [activePositions, setActivePositions] = useState(null);
  const [hiredPositions, setHiredPositions] = useState(null);
  const [deletedPositions, setDeletedPositions] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedPositionId, setDeletedPositionId] = useState();
  const [restoreModal, setRestoreModal] = useState(false);
  const [restorePositionId, setRestorePositionId] = useState();
  const dispatch = useDispatch()
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const rolesOptions = appConfigs && appConfigs['roles']
  const allPositions = useSelector(state => state.positions.allPositionsByType);

  useEffect(() => {
    // dispatch(getAllCompanyPositions())
    dispatch(getAllPositionsByType())
  }, [])

  useEffect(() => {
    let positionsArr = [], positionsHiredArr = [], positionsDeletedArr = [];
    let companyActivePositions, companyHiredPositions, companyDeletedPositions;
    if (allPositions) {
      companyActivePositions = allPositions?.activePositions;
      companyHiredPositions = allPositions?.hiredPositions;
      companyDeletedPositions = allPositions?.deletedPositions;
    }
    if (companyActivePositions?.length > 0) {
      companyActivePositions && companyActivePositions.map((pos) => {
        rolesOptions && rolesOptions.filter((role) => {
          if (role._id === pos.name._id) {
            positionsArr.push({
              id: pos._id,
              name: role.name,
              title: pos.title,
              employment: pos.employmentType
            })
          }
        })

      })
    }

    if (companyHiredPositions?.length > 0) {
      companyHiredPositions && companyHiredPositions.map((pos) => {
        rolesOptions && rolesOptions.filter((role) => {
          if (role._id === pos.name._id) {
            positionsHiredArr.push({
              id: pos._id,
              name: role.name,
              title: pos.title,
              employment: pos.employmentType
            })
          }
        })

      })
    }


    if (companyDeletedPositions?.length > 0) {
      companyDeletedPositions && companyDeletedPositions.map((pos) => {
        rolesOptions && rolesOptions.filter((role) => {
          if (role._id === pos.name._id) {
            positionsDeletedArr.push({
              id: pos._id,
              name: role.name,
              title: pos.title,
              employment: pos.employmentType
            })
          }
        })

      })
    }


    setActivePositions(positionsArr)
    setHiredPositions(positionsHiredArr)
    setDeletedPositions(positionsDeletedArr)
  }, [allPositions, rolesOptions])

  console.log('activePositions', activePositions)
  // console.log('hiredPositions', hiredPositions)
  console.log('deletedPositions', deletedPositions)

  const goToDetails = (key) => {
    history.push(`/company/hire/recruitment/details/${key}`);
    dispatch(setSelectedPositionId(key))
  }

  const openDeleteModal = (id) => {
    setDeletedPositionId(id)
    setDeleteModal(true)
  }

  const handleDeleteModalOk = e => {
    let obj = {
      isDeleted: true
    };
    dispatch(editCompanyPosition(obj, deletedPositionId)).then(() => {
      dispatch(getAllPositionsByType())
      setDeleteModal(false);
    });
  };

  const handleDeleteModalCancel = e => {
    setDeleteModal(false);
  };

  const openRestoreModal = (id) => {
    setRestorePositionId(id)
    setRestoreModal(true)
  }

  const handleRestoreModalOk = e => {
    dispatch(restoreCompanyPosition(restorePositionId)).then(() => {
      dispatch(getAllPositionsByType())
      setRestoreModal(false);
    });
  };

  const handleRestoreModalCancel = e => {
    setRestoreModal(false);
  };
  const goToCreatePosition = () => {
    history.push(`/company/hire/position`);
  };

  return (
    <>

      <div style={{ marginBottom: '20px' }}>
        <div className="mb-5" style={{ textAlign: 'center' }}>
          <h2>Positions</h2>
        </div>
        <div className="mb-3">
          <Button type='primary' icon={<PlusOutlined />}
            // onClick={openPositionModal}
            onClick={goToCreatePosition}
          >Post a Position</Button>
        </div>
        <div className="mb-3">
          <Collapse
            defaultActiveKey={['1']}
            expandIconPosition={'right'}
          >
            <Panel header={`Active Positions (${activePositions?.length})`} key="1" >
              <div className={activePositions?.length > 0 ? "collapse-height" : ''}>
                {activePositions?.length === 0 &&
                  <div style={{ textAlign: 'center' }}>
                    <h5>No Positions Found!</h5>
                  </div>}
                {activePositions && activePositions.map((pos, index) => {
                  // console.log('position',pos)
                  return <div key={index}><Row>
                    <Col xs={24} sm={24} md={12} lg={12} style={{ wordWrap: 'break-word' }}>
                      <div style={{ margin: '30px 0px', }} onClick={() => goToDetails(pos?.id)} className='position-heading' >
                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.title}
                        </h6><br />

                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.name}
                        </h6>, &nbsp;

                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.employment?.name}

                        </h6>

                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={7} lg={7} style={{ wordWrap: 'break-word' }}>

                      <Row className="m-0">
                        <Col xs={6} sm={6} md={6} lg={6}>
                          <div className='number-circle'>0</div>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={18}>
                          <p>
                            Candidates
						              </p>

                        </Col>

                      </Row>
                      <Row className="m-0">

                        <Col xs={6} sm={6} md={6} lg={6}>
                          <div className='number-circle'>0</div>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={18}>
                          <p>
                            Shortlist
					              </p>

                        </Col>

                      </Row>
                      <Row className="m-0">

                        <Col xs={6} sm={6} md={6} lg={6}>
                          <div className='number-circle'>0</div>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={18}>
                          <p>
                            Interview
						</p>

                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={5} style={{ wordWrap: 'break-word' }}>
                      <Row>
                        <EditFilled className="m-2" onClick={() => goToDetails(pos?.id)} style={{ fontSize: 28, color: '#668DB0', cursor: 'pointer' }} />
                        <DeleteFilled className="m-2" onClick={() => openDeleteModal(pos?.id)} style={{ fontSize: 28, color: 'red', cursor: 'pointer' }} />
                      </Row>

                    </Col>


                  </Row>
                    <hr style={{ border: '1px solid black' }} />
                  </div>

                })}
              </div>

            </Panel>
          </Collapse>
        </div>

        <div className="mb-3">

          <Collapse
            // defaultActiveKey={['1']}
            expandIconPosition={'right'}
          >
            <Panel header={`Hired Positions (${hiredPositions?.length})`} key="1" >

              <div className={hiredPositions?.length > 0 ? "collapse-height" : ''}>
                {hiredPositions?.length === 0 &&
                  <div style={{ textAlign: 'center' }}>
                    <h5>No Positions Found!</h5>
                  </div>}
                {hiredPositions && hiredPositions.map((pos, index) => {
                  // console.log('position',pos)
                  return <div key={index}><Row>
                    <Col xs={15} sm={15} md={15} lg={15} style={{ wordWrap: 'break-word' }}>

                      <div onClick={() => goToDetails(pos?.id)} className='position-heading' >
                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.title}
                        </h6><br />

                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.name}
                        </h6>, &nbsp;

                <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.employment?.name}

                        </h6>
                      </div>
                    </Col>

                    <Col xs={9} sm={9} md={9} lg={9} style={{ wordWrap: 'break-word' }}>
                      *TalentName* was hired
                      Onboarding Date: 12 august 2020
                    </Col>

                  </Row>
                    <hr style={{ border: '1px solid black' }} />
                  </div>

                })}
              </div>

            </Panel>
          </Collapse>

        </div>

        <div className="mb-3">

          <Collapse
            // defaultActiveKey={['1']}
            expandIconPosition={'right'}
          >
            <Panel header={`Deleted Positions (${deletedPositions?.length})`} key="1" >
              <div className={deletedPositions?.length > 0 ? "collapse-height" : ''} >
                {deletedPositions?.length === 0 &&
                  <div style={{ textAlign: 'center' }}>
                    <h5>No Positions Found!</h5>
                  </div>}
                {deletedPositions && deletedPositions.map((pos, index) => {
                  // console.log('position',pos)
                  return <div key={index}><Row>
                    <Col xs={14} sm={14} md={14} lg={14} style={{ wordWrap: 'break-word' }}>


                      <div style={{ margin: '30px 0px', }} onClick={() => goToDetails(pos?.id)} className='position-heading' >
                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.title}
                        </h6><br />

                        <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.name}
                        </h6>, &nbsp;

                <h6
                          style={{ margin: '20px 0px', display: 'inline' }}
                        >{pos?.employment?.name}

                        </h6>

                      </div>
                    </Col>

                    <Col xs={10} sm={10} md={10} lg={10} style={{ wordWrap: 'break-word' }}>
                      <Button className="mt-4" icon={<HistoryOutlined />} onClick={() => openRestoreModal(pos?.id)} >Restore Position</Button>
                    </Col>

                  </Row>
                    <hr style={{ border: '1px solid black' }} />
                  </div>


                })}
              </div>

            </Panel>
          </Collapse>

        </div>
      </div>
      <Modal
        title="Delete Position"
        visible={deleteModal}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
      >
        <h6>"Are you sure you want to delete this position?.... All your candidates and your contact with them will be lost"
          afterwards the positions will be moved into the deleted list.</h6>
      </Modal>
      <Modal
        title="Restore Position"
        visible={restoreModal}
        onOk={handleRestoreModalOk}
        onCancel={handleRestoreModalCancel}
      >
        <h6>"Would like to restore this position?... this will initiate the position with its original requirements"</h6>
      </Modal>
    </>
  )
}

export default PositionDetails;
