import React, { useEffect, useState } from "react";
import { withRouter } from "next/router";
import Link from "next/link";
import { Menu } from "antd";
import {
  DashboardOutlined,
  FileOutlined,
  AuditOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Cookies from "universal-cookie";

const { SubMenu } = Menu;

const NavBar = (props) => {
  // const [path, setPath] = useState("dashboard");
  // const [openMenu, setOpenMenu] = useState([]);
  const selectedMenu = props.selectedMenu;
  const [path, setPath] = useState(() => {
    if (selectedMenu === "dashboard") {
      return "dashboard";
    } else if (selectedMenu === "loan-approval") {
      return "loanApproval";
    } else if (selectedMenu === "loan-disbursement") {
      return "loanDisbursement";
    } else if (selectedMenu === "user") {
      return "user";
    } else if (selectedMenu === "active-loan") {
      return "activeLoan";
    } else if (selectedMenu === "loan-application-list") {
      return "loanApplicationList";
    } else if (selectedMenu === "admin") {
      return "admin";
    } else if (selectedMenu === "loan-plan-list") {
      return "loanPlanList";
    }
  });
  const [openMenu, setOpenMenu] = useState(() => {
    if (selectedMenu === "loan-approval") {
      return "loanApplication";
    } else if (selectedMenu === "loan-disbursement") {
      return "loanApplication";
    } else if (selectedMenu === "user") {
      return "userManagement";
    } else if (selectedMenu === "active-loan") {
      return "loanManagement";
    } else if (selectedMenu === "loan-application-list") {
      return "loanManagement";
    } else if (selectedMenu === "admin") {
      return "userManagement";
    } else if (selectedMenu === "loan-plan-list") {
      return "loanPlanManagement";
    }
  });

  const menuList = (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={[path]}
      selectedKeys={[path]}
      defaultOpenKeys={[openMenu]}
      style={{ border: null }}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link href="/[id]" as="/dashboard">
          <a>Dashboard</a>
        </Link>
      </Menu.Item>
      <SubMenu
        key="loanApplication"
        icon={<FileOutlined />}
        title="Loan Application"
      >
        <Menu.Item key="loanApproval">
          <Link href="/[id]" as="/loan-approval">
            <a>Loan Approval</a>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="loanManagement"
        icon={<AuditOutlined />}
        title="Loan Management"
      >
        <Menu.Item key="loanApplicationList">
          <Link href="/[id]" as="/loan-application-list">
            <a>Loan Application List</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="activeLoan">
          <Link href="/[id]" as="/active-loan">
            <a>Active Loan</a>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="loanPlanManagement"
        icon={<AuditOutlined />}
        title="Loan Plan Management"
      >
        <Menu.Item key="loanPlanList">
          <Link href="/[id]" as="/loan-plan-list">
            <a>Loan Plan List</a>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        key="userManagement"
        icon={<TeamOutlined />}
        title="User Management"
      >
        <Menu.Item key="user">
          <Link href="/[id]" as="/user">
            <a>User</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="admin">
          <Link href="/[id]" as="/admin">
            <a>Admin</a>
          </Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item
        key="logout"
        onClick={() => {
          const cookie = new Cookies();
          cookie.remove("jwt", { path: "/" });
          props.router.push("/");
        }}
        icon={<LogoutOutlined />}
      >
        Log Out
      </Menu.Item>
    </Menu>
  );
  return <>{menuList}</>;
};

export default withRouter(NavBar);
