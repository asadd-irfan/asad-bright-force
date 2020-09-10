import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useParams } from "react-router";
import SidePanel from './SidePanel/index'
import MainSection from './MainSection/index'
import { useDispatch } from "react-redux";

import { getTalentById, getTalentEvaluation } from '../../../../../actions/talent'
const { Content, Sider } = Layout;

function TalentDetails() {
    const dispatch = useDispatch()
    let { id } = useParams();
    useEffect(() => {
        dispatch(getTalentById(id))
        dispatch(getTalentEvaluation(id))
    }, [])

    return (
        <div style={{ padding: '25px 15px'}}>
            <Layout>
                <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                theme='light'
                width={300}
                >
                    <SidePanel />
                </Sider>
                <Layout>
                <Content style={{ padding: '0 20px', margin: '0' }}>
                    <MainSection />
                </Content>
                </Layout>
            </Layout>
      </div>
    
    )
}

export default TalentDetails;
