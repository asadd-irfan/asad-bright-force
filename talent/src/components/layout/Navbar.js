import React, { useState, useEffect } from "react";
import { BellFilled, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, Row, Col, Drawer, Button, Avatar } from "antd";
import { useHistory, Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Navbar.module.scss";

import { logoutUser } from "../../actions/auth";
import { setCurrentNavbarButton } from "../../actions/common";
import { useWindowSize } from "../../common/commonMethods";

function LeftButton() {
  const history = useHistory();

  return (
    <div className="ml-30">
      <Button
        type="primary"
        size="large"
        onClick={() => {
          history.push("/talent/invite-friend");
        }}
      >
        Invite a Friend
      </Button>
    </div>
  );
}

function NavbarItems(mode) {
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const appConfigs = useSelector((state) => state.auth.appConfigs);
  const currencyOptions = useSelector(
    (state) => state.auth.appConfigs && state.auth.appConfigs["currency"]
  );
  const EngagementTypeOptions = useSelector(
    (state) =>
      state.auth.appConfigs && state.auth.appConfigs["freelancer-engagement"]
  );
  const contractDurationOptions = useSelector(
    (state) =>
      state.auth.appConfigs &&
      state.auth.appConfigs["freelancer-contract-duration"]
  );
  const freeLancerApiDetail = useSelector(
    (state) =>
      state.auth && state.auth.user && state.auth.user.freelancerProfile
  );
  const [dailyRate, setDailyRate] = useState(null);
  const [monthlyRate, setMonthlyRate] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [engagementType, setEngagementType] = useState(null);
  const [contractDuration, setContractDuration] = useState(null);

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
    return <Redirect to="/talent/profile" />;
  };

  useEffect(() => {
    let freelancerSelectedCurrency =
      freeLancerApiDetail &&
      freeLancerApiDetail.rate &&
      freeLancerApiDetail.rate.currency;
    let matchedCurrency =
      currencyOptions &&
      currencyOptions.map((item) => {
        if (item._id === freelancerSelectedCurrency) {
          return item;
        }
      });

    let freelancerSelectedEngagementType =
      freeLancerApiDetail && freeLancerApiDetail.engagementType;
    let matchedEngagementType =
      EngagementTypeOptions &&
      EngagementTypeOptions.map((item) => {
        if (item._id === freelancerSelectedEngagementType) {
          return item;
        }
      });

    let freelancerSelectedContractDuration =
      freeLancerApiDetail && freeLancerApiDetail.contractDuration;
    let matchedContractDuration =
      contractDurationOptions &&
      contractDurationOptions.map((item) => {
        if (item._id === freelancerSelectedContractDuration) {
          return item;
        }
      });
    let updatedMatchedCurrency =
      matchedCurrency && matchedCurrency.filter(Boolean);
    let updatedMatchedEngagementType =
      matchedEngagementType && matchedEngagementType.filter(Boolean);
    let updatedMatchedContractDuration =
      matchedContractDuration && matchedContractDuration.filter(Boolean);
    const rate =
      freeLancerApiDetail &&
      freeLancerApiDetail.rate &&
      freeLancerApiDetail.rate.dailyRate;
    const mRate =
      freeLancerApiDetail &&
      freeLancerApiDetail.rate &&
      freeLancerApiDetail.rate.monthlyRate;
    const currencyName =
      updatedMatchedCurrency &&
      updatedMatchedCurrency[0] &&
      updatedMatchedCurrency[0].name;
    const engagementName =
      updatedMatchedEngagementType &&
      updatedMatchedEngagementType[0] &&
      updatedMatchedEngagementType[0].name;
    const contractDurationName =
      updatedMatchedContractDuration &&
      updatedMatchedContractDuration[0] &&
      updatedMatchedContractDuration[0].name;
    setDailyRate(rate);
    setMonthlyRate(mRate);
    setCurrency(currencyName);
    setEngagementType(engagementName);
    setContractDuration(contractDurationName);
  }, [freeLancerApiDetail, appConfigs]);

  return (
    <>
      <Menu mode={mode.mode} style={{ float: "left", lineHeight: "84px" }}>
        <Menu.Item key="inviteButton">
          <LeftButton />
        </Menu.Item>
      </Menu>
      <Menu
        mode={mode.mode}
        className={`${styles.anchorStyle}`}
        style={{ float: "right", lineHeight: "84px" }}
      >
        {/* <Menu.Item key='calendar'>
        <Link to='/talent/calendar'>Calendar</Link>
      </Menu.Item>
      <Menu.Item key='profile'>
        <Link to='/talent/profile'>Profile</Link>
      </Menu.Item>
      <Menu.Item key='evaluations'>
        <Link to='/talent/evaluation'>Evaluations</Link>
      </Menu.Item>
      <Menu.Item key='opportunities'>
        <Link to='/'>Opportunities</Link>
      </Menu.Item>
      <Menu.Item key='invites'>
        <Link to='/talent/invites'>Invites</Link>
      </Menu.Item> */}

        <Menu.Item key="jobs">
          <Link
            to="/talent/profile"
            onClick={() => {
              dispatch(setCurrentNavbarButton("profile"));
            }}
          >
            Jobs
          </Link>
        </Menu.Item>
        <Menu.Item key="payroll">
          <Link to="/talent/payroll">Payroll</Link>
        </Menu.Item>
        {isAuthenticated && (
          <Menu.SubMenu
            title={
              <span className={`${styles.submenu_svg}`}>
                {/* <Avatar size={60} src={user && `/${user.profileImage}`} icon={<UserOutlined />} className={`${styles.avatarStyle}`} style={{ backgroundColor: 'black' }} /> */}
                <Avatar
                  size={60}
                  src={user && user?.profileImage?.includes("http")
                    ? user?.profileImage
                    : `/${user?.profileImage}`
                  }
                  icon={<UserOutlined />}
                  className={`${styles.avatarStyle}`}
                  style={{ backgroundColor: "black" }}
                />
              </span>
            }
          >
            <Menu.Item key='name'><b style={{ fontSize: 18 }}> {user?.name}</b> </Menu.Item>
            <Menu.Item key="setting">
              <Link to="/talent/settings"> Account Settings</Link>
            </Menu.Item>
            <Menu.Item key="timezone">
              <Link to="/talent/timezone-currency"> Time zone & currency</Link>
            </Menu.Item>
            <Menu.Item key="avatar">
              <Link to="/talent/avatar"> Edit Avatar</Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={logout}>
              Logout
            </Menu.Item>
          </Menu.SubMenu>
        )}

        {/* </Menu.Item> */}
        <Menu.Item key="notification">
          <BellFilled style={{ fontSize: "22px" }} />
        </Menu.Item>
      </Menu>
    </>
  );
}

export default function Navbar() {
  const [width] = useWindowSize();
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  return (
    <Row>
      <Col xs={21} sm={21} md={21} lg={4}>
        {/* <Row>
          <Col span={16}> */}
        <div className={`${styles.logo_container}`}>
          <Link to="/talent/login">
            <div className={`${styles.logo}`} />
          </Link>
        </div>
        {/* </Col>
          <Col span={8}>
            <LeftButton/>
          </Col>

        </Row> */}
      </Col>
      <Col xs={3} sm={3} md={3} lg={20}>
        {width <= 988 ? (
          <>
            <Button
              type="primary"
              onClick={() => {
                setDrawerVisible(true);
              }}
            >
              <MenuOutlined />
            </Button>
            <Drawer
              title="Menu"
              placement="right"
              closable={true}
              onClose={() => setDrawerVisible(false)}
              visible={isDrawerVisible}
            >
              <NavbarItems mode="inline" />
            </Drawer>
          </>
        ) : (
            <NavbarItems mode="horizontal" />
          )}
      </Col>
    </Row>
  );
}
