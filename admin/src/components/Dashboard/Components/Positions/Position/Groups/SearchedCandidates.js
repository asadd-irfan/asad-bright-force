import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Row, Col, Typography, Button, Modal, Checkbox } from 'antd';
import DetailsInfo from '../../Talent/DetailsInfo'

const { Paragraph } = Typography;

function SearchedCandidates({
  filteredListCandidates,
  setSendedTalentsList,
  handleProcessTalentsList,
  formRef
  //handleSubmitSearch,
}) {

  const btnLoading = useSelector(state => state.positions.btnLoading)
  // const groupData = useSelector(state => state.positions.groupData)

  const [talents, setTalents] = useState([])
  const [selectedTalents, setSelectedTalents] = useState([])
  const [deleteTalentModalVisible, setDeleteTalentModalVisible] = useState(false)
  const [deletedTalent, setDeletedTalent] = useState(null)
  const [allSelect, setAllSelect] = useState(false)

  // const handleDeleteTalentModalOk = () => {
  //   const updatedTalents = talents && talents.filter(talent => talent._id !== deletedTalent?.id)
  //   setTalents(updatedTalents)
  //   setSendedTalentsList(updatedTalents)
  //   setDeleteTalentModalVisible(false)
  // }
  // console.log('talents', talents)

  // const handleDeleteTalentModalCancel = () => {
  //   setDeleteTalentModalVisible(false)
  //   setDeletedTalent(null)
  // }

  // const removeTalentFromList = (talent) => {
  //   setDeleteTalentModalVisible(true)
  //   setDeletedTalent({
  //     id: talent._id,
  //     email: talent.email,
  //     name: talent.name,
  //   })
  // }

  useEffect(() => {
    if (filteredListCandidates && filteredListCandidates.length > 0) {
      setSendedTalentsList(filteredListCandidates)
    }
  }, [filteredListCandidates])
  // console.log('filteredListCandidates',filteredListCandidates)

  useEffect(() => {
    let allTalents = []
    if (filteredListCandidates && filteredListCandidates.length > 0) {
      setTalents(filteredListCandidates)
      filteredListCandidates.map(talent => {
        let obj = {
          talentDetails: talent, selected: true
        }
        allTalents.push(obj)
      })
      setSelectedTalents(allTalents)
    }else {
      setSelectedTalents([])
    }


  }, [filteredListCandidates])

  // console.log('selectedTalents', selectedTalents)
  // 
  const onChange = (e, id) => {
    let allTalents = []
    if (!e.target.checked) {
      selectedTalents.map(element => {
        if (element.talentDetails._id === id) {
          let obj = {
            talentDetails: element.talentDetails, selected: false
          }
          allTalents.push(obj)
        } else {
          allTalents.push(element)

        }
      })
    }
    if (e.target.checked) {
      selectedTalents.map(element => {
        if (element.talentDetails._id === id) {
          let obj = {
            talentDetails: element.talentDetails, selected: true
          }
          allTalents.push(obj)
        } else {
          allTalents.push(element)
        }
      })
    }
    setSelectedTalents(allTalents);
    let updatedTalents = [];
    allTalents.map(el => {
      if (el.selected === true) {
        updatedTalents.push(el.talentDetails)
      }
    })

    setSendedTalentsList(updatedTalents)

  }
  const onclickSelectALL = () => {
    if (filteredListCandidates.length > 0) {
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
    let talents = [];
    let processedTalents = [];
    if (allSelect === true) {
      selectedTalents.map(element => {
        let obj = {
          talentDetails: element.talentDetails, selected: true
        }
        talents.push(obj)
        processedTalents.push(element.talentDetails)

      })

      setSendedTalentsList(processedTalents)

    } else {
      selectedTalents.map(element => {
        let obj = {
          talentDetails: element.talentDetails, selected: false
        }
        talents.push(obj)

      })
      setSendedTalentsList([])

    }
    setSelectedTalents(talents)

  }


  return (
    <div style={{ margin: '10px 0px' }}>
      <Row className="my-5">
        {
        // (groupData === null || groupData?.["group" + selectedIndex] === null || groupData?.["group" + selectedIndex] === undefined) === false && 
        <Col xs={24} sm={24} md={14} lg={14}>
          <Button
            type="primary"
            // htmlType='submit'
            // onClick={handleSubmitSearch}
            onClick={()=>{
              formRef.current.submit();
            }}
            loading={btnLoading}
          >
            SEARCH
              </Button>
        </Col>}
        {(filteredListCandidates.length > 0) &&
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
                type="primary"
                onClick={handleProcessTalentsList}
                loading={btnLoading}
              >
                Add all selected to Recruitment Shortlist
              </Button>
            </Col></>}


      </Row>
      {selectedTalents && selectedTalents.map((element, index) => {
        let talent = element.talentDetails
        return <div key={index} style={{ border: '2px solid', margin: '10px 0px', backgroundColor: 'white' }}>
          <Row className='vertical-middle-align'>
            <Col xs={7} sm={7} md={5} lg={5} style={{ textAlign: 'center' }}>
              <Paragraph>
                <b>Number (Rank):</b> {index + 1}
              </Paragraph>
              <Paragraph>
                <b>Matching Score:</b> {talent.score}
              </Paragraph>
            </Col>
            <Col xs={17} sm={17} md={19} lg={19} style={{ borderLeft: '2px solid', padding: '15px' }}>
              <DetailsInfo talent={talent} />
              <Paragraph>
                {/* <Button
                    style={{ float: 'right'}}
                    type="danger"
                    onClick={() => removeTalentFromList(talent)}
                  >
                    Remove from Recruitment ShortList
                  </Button> */}
                <Checkbox style={{ float: 'right' }}
                  checked={element.selected}
                  onChange={(e) => onChange(e, talent._id)}
                >
                  Recruitment ShortList (bulk)
          </Checkbox>
              </Paragraph>
            </Col>
          </Row>
        </div>
      })}



      {/* <Modal
        title="Remove Talent"
        visible={deleteTalentModalVisible}
        onOk={handleDeleteTalentModalOk}
        onCancel={handleDeleteTalentModalCancel}
      >
        <h5>Are you sure to remove talent from position</h5>
        <h6>Name: {deletedTalent?.name}</h6>
        <h6>Email: {deletedTalent?.email}</h6>
      </Modal> */}
    </div>
  )
}

export default SearchedCandidates
