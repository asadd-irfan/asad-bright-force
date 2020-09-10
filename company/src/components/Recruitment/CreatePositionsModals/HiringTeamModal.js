import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Typography, Select, Tag, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import {
    NEW_POSITION_HIRING_TEAM
} from '../../../actions/types';

const { Title, Paragraph } = Typography;
const { Option } = Select;


const HiringTeamModal = () => {
    const dispatch = useDispatch()
    const newPositionHiringTeam = useSelector(state => state.positions.newPositionHiringTeam)
    const loginUser = useSelector(state => state.auth.user);
    const [user, setUser] = useState([]);
    const [users, setUsers] = useState(newPositionHiringTeam);
    const [selectedUser, setSelectedUser] = useState([]);
    const [autoCompleteUser, setAutoCompleteUser] = useState([]);
    const [companyUsers, setCompanyUsers] = useState([]);
    const companyAllUsers = useSelector(state => state.company.companyUsers);

    useEffect(() => {

        let users = []
        if (loginUser) {
            let obj = {
                userId: loginUser._id,
                userName: loginUser.fullName
            }
            users.push(obj)
            setUsers(users)
            dispatch({
                type: NEW_POSITION_HIRING_TEAM,
                payload: users
            });

        }

    }, [loginUser])

    useEffect(() => {

        let users = []
        if (companyAllUsers) {
            companyAllUsers.map(user => {
                if (user.authorizations.includes("hire") && user._id !== loginUser._id) {
                    users.push(user)
                }
            })
            setCompanyUsers(users)
        }

    }, [companyAllUsers])

    const userHandleFocus = e => {
        let value = e.target.value
        let result;
        result = companyUsers && companyUsers.map(item => item.fullName).filter(item => {
            if (item.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                return item
            }
            return null
        });
        setUser(result);
    };

    const userSelectHandler = (value) => {
        let resultObj = companyUsers && companyUsers.filter(item => {
            if (item.fullName === value) {
                return item
            }
        })
        if (!selectedUser.includes(value)) {
            selectedUser.push(value);
            setSelectedUser([...selectedUser]);
            let usersLocally = [...users];
            let isPushed = false;
            selectedUser.map((item, index) => {
                if (isPushed === false) {
                    isPushed = true;
                    let obj = {
                        userId: resultObj && resultObj[0]._id,
                        userName: value,
                    }
                    usersLocally.push(obj);
                }
                return null
            });
            setUsers([...usersLocally]);
            dispatch({
                type: NEW_POSITION_HIRING_TEAM,
                payload: [...usersLocally]
            });

            setAutoCompleteUser('')
        }
        return "";
    };


    const userClearField = (e, index, value) => {
        e.preventDefault();
        if (loginUser.fullName === value) {
            notification.error({
                message: 'Error',
                description: 'You can not remove yourself.',
            });

        } else {
            let userArr = selectedUser.filter(item => {
                if (item !== value) {
                    return item
                }
                else { return null }
            })
            setSelectedUser(userArr)

            let usersLocally = users.filter(item => {
                if (item.userName !== value) {
                    return item
                }
                else { return null }
            })
            setUsers(usersLocally);
            dispatch({
                type: NEW_POSITION_HIRING_TEAM,
                payload: usersLocally
            });
        }

    }


    return (
        <div className="my-5">


            <div className='hiring-team-wrapper'>

                <Title level={3} className="my-3">Who else is on the hiring team?</Title>
                <>
                    <Row >

                        <Col xs={24} sm={24} md={16} lg={16}>
                            <Paragraph style={{ color: 'black', fontSize: '18px' }}>Hiring Team</Paragraph>
                        </Col>
                    </Row>
                    <Row >

                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Select
                                style={{ width: '100%', marginBottom: "20px" }}
                                onFocus={userHandleFocus}
                                onSelect={userSelectHandler}
                                value={autoCompleteUser}
                                showSearch
                                showArrow={false}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {user?.map(user => (
                                    <Option key={user}>{user}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row justify='start'>
                        <Col xs={23} sm={23} md={12} lg={12}>
                            {users?.map((item, index) => (
                                <Tag className="tag-style" key={index} style={{ marginRight: '15px', marginBottom: '5px', padding: '6px 8px 3px 8px', fontSize: '15px' }} closable onClose={(e) => userClearField(e, index, item.userName)}>
                                    {item.userName}
                                </Tag>
                            ))}
                        </Col>
                    </Row>

                </>
            </div>
        </div>
    )
}

export default HiringTeamModal;
