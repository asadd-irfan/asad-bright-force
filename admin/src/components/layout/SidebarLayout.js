import React from 'react'
import { Layout } from 'antd';
import SideBar from './SideBar';


const { Sider, Content } = Layout;


function SideBarLayout(props) {
  return (
    <Layout>
      <Sider
        width='230'
        breakpoint='lg'
        // reverseArrow
        collapsible
        collapsedWidth='0'
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <SideBar />
      </Sider>
      <Content>{props.children}</Content>
    </Layout>
  );
}

export default SideBarLayout;
