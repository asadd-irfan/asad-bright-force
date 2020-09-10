import React, { useEffect, useState } from 'react';
import { Button, notification } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { CURRENT_GROUP_INDEX } from '../../../../../../actions/types'
import { MOMENT_DATE_FORMAT } from '../../../../../../common/constants'
import moment from 'moment';

function Groups({
  onChangeGroupIndex,
  selectedIndex,
  onChangeTabKey,
  groupsInfo
}) {
  const dispatch = useDispatch();

  const selectedPositionDetails = useSelector(state => state.positions.selectedPositionDetails)
  const currentGroupIndex = useSelector(state => state.positions.currentGroupIndex)
  const [groupsArray, setGroupsArray] = useState(selectedPositionDetails?.groupsInfo?.length === 0 ? [1] : [...Array(selectedPositionDetails?.groupsInfo?.length).keys()].map(i => i + 1))

  useEffect(() => {
    setGroupsArray(selectedPositionDetails?.groupsInfo?.length === 0 ? [1] : [...Array(selectedPositionDetails?.groupsInfo?.length).keys()].map(i => i + 1))
  }, [selectedPositionDetails])

  const onAddNewGroup = () => {
    if (groupsArray?.length < selectedPositionDetails?.groupConfigs?.totalGroups) {
      let groupIndex = currentGroupIndex + 1;
      if (selectedPositionDetails
        && selectedPositionDetails.groupsInfo !== null
        && selectedPositionDetails.groupsInfo !== undefined
        && selectedPositionDetails.groupsInfo.length > 0) {
        if (selectedPositionDetails.groupsInfo.length === currentGroupIndex) {
          setGroupsArray([...groupsArray, groupIndex])
          dispatch({
            type: CURRENT_GROUP_INDEX,
            payload: groupIndex
          })
          onChangeGroupIndex(groupIndex)
          onChangeTabKey("0")
        }
      }
    }
    else {
      notification.error({
        message: "Error",
        description: "Cannot add more group"
      })
    }

  }


  return (
    <div>

      {groupsArray && groupsArray.map((currentIndex, i) => {
        return <Button
          key={i}
          type={currentIndex === selectedIndex ? 'primary' : "default"}
          style={{ margin: '0px 5px' }}
          onClick={() => onChangeGroupIndex(currentIndex)}

        >
          Group {currentIndex} &nbsp; {groupsInfo && groupsInfo.map((info, index) => {
          if (i == index) {
            return '(' + moment(info.dispatchDate).format(MOMENT_DATE_FORMAT) + ')'
          }
        })}
        </Button>
      })}

      <Button type="default" onClick={onAddNewGroup} style={{ margin: '0px 5px' }}>
        +
      </Button>
    </div>
  )
}

export default Groups;
