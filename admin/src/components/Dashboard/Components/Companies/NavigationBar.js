import React from 'react';
import { Row, Col, Menu } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { setSidebarKey } from '../../../../actions/common'
import './companies.scss'

const MenuItem = ({ text, count, onChangeNavItem, isInnerItem, isCount, isCurrent }) => {
    return (
        <Row>
            <Col xs={22} sm={22} md={22} lg={22} onClick={onChangeNavItem}
                className={
                    isInnerItem && 'pl-5'
                }
            >
                {isCurrent ? <strong style={{ color: '#d8ff00' }}>{text}</strong> : text}
            </Col>
            {isCount && <Col xs={2} sm={2} md={2} lg={2}
                style={{
                    alignSelf: 'center',
                }}
            >
                <div className='circle'>{count}</div>
            </Col>}
        </Row>
    )
}

function NavigationBar({
    onChangeSelectedNavItem,
    onGetAllCompaniesByStatus,
    onGetCompaniesRequests,
}) {
    const dispatch = useDispatch();
    const sidebarKey = useSelector(state => state.auth.sidebarKey)
    const companyAndRequestsCount = useSelector(state => state.company.companyAndRequestsCount)

    const handleMenuClick = (e) => {
        dispatch(setSidebarKey(e.key))
    }

    return (

        <div className='menu-wrapper'>
            <Menu theme="dark" onClick={handleMenuClick} selectedKeys={[sidebarKey]}>
                <Menu.Item key="1">
                    <MenuItem isCurrent={sidebarKey === '1' ? true : false} text='BrightForce Companies(All)' isCount={false} onChangeNavItem={() => onChangeSelectedNavItem('all')} />
                </Menu.Item>
                <Menu.Item key="2">
                    <MenuItem isCurrent={sidebarKey === '2' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.registeredCompanies} isInnerItem text='Registered' isCount={true} onChangeNavItem={() => onGetAllCompaniesByStatus('registered')} />
                </Menu.Item>
                <Menu.Item key="3">
                    <MenuItem isCurrent={sidebarKey === '3' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.notRegisteredCompanies} isInnerItem text='Un Registered' isCount={true} onChangeNavItem={() => onGetAllCompaniesByStatus('not-registered')} />
                </Menu.Item>
                <Menu.Item key="4" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '4' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.newlyInactiveCompanies} isInnerItem text='Newly Inactive' isCount={true} onChangeNavItem={() => onGetAllCompaniesByStatus('newly-inactive')} />
                </Menu.Item>
                <Menu.Item key="5">
                    <MenuItem isCurrent={sidebarKey === '5' ? true : false} text='Company Requests' isCount={false} onChangeNavItem={() => onChangeSelectedNavItem('requests')} />
                </Menu.Item>
                <Menu.Item key="6">
                    <MenuItem isCurrent={sidebarKey === '6' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.pendingRequests} isInnerItem text='Pending' isCount={true} onChangeNavItem={() => onGetCompaniesRequests('pending')} />
                </Menu.Item>
                <Menu.Item key="7">
                    <MenuItem isCurrent={sidebarKey === '7' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.handledRequests} isInnerItem text='Handled' isCount={true} onChangeNavItem={() => onGetCompaniesRequests('handled')} />
                </Menu.Item>
                <Menu.Item key="8">
                    <MenuItem isCurrent={sidebarKey === '8' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.closedRequests} isInnerItem text='Closed' isCount={true} onChangeNavItem={() => onGetCompaniesRequests('closed')} />
                </Menu.Item>
                <Menu.Item key="9" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '9' ? true : false} count={companyAndRequestsCount && companyAndRequestsCount.deniedRequests} isInnerItem text='Denied' isCount={true} onChangeNavItem={() => onGetCompaniesRequests('denied')} />
                </Menu.Item>
                <Menu.Item key="10" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '10' ? true : false} text='Suggestions' isCount={false} onChangeNavItem={() => onChangeSelectedNavItem('suggestions')} />
                </Menu.Item>
            </Menu>
        </div>

    )
}

export default NavigationBar;
