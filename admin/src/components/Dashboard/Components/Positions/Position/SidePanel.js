import React from 'react';
import { Row, Col, Menu } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import '../positions.scss'

const MenuItem = ({ text, isInnerItem, onChangeNavItem, isCount, isCurrent, count, color  }) => {
    return (
        <Row>
            <Col xs={22} sm={22} md={22} lg={22} onClick={onChangeNavItem} 
                className={
                    isInnerItem && 'pl-5'
                }
                >
                <strong style={{ color: color }}>{text}</strong>
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

function SidePanel({
    selectedPosition,
}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sidebarKey = useSelector(state => state.positions.sidebarKey)
    const allCompaniesPositionsCount = useSelector(state => state.positions.allCompaniesPositionsCount)

    const gotoPositionsPage = () => {
        history.push('/admin/positions')
    }
    return (

        <div className='menu-wrapper'>
            <Menu theme="dark">
                <Menu.Item key="1" className='borderBottom'>
                    <MenuItem color={'#009E0F'} onChangeNavItem={gotoPositionsPage}  text='All Positions' />
                </Menu.Item>
                <Menu.Item key="2">
                    <MenuItem text='Open Positions' />
                </Menu.Item>
                <Menu.Item key="3" className='borderBottom'>
                    <MenuItem color={selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'un-processed' ? '#f18832' : null}  isInnerItem text='Un Processed' />
                </Menu.Item>
                <Menu.Item key="4" className='borderBottom'>
                    <MenuItem color={selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'processed' ? '#3285f1' : null} isInnerItem text='Processed' />
                </Menu.Item>
                <Menu.Item key="5" className='borderBottom'>
                    <MenuItem color={selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'action-required' ? '#F1C232' : null} isInnerItem text='Action Required' />
                </Menu.Item>
                <Menu.Item key="6" className='borderBottom'>
                    <MenuItem color={selectedPosition?.status === 'Open' && selectedPosition?.lastGroupStatus === 'fulfilled' ? '#93C47D' : null} isInnerItem text='Fulfilled' />
                </Menu.Item>
                <Menu.Item key="7">
                    <MenuItem text='Closed Positions' />
                </Menu.Item>
                <Menu.Item key="8" className='borderBottom'>
                    <MenuItem color={selectedPosition?.status === 'Closed - Hired' ? '#009E0F' : null} isInnerItem text='Hired' />
                </Menu.Item>
                <Menu.Item key="9" className='borderBottom'>
                    <MenuItem color={selectedPosition?.status === 'Closed - Other' ? '#009E0F' : null} isInnerItem text='Other' />
                </Menu.Item>
            </Menu>
        </div>

    )
}

export default SidePanel;
