import React from 'react';
import { Layout } from 'antd';
import TalentsTable from './TalentsTable';
import TalentFilters from './TalentFilters';
import NavigationBar from './NavigationBar';

const { Content, Sider } = Layout;

function Talents() {
  return (
    <div style={{ padding: '25px 15px' }}>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
        >
          <NavigationBar />
        </Sider>
        <Layout>
          <Content style={{ padding: '0px 0px 0px 10px', margin: '0' }}>
            <TalentFilters />
            <TalentsTable />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Talents;
