import React, { useState, useEffect } from 'react';
import {
  ClusterOutlined, CalendarOutlined, ContactsOutlined, BankOutlined, UserAddOutlined, SettingFilled, MenuFoldOutlined
} from '@ant-design/icons';
import { Menu, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './SideBar.scss';
// import CreatePositionModal from "../Recruitment/PositionType/CreatePositionModal"
import { setSelectedPositionId, getAllPositionsByType } from '../../actions/positions'

const { SubMenu } = Menu;

function SideBar(props) {
  const history = useHistory();
  const dispatch = useDispatch()
  const [activePositions, setActivePositions] = useState(null);
  const appConfigs = useSelector(state => state.auth.appConfigs);
  const rolesOptions = appConfigs && appConfigs['roles']
  const allPositions = useSelector(state => state.positions.allPositionsByType);

  useEffect(() => {
    // dispatch(getAllCompanyPositions())
    dispatch(getAllPositionsByType())
  }, [])
  const [positionModal, setPositionModal] = useState(false);
  const openPositionModal = () => {
    setPositionModal(true)
  };


  useEffect(() => {
    let positionsArr = [];
    let companyActivePositions;
    if (allPositions) {
      companyActivePositions = allPositions?.activePositions;
    }
    if (companyActivePositions?.length > 0) {
      companyActivePositions && companyActivePositions.map((pos) => {
        rolesOptions && rolesOptions.filter((role) => {
          if (role._id === pos.name._id) {
            positionsArr.push({
              id: pos._id,
              name: role.name,
              title: pos.title,
              employment: pos.employmentType
            })
          }
        })

      })
    }

    setActivePositions(positionsArr)
  }, [allPositions, rolesOptions])
  const goToDetails = (key) => {
    history.push(`/company/hire/recruitment/details/${key}`);
    dispatch(setSelectedPositionId(key))
  }
  const goToCreatePosition = () => {
    history.push(`/company/hire/position`);
  };
  // console.log('activePositions', activePositions)
  return (
    <>
      {/* <div className="logo" /> */}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
        <Menu.Item key="1"  >
          <Link to='/company/hire/profile' >
            <span><BankOutlined className="icon-font-22" /><span>Company Profile</span></span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2" >
          <Link to='/company/hire/calender' >
            <span><CalendarOutlined className="icon-font-22" /><span>Calender</span></span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3" >
          <Link to='/company/hire/recruitment' >
            <span><ClusterOutlined className="icon-font-22" /><span>Recruitment Dashboard</span></span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4"
          // onClick={openPositionModal}
          onClick={goToCreatePosition}
        >
          <span><UserAddOutlined className="icon-font-22" /><span>Post a Position</span></span>

        </Menu.Item>
        <SubMenu
          key="tab"
          style={{ wordWrap: 'break-word' }}
          title={
            <span><ContactsOutlined className="icon-font-22" /><span>Active Positions
                </span>
            </span>


          }
        >
          {activePositions && activePositions.map((pos, index) => {
            // console.log('position',pos)
            return <Menu.Item key={index} style={{ height: '90px' }} >
              <div style={{ height: '75px' }} key={index} onClick={() => goToDetails(pos?.id)} className='position-heading' >
                <Row className="m-0">
                  <Col xs={4} sm={4} md={4} lg={4} >
                    <div style={{ borderRadius: '25%', backgroundColor: 'grey', width: '16px', height: '16px', marginTop: '12px' }}>
                    </div>
                  </Col>
                  <Col xs={20} sm={20} md={20} lg={20} style={{ wordWrap: 'break-word' }}>
                    <p className="m-0" style={{ color: 'white', fontSize: '12px' }}
                    >{pos?.title}</p>
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} />
                  <Col xs={20} sm={20} md={20} lg={20} style={{ wordWrap: 'break-word' }}>
                    <p style={{ color: 'white', fontSize: '12px' }}>
                      {pos?.name}, {pos?.employment?.name}
                    </p>
                  </Col>


                </Row>

              </div>
            </Menu.Item>
          })}



        </SubMenu>
      </Menu>
      {/* <CreatePositionModal positionModal={positionModal} setPositionModal={setPositionModal} /> */}

    </>
  );
}

export default SideBar
