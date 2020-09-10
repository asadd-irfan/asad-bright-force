import React, { useState, } from 'react';
import { Form, Row, Col, Input } from 'antd';
import TagInput from '../EditPosition/TagInput'
import { useSelector, useDispatch } from "react-redux";
import {
    NEW_POSITION_FEATURES,
    NEW_POSITION_ROLE_FEATURES,

} from '../../../actions/types';


const PositionFeaturesModal = () => {

    const appConfigs = useSelector(state => state.auth.appConfigs);
    const newPositionFeatures = useSelector(state => state.positions.newPositionFeatures)
    const newPositionRoleFeatures = useSelector(state => state.positions.newPositionRoleFeatures)
    const dispatch = useDispatch()

    const appConfigRoles = appConfigs && appConfigs['role-features']
    const [selectedRoles, setSelectedRoles] = useState(newPositionRoleFeatures);
    const roleFeaturesKey = 'role-features'

    const [selectedSortedRoles, setSelectedSortedRoles] = useState(newPositionFeatures.length === 0 ? [
        { id: "item-1", tagId: null, tagName: null, priorityOrder: 0 },
        { id: "item-2", tagId: null, tagName: null, priorityOrder: 0 },
        { id: "item-3", tagId: null, tagName: null, priorityOrder: 0 }
    ] : newPositionFeatures);


    const handleTagChange = (checked, id, name, key) => {

        if (key === roleFeaturesKey) {
            let selectedRolesLocally = selectedRoles;
            if (checked && selectedRolesLocally.length < 3) {
                selectedRolesLocally.push(id);

                let selectedSortedRolesLocally = [...selectedSortedRoles];
                let isPushed = false
                selectedSortedRolesLocally.map((item, index) => {
                    if (selectedSortedRolesLocally[index].tagName === null && isPushed === false) {
                        isPushed = true;
                        selectedSortedRolesLocally[index].tagName = name;
                        selectedSortedRolesLocally[index].tagId = id;
                    }
                    return null
                });

                setSelectedRoles([...selectedRolesLocally])
                setSelectedSortedRoles([...selectedSortedRolesLocally]);
                dispatch({
                    type: NEW_POSITION_ROLE_FEATURES,
                    payload: [...selectedRolesLocally]
                });
                dispatch({
                    type: NEW_POSITION_FEATURES,
                    payload: [...selectedSortedRolesLocally]
                });
            }
            else if (!checked && selectedRoles.includes(id)) {
                let selectedRolesLocally = selectedRoles;

                let filteredItems = selectedRolesLocally.filter(function (item) {
                    return item !== id;
                });
                if (selectedRoles.length > 0) {
                    selectedSortedRoles.map((item, ind) => {
                        if (item.tagId === id) {
                            selectedSortedRoles[ind].tagName = null;
                            selectedSortedRoles[ind].tagId = null;
                        }
                        return null
                    });

                    setSelectedRoles(filteredItems);
                    dispatch({
                        type: NEW_POSITION_ROLE_FEATURES,
                        payload: filteredItems
                    });
                }
                let nullItems = []
                let filledItems = selectedSortedRoles.filter(item => {
                    if (item.tagId === null) {
                        nullItems.push(item)
                        return null
                    }
                    else if (item.tagId !== null) {
                        return item
                    }
                })
                setSelectedSortedRoles([...filledItems, ...nullItems]);
                dispatch({
                    type: NEW_POSITION_FEATURES,
                    payload: [...filledItems, ...nullItems]
                });

            }
        }

    };

    return (
        <div className="my-5">
            <div className="my-5">
                <h2>What does your position feature?</h2>
            </div>


            <TagInput
                title='Position Features'
                inputTitle='Selected Position features'
                tags={appConfigRoles && appConfigRoles}
                selectedTags={selectedRoles}
                parentHandleTagChange={handleTagChange}
                tagParentKey={roleFeaturesKey}
                setFunction={setSelectedSortedRoles}
                inputValues={selectedSortedRoles} />
        </div>
    )
}

export default PositionFeaturesModal;
