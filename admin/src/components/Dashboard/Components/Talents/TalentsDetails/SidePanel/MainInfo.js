import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Input } from 'antd';
import { PlusCircleFilled, DeleteOutlined } from '@ant-design/icons';
import './sidePanel.scss'
import { useDispatch } from 'react-redux';
import { saveTalentContact, deleteTalentContact } from '../../../../../../actions/talent'
import { MOMENT_DATE_FORMAT } from '../../../../../../common/constants'
import { useSelector } from "react-redux";
import moment from 'moment'


function MainInfo({
    heading,
    subHeading,
    lastModified,
    contacts,
    subHeadingColor
}) {

    const appConfigs = useSelector(state => state.auth.appConfigs);
    let typeOptions = appConfigs && appConfigs['roles']
    let roleOptions = appConfigs && appConfigs['preferred-role']

    const [typeName, setTypeName] = useState(false)
    const [mainRoleName, setMainRoleName] = useState(false)
    const [secondaryRoleName, setSecondaryRoleName] = useState(false)
    const [contactModal, setContactModal] = useState(false)
    const [selectedContactId, setSelectedContactId] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const talent = useSelector(state => state.talents.selectedTalent && state.talents.selectedTalent);
    const [contactNote, setContactNote] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        if (talent && talent.role) {
            typeOptions && typeOptions.filter(type => {
                if (type._id === talent.role) {
                    setTypeName(type.name)
                }
            })
        }

        if (talent && talent.preferredRoles) {
            roleOptions && roleOptions.filter(role => {
                if (role._id === talent.preferredRoles.mainRole.name) {
                    setMainRoleName(role.name)
                }
            })
            roleOptions && roleOptions.filter(role => {
                if (role._id === talent.preferredRoles.secondaryRole.name) {
                    setSecondaryRoleName(role.name)
                }
            })
        }

    }, [talent, appConfigs])

    const showContactModal = () => {
        setContactModal(true);
    };
    const showDeleteModal = (id) => {
        setDeleteModal(true);
        setSelectedContactId(id);
    };

    const handleOkModal = e => {
        const obj = {
            notes: contactNote
        };
        const id = talent && talent._id;
        dispatch(saveTalentContact(obj, id))
        setContactModal(false);
        setContactNote('');
    };
    const handleOkDeleteModal = e => {
        const contactId = selectedContactId;
        const talentId = talent && talent._id;
        dispatch(deleteTalentContact(contactId, talentId))
        setDeleteModal(false);
    };

    const cancelContactModal = e => {
        setContactModal(false);
        setContactNote('');
    };
    const cancelDeleteModal = e => {
        setDeleteModal(false);
    };


    return (
        <div>
            <div className='horizontally-middle mb-10'>
                <h4>{heading}</h4>
                <h5 style={{ color: subHeadingColor }}>{subHeading}</h5>
            </div>
            <Row>
                <h6 className="m-2">Contact Talent </h6>  <PlusCircleFilled className="m-2" style={{ fontSize: '25px' }} onClick={showContactModal} />

            </Row>
            <div className='mb-10'>
                <u> <h6>Last Modified: </h6> </u>
                <p className="my-2">{lastModified}</p>
            </div>
            <div className='mb-10'>
                {contacts.length > 0 && <u><h6>Contacts: </h6></u>}
                {contacts.map((contact, index) => {
                    return (
                        <div key={index}>
                            <Row className='word-break'>
                                <Col xs={7} sm={7} md={7} lg={7}>
                                    <p style={{ fontSize: '11px' }}>{moment(contact.date).format(MOMENT_DATE_FORMAT)}</p>

                                </Col>
                                <Col xs={10} sm={10} md={10} lg={10}>
                                    <p style={{ fontSize: '11px' }}>{contact.notes}</p>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <p style={{ fontSize: '11px' }}> {contact.admin.name}</p>
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} style={{ bottom: '8px', fontSize: '20px' }} >
                                    <DeleteOutlined onClick={() => showDeleteModal(contact._id)} />
                                </Col>
                            </Row>
                        </div>
                    )
                })}

            </div>

            <div className='mb-10'>
                <Row>
                    <Col xs={2} sm={2} md={2} lg={2}>

                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <h6>Type:</h6>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <h6>{typeName}</h6>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>

                    </Col>
                </Row>
                <Row>
                    <Col xs={2} sm={2} md={2} lg={2}>

                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <h6>Main Role:</h6>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <h6>{mainRoleName}</h6>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>

                    </Col>
                </Row>
                <Row>
                    <Col xs={2} sm={2} md={2} lg={2}>

                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <h6>Sec. Role:</h6>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <h6>{secondaryRoleName}</h6>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>

                    </Col>
                </Row>
            </div>

            <div className='mb-10'></div>

            <Modal
                title="Add Contact Note"
                visible={contactModal}
                onOk={handleOkModal}
                onCancel={cancelContactModal}
            >
                <h6>Add Note:</h6>
                <Input value={contactNote} onChange={(e) => setContactNote(e.target.value)} />
            </Modal>
            <Modal
                visible={deleteModal}
                onOk={handleOkDeleteModal}
                onCancel={cancelDeleteModal}
            >
                <h6>Are your sure to delete!</h6>
            </Modal>
        </div>
    )
}

export default MainInfo;
