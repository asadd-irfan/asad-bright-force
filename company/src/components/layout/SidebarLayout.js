import React, { useState } from 'react';
import { Layout } from 'antd';
import SideBar from './SideBar';
import './SideBar.scss';
import {
  MenuUnfoldOutlined, MenuFoldOutlined,
} from '@ant-design/icons';
const { Sider, Content } = Layout;


function SideBarLayout(props) {
  const [collapse, setCollapse] = useState(false);
  const onCollapse = collapsed => {
    console.log(collapsed);
    setCollapse(collapsed);
  };

  const toggle = () => {
    // console.log(collapse);
    setCollapse(!collapse);
  };

  return (
    <Layout>
      {/* <Sider trigger={null} collapsible collapsed={onCollapse}> */}

      <Sider
        // breakpoint="lg"
        collapsed={collapse} onCollapse={onCollapse}
        // collapsedWidth="0"
        trigger={null}
        collapsible
        onBreakpoint={broken => {
          console.log(broken);
        }}
        // onCollapse={(collapsed, type) => {
        // 	console.log(collapsed, type);
        // }}
        theme='dark'
        width={260}
      >
        <SideBar />

      </Sider>
      {
        collapse ? <MenuUnfoldOutlined className="menu-fold " onClick={toggle} /> : <MenuFoldOutlined className="menu-fold " onClick={toggle} />
      }



      <Content>{props.children}</Content>
    </Layout>
  );
}

export default SideBarLayout;
