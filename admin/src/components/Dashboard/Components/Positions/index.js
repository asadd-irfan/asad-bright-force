import React, { useEffect } from "react";
import { Layout } from "antd";
import AllCompaniesPositionsFilters from "./Filters/AllCompaniesPositionsFilters";
import AllCompaniesPositionsTable from "./Tables/AllCompaniesPositionsTable";
import TalentPositionsFilters from "./Filters/TalentPositionsFilters";
import TalentPositionsTable from "./Tables/TalentPositionsTable";
import NavigationBar from "./NavigationBar";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_POSITION_NAV_ITEM,
  SELECTED_POSITION_NULL,
  SELECTED_POSITION_TALENT_NULL,
} from "../../../../actions/types";
import {
  getAllCompaniesPositions,
  nullAllPositionRelatedResources,
} from "../../../../actions/positions";
import { useHistory } from "react-router-dom";

import "./positions.scss";
import TalentPositionsDetails from "./Talent/Details";

const { Content, Sider } = Layout;

function Positions() {
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedNavItem = useSelector(
    (state) => state.positions.selectedPositionNavbarItem
  );
  const talent = useSelector(
    (state) => state.positions.selectedTalentPositions?.talent
  );
  useEffect(() => {
    dispatch(nullAllPositionRelatedResources());
    dispatch(getAllCompaniesPositions(""));
    dispatch({
      type: SELECTED_POSITION_NULL,
    });
    dispatch({
      type: SELECTED_POSITION_TALENT_NULL,
    });
  }, []);

  const onChangeSelectedNavItem = (navItem, status, lastGroupStatus) => {
    history.push(`/admin/positions`);
    dispatch({
      type: SET_POSITION_NAV_ITEM,
      payload: navItem,
    });
    if (navItem === "allCompanyPositions") {
      let params = "";
      if (status !== "") {
        if (lastGroupStatus === null) {
          params = `?status=${status}`;
        } else {
          params = `?status=${status}&lastGroupStatus=${lastGroupStatus}`;
        }
      }
      dispatch(getAllCompaniesPositions(params));
    }
    if (navItem === "talentPositions") {
      dispatch({
        type: SELECTED_POSITION_TALENT_NULL,
      });
    }
  };

  return (
    <div style={{ padding: "25px 15px" }}>
      <Layout>
        <Sider
          breakpoint="lg"
          width={"230px"}
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <NavigationBar onChangeSelectedNavItem={onChangeSelectedNavItem} />
        </Sider>

        <Layout>
          <Content style={{ padding: "0px 0px 0px 10px", margin: "0" }}>
            {selectedNavItem === "allCompanyPositions" && (
              <div>
                <AllCompaniesPositionsFilters />
                <AllCompaniesPositionsTable />
              </div>
            )}
            {selectedNavItem === "talentPositions" && (
              <div>
                <TalentPositionsFilters />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      <Layout>
        {selectedNavItem === "talentPositions" && (
          <div>
            {talent && <TalentPositionsDetails />}
            <TalentPositionsTable />
          </div>
        )}
      </Layout>
    </div>
  );
}

export default Positions;
