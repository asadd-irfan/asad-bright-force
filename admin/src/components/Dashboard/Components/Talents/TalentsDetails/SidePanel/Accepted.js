import React from 'react';
import { Button } from 'antd';
import MainInfo from './MainInfo';
import { useDispatch, useSelector } from "react-redux";
import { changeTalentProfileStatus } from '../../../../../../actions/talent'

function Accepted({
    mainInfoHeading,
    mainInfoSubHeading,
    mainInfoSubHeadingColor,
    mainInfoLastModified,
    mainInfoContacts,
    talent
}) {
    const dispatch = useDispatch();
    const btnLoading = useSelector(state => state.talents.btnLoading);

    const onChangeProfileStatus = (status) => {
        let id = talent && talent._id;
        const obj = {
            profileStatus: status
        }
        dispatch(changeTalentProfileStatus(obj, id))
    }
    return (
        <div>
            <div className='mb-20'>
                <MainInfo
                    heading={mainInfoHeading}
                    subHeading={mainInfoSubHeading}
                    subHeadingColor={mainInfoSubHeadingColor}
                    lastModified={mainInfoLastModified}
                    contacts={mainInfoContacts}
                />
            </div>

            {talent && talent.profileStatus === 'active' && <div className='text-center mb-20'>
                <Button loading={btnLoading} type="default" className='btn-green' >
                    View Invites
                </Button>
            </div>}
        </div>
    )
}

export default Accepted;
