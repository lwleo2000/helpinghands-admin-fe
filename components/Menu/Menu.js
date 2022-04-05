import React, { Component, useState } from "react";
import Link from "next/link";
import moment from "moment";
import NavBar from "../NavBar/NavBar";
import PropTypes from "prop-types";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CopyrightOutlined,
} from "@ant-design/icons";
import { Layout, Row, Col } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const Menu = (props) => {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const TopHeader = (
    <Header
      style={{
        backgroundColor: "#fff",
        padding: 0,
        minHeight: "64px",
        lineHeight: "64px",
      }}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        onClick: toggle,
        style: {
          fontSize: 16,
          cursor: "pointer",
          marginLeft: 16,
        },
      })}
    </Header>
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={window.innerWidth < 576 ? 0 : 100}
        breakpoint={"xl"}
        onBreakpoint={(e) => {
          return setCollapsed(e);
        }}
        style={{
          zIndex: 100,
          color: "#fff",
          minHeight: "100vh",
          boxShadow: "0px 0px 16px #8c8c8c",
          position: "fixed",
          overflowY: "auto",
          maxHeight: window.innerHeight,
        }}
        width={220}
        className="scroll-bar-hidden"
      >
        <Row
          type="flex"
          justify="center"
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
          <Col style={{ cursor: "pointer" }}>
            {collapsed ? (
              <Row type="flex" justify="center">
                <Col span={24}>
                  <Link href="/[id]" as="/dashboard">
                    <img
                      src="/media/logoCollapse.png"
                      alt="Logo"
                      style={{
                        marginLeft: 0,
                        width: 100,
                        marginTop: 8,
                      }}
                    />
                  </Link>
                </Col>
              </Row>
            ) : (
              <Row type="flex" justify="center">
                <Col style={{ textAlign: "center" }}>
                  <Link href="/[id]" as="/dashboard">
                    <img
                      src="/media/logo.png"
                      alt="Logo"
                      width={200}
                      style={{ marginTop: 8 }}
                    />
                  </Link>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <NavBar selectedMenu={props.menu} />
      </Sider>
      <Layout style={{ paddingLeft: collapsed ? 100 : 220 }}>
        {TopHeader}
        {props.ViewPageHeader && (
          <div style={{ padding: 0 }}>{props.ViewPageHeader}</div>
        )}
        <Content
          style={{ padding: 16, backgroundColor: "#f0f2f5", minHeight: 280 }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <CopyrightOutlined /> Copyright HelpingHands {moment().format("YYYY")}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Menu;
Menu.propTypes = {
  children: PropTypes.any,
  ViewPageHeader: PropTypes.any,
};
