import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Typography, Button, Modal, Checkbox } from 'antd';
import DetailsInfo from '../../Talent/DetailsInfo'
import { deleteProcessedTalents, getProcessedPositionTalents } from '../../../../../../actions/positions'

const { Paragraph } = Typography;

function FilteredListCandidates({
  processedPositionTalents,
  handleDispatchTalentsList,
  setProcessedTalentsList,
  positionId
}) {
  const dispatch = useDispatch();

  console.log('processedPositionTalents', processedPositionTalents)
  const btnLoading = useSelector(state => state.positions.btnLoading)


  const [talents, setTalents] = useState([])
  const [removeCandidates, setRemoveCandidates] = useState([])
  const [allSelect, setAllSelect] = useState(true)



  // useEffect(() => {
  //   setTalents(processedPositionTalents)
  // }, [processedPositionTalents]) 

  useEffect(() => {
    let allTalents = []
    let processTalents = []
    if (processedPositionTalents && processedPositionTalents.length > 0) {
      processedPositionTalents.sort((talent1, talent2) => talent2.matchingScore - talent1.matchingScore);

      processedPositionTalents.map(element => {
        let obj = {
          talentDetails: element.candidateId, selected: false, id: element._id, score: element.matchingScore
        }
        allTalents.push(obj);
        let data = {
          talentDetails: element.candidateId, score: element.matchingScore
        }
        processTalents.push(data);
      })
      setTalents(allTalents)
      setProcessedTalentsList(processTalents)
      // console.log('processTalents', processTalents)

    } else {
      setTalents([])

    }

  }, [processedPositionTalents])
  // console.log('talents', talents)
  // console.log('removeCandidates', removeCandidates)


  const removeSelectedCandidates = () => {
    if (removeCandidates.length > 0) {
      dispatch(deleteProcessedTalents(removeCandidates,positionId)).then(() => {
        dispatch(getProcessedPositionTalents(positionId))
      })
    }

  }


  const onChange = (e, id) => {
    let allTalents = []
    if (!e.target.checked) {
      talents.map(element => {
        if (element.id === id) {
          let obj = {
            talentDetails: element.talentDetails, selected: false, id: element.id, score: element.score
          }
          allTalents.push(obj)
        } else {
          allTalents.push(element)
        }
      })
    }
    if (e.target.checked) {
      talents.map(element => {
        if (element.id === id) {
          let obj = {
            talentDetails: element.talentDetails, selected: true, id: element.id, score: element.score
          }
          allTalents.push(obj)
        } else {
          allTalents.push(element)
        }
      })
    }
    setTalents(allTalents);

    let removeTalents = [];
    allTalents.map(el => {
      if (el.selected === true) {
        removeTalents.push(el.id)
      }
    })

    setRemoveCandidates(removeTalents);

  }

  const onclickSelectALL = () => {
    if (processedPositionTalents && processedPositionTalents.length > 0) {
      if (allSelect === true) {
        setAllSelect(false);
        selectUnselectAll();

      }
      if (allSelect === false) {
        setAllSelect(true);
        selectUnselectAll();
      }

    }
  }

  const selectUnselectAll = () => {
    let talentList = [];
    if (allSelect === true) {
      talents.map(element => {
        let obj = {
          talentDetails: element.talentDetails, selected: true, id: element.id, score: element.score
        }
        talentList.push(obj)
      })

    } else {
      talents.map(element => {
        let obj = {
          talentDetails: element.talentDetails, selected: false, id: element.id, score: element.score
        }
        talentList.push(obj)

      })

    }
    setTalents(talentList)

  }



  return (
    <div style={{ margin: '10px 0px' }}>
      <Row className="my-5">
        <Col xs={24} sm={24} md={14} lg={14}>

        </Col>
        {(processedPositionTalents?.length > 0) &&
          <>
            <Col xs={12} sm={12} md={4} lg={4}>
              <Button
                type="primary"
                onClick={onclickSelectALL}
                loading={btnLoading}
              >
                Select/UnSelect all
              </Button>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} style={{ textAlign: 'center' }}>

              <Button
                type="danger"
                onClick={removeSelectedCandidates}
                loading={btnLoading}
              >
                Remove all Selected Shortlist
              </Button>
            </Col></>}


      </Row>

      {talents && talents.map((element, index) => {
        let talent = element.talentDetails;

        return <div key={index} style={{ border: '2px solid', margin: '10px 0px', backgroundColor: 'white' }}>
          <Row className='vertical-middle-align'>
            <Col xs={7} sm={7} md={5} lg={5} style={{ textAlign: 'center' }}>
              <Paragraph>
                <b>Number (Rank):</b> {index + 1}
              </Paragraph>
              <Paragraph>
                <b>Matching Score:</b> {element.score}
              </Paragraph>
            </Col>
            <Col xs={17} sm={17} md={19} lg={19} style={{ borderLeft: '2px solid', padding: '15px' }}>
              <DetailsInfo talent={talent} />
              <Paragraph>

                <Checkbox style={{ float: 'right' }}
                  checked={element.selected}
                  onChange={(e) => onChange(e, element.id)}
                >
                  Remove from Shortlist (bulk)
          </Checkbox>
              </Paragraph>
            </Col>
          </Row>
        </div>
      })}

      {((processedPositionTalents?.length > 0)) &&
        <Row>
          <Col xs={0} sm={0} md={1} lg={1}>

          </Col>
          <Col xs={24} sm={24} md={22} lg={22} style={{ textAlign: 'center' }}>

            <Button
              type="primary"
              onClick={handleDispatchTalentsList}
              loading={btnLoading}
            >
              Dispatch Talents List To Company
              </Button>
          </Col>
          <Col xs={0} sm={0} md={1} lg={1}>

          </Col>
        </Row>}


    </div>
  )
}

export default FilteredListCandidates
