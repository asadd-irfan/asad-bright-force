import React from 'react'
import { Layout } from 'antd';
import Sidebar from './Sidebar';


const { Sider, Content } = Layout;


function SideBarLayout(props) {
  return (
    <Layout>
      <Content>{props.children}</Content>
      <Sider
        width='230'
        breakpoint='lg'
        reverseArrow
        collapsible
        collapsedWidth='0'
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Sidebar /> 
      </Sider>
    </Layout>
  );
}

export default SideBarLayout;
