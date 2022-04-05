import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Dropdown,
  Menu,
  PageHeader,
  Input,
  Button,
  Badge,
} from "antd";
import { withRouter } from "next/router";
import AdminMenu from "../../Menu/Menu";
import Highlighter from "react-highlight-words";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import BanAccountModal from "./components/BanAccount.modal";
import UnbanAccountModal from "./components/UnbanAccount.modal";
import UnsetDefaulterModal from "./components/UnsetDefaulter.modal";
import UserManagementApi from "../../../tools/Api/UserManagement.api";
import { ResponseError } from "../../../tools/ErrorHandler/ErrorHandler";

const User = (props) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInput = React.createRef();
  const [data, setData] = useState({});
  const [banAccountModalVisible, setBanAccountModalVisible] = useState(false);
  const [unbanAccountModalVisible, setUnbanAccountModalVisible] =
    useState(false);
  const [unsetDefaulterModalVisible, setUnsetDefaulterModalVisible] =
    useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          //If is array means the dataindex passed in is an Object
          placeholder={`Search ${
            Array.isArray(dataIndex) === true ? dataIndex[1] : dataIndex
          }`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          marginRight: 8,
          fontSize: 18,
          color: filtered ? "#ffc069" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      //If is array means the dataindex passed in is an Object
      if (Array.isArray(dataIndex) === true) {
        var object = record[dataIndex[0]];
        return object[dataIndex[1]]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: (text) => {
      if (text) {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        );
      }
    },
  });

  const handleSearch = (selectedKeys, confirm) => {
    console.log(selectedKeys[0], 7666);
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getUserList = async () => {
    setLoading(true);
    const res = await UserManagementApi.GetUserList();
    if (res.status === 200) {
      setLoading(false);
      setUserList(res.data.data);
      console.log(userList, 1111);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Customers"
    />
  );

  const columns = [
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      render: (creation_date) => (
        <span>{moment(creation_date).format("YYYY-MMM-DD")}</span>
      ),
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
      key: "account_number",
      ...getColumnSearchProps("account_number"),
    },
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      ...getColumnSearchProps("full_name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      ...getColumnSearchProps("phone_number"),
    },
    {
      title: "Defaulter Status",
      key: "defaulter",
      filterMultiple: false,
      filters: [
        {
          text: <Badge status="error" text="Defaulter" />,
          value: true,
        },
        {
          text: <Badge status="success" text="Non-defaulter" />,
          value: false,
        },
      ],
      onFilter: (value, record) => {
        return record.defaulter ? record.defaulter : false === value;
      },
      render: (value) => (
        <Badge
          status={value.defaulter === true ? "error" : "success"}
          text={value.defaulter === true ? "Defaulter" : "Non-defaulter"}
        />
      ),
    },
    {
      title: "Ban Status",
      dataIndex: "banned",
      key: "banned",
      filterMultiple: false,
      filters: [
        {
          text: <Badge status="error" text="Banned" />,
          value: true,
        },
        {
          text: <Badge status="success" text="Active" />,
          value: false,
        },
      ],
      onFilter: (value, record) => {
        return record.banned === value;
      },
      render: (banned) => (
        <Badge
          status={banned === true ? "error" : "success"}
          text={banned === true ? "Banned" : "Active"}
        />
      ),
    },
    {
      title: "Action",
      width: "10%",
      render: (value) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => {
                  setBanAccountModalVisible(true);
                  setData({
                    account_number: value.account_number,
                    full_name: value.full_name,
                  });
                }}
                disabled={value.banned !== false}
              >
                Ban Account
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setUnbanAccountModalVisible(true);
                  setData({
                    account_number: value.account_number,
                    full_name: value.full_name,
                  });
                }}
                disabled={value.banned !== true}
              >
                Unban Account
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setUnsetDefaulterModalVisible(true);
                  setData({
                    account_number: value.account_number,
                    full_name: value.full_name,
                  });
                }}
                disabled={value.defaulter ? value.defaulter !== true : true}
              >
                Unset Defaulter
              </Menu.Item>
            </Menu>
          }
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            Action <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  return (
    <AdminMenu menu={props.router.query.id} ViewPageHeader={pageHeader}>
      <Table
        size="medium"
        rowKey="applicationNumber"
        loading={loading}
        columns={columns}
        dataSource={userList}
        scroll={{
          x: 768,
        }}
      />
      <BanAccountModal
        visible={banAccountModalVisible}
        onCancel={() => {
          setBanAccountModalVisible(false);
        }}
        data={data}
        reload={getUserList}
      />
      <UnbanAccountModal
        visible={unbanAccountModalVisible}
        onCancel={() => {
          setUnbanAccountModalVisible(false);
        }}
        data={data}
        reload={getUserList}
      />
      <UnsetDefaulterModal
        visible={unsetDefaulterModalVisible}
        onCancel={() => {
          setUnsetDefaulterModalVisible(false);
        }}
        data={data}
        reload={getUserList}
      />
    </AdminMenu>
  );
};

export default withRouter(User);
