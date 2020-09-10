import React, { useState, useEffect } from 'react';
import { Row, Col, Menu } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { SET_POSITION_SIDEBAR_KEY } from '../../../../actions/types'
import { getPositionsCount } from '../../../../actions/positions'
import './positions.scss'

const MenuItem = ({ text, isInnerItem, onChangeNavItem, isCount, isCurrent, count  }) => {
    return (
        <Row>
            <Col xs={22} sm={22} md={22} lg={22} onClick={onChangeNavItem} 
                className={
                    isInnerItem && 'pl-5'
                }
                >
                {isCurrent ? <strong style={{ color: '#d8ff00'}}>{text}</strong> : text}
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
}) {
    const dispatch = useDispatch();
    const sidebarKey = useSelector(state => state.positions.sidebarKey)
    const positionsCount = useSelector(state => state.positions.positionsCount)

    useEffect(() => {
      dispatch(getPositionsCount())
    }, [])
    const handleMenuClick = (e) => {
        dispatch({
            type: SET_POSITION_SIDEBAR_KEY,
            payload: e.key
          });
    }
    
    return (

        <div className='menu-wrapper'>
            <Menu theme="dark" onClick={handleMenuClick}  selectedKeys={[sidebarKey]}>
                <Menu.Item key="1" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '1' ? true : false} isCount={true} count={positionsCount?.allPositions}  text='Company Positions' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','')}/>
                </Menu.Item>
                <Menu.Item key="2">
                    <MenuItem isCurrent={sidebarKey === '2' ? true : false}  text='Open Positions' />
                </Menu.Item>
                <Menu.Item key="3" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '3' ? true : false} isCount={true} count={positionsCount?.openUnProcessed} isInnerItem text='Un Processed' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','Open', 'un-processed')}/>
                </Menu.Item>
                <Menu.Item key="4" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '4' ? true : false} isCount={true} count={positionsCount?.openProcessed} isInnerItem text='Processed' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','Open', 'processed')}/>
                </Menu.Item>
                <Menu.Item key="5" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '5' ? true : false} isCount={true} count={positionsCount?.openActionRequired} isInnerItem text='Action Required' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','Open', 'action-required')}/>
                </Menu.Item>
                <Menu.Item key="6" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '6' ? true : false} isCount={true} count={positionsCount?.openFulfilled} isInnerItem text='Fulfilled' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','Open', 'fulfilled')}/>
                </Menu.Item>

                <Menu.Item key="7">
                    <MenuItem isCurrent={sidebarKey === '7' ? true : false}  text='Closed Positions' />
                </Menu.Item>
                <Menu.Item key="8" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '8' ? true : false} isCount={true} count={positionsCount?.closedHired} isInnerItem text='Hired' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','Closed - Hired', null)}/>
                </Menu.Item>
                <Menu.Item key="9" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '9' ? true : false} isCount={true} count={positionsCount?.closedOthers} isInnerItem text='Other' onChangeNavItem={() => onChangeSelectedNavItem('allCompanyPositions','Closed - Other', null)}/>
                </Menu.Item>
                <Menu.Item key="10" className='borderBottom'>
                    <MenuItem isCurrent={sidebarKey === '10' ? true : false} text='Talent Positions' onChangeNavItem={() => onChangeSelectedNavItem('talentPositions', '')}/>
                </Menu.Item>
            </Menu>
        </div>

    )
}

export default NavigationBar;
