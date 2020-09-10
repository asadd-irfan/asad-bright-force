import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import CompanyDetailsCard from './CompanyDetailsCard'
import { Row, Col } from 'antd';
import { usePrevious } from '../../common/commonMethods';
import { getAllInvites, getPositionDetailOfAllInvites } from '../../actions/invites'

function Invites() {

  const dispatch = useDispatch();
  const allDBInvites = useSelector(state => state.invites.allInvites)
  const allInvitePositionDetails = useSelector(state => state.invites.allInvitePositionDetails)
  const [inviteAllDetails, setInviteAllDetails] = useState([])
  const prevAllDBInvites = usePrevious(allDBInvites)

  useEffect(() => {
    dispatch(getAllInvites())
  }, [])

  useEffect(() => {
    if (prevAllDBInvites?.length === 0) {
      allDBInvites.forEach(element => {
        if (element) {
          let positionId = element?.position
          dispatch(getPositionDetailOfAllInvites(positionId))
        }
      });
    }
  }, [allDBInvites, prevAllDBInvites])

  useEffect(() => {
    let invitesArray = []


    allDBInvites && allDBInvites.map((invite, indexDb) => {
      let position = allInvitePositionDetails && allInvitePositionDetails.find(element => element._id == invite?.position);
      if (position) {
        invitesArray.push({
          "position": position,
          "invite": invite,
        })
      }
    })
    setInviteAllDetails(invitesArray)
  }, [allInvitePositionDetails])
  return (
    <div>
      {inviteAllDetails === undefined &&
        <Row justify='center' className="my-5 py-5">
          <h1>Loading</h1>
        </Row>}
      {inviteAllDetails?.length === 0 &&
        <Row justify='center' className="my-5 py-5">
          <h1>No Invites found.</h1>
        </Row>}
      {inviteAllDetails?.length > 0 && <Row>

        {inviteAllDetails && inviteAllDetails.map((invite, index) => {
          return <Col key={index}>
            <CompanyDetailsCard inviteDetails={invite.invite} positionDetails={invite.position} />
          </Col>
        })}
      </Row>}

    </div>
  )
}

export default Invites
