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
import AdminMenu from "../Menu/Menu";
import Highlighter from "react-highlight-words";
import CreateLoanPlanDrawer from "./components/CreateLoanPlan.drawer";
import EditLoanPlanDrawer from "./components/EditLoanPlan.drawer";
import ActivateLoanPlanModal from "./components/ActivateLoanPlan.modal";
import DeactivateLoanPlanModal from "./components/DeactivateLoanPlan.modal";
import DeleteLoanPlanModal from "./components/DeleteLoanPlan.modal";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import Currency from "react-currency-formatter";
import LoanPlanApi from "../../tools/Api/LoanPlan.api";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";

const LoanPlanList = (props) => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInput = React.createRef();
  const [loanPlanList, setLoanPlanList] = useState([]);
  const [data, setData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [showCreateLoanPlanDrawer, setShowCreateLoanPlanDrawer] =
    useState(false);
  const [showEditLoanPlanDrawer, setShowEditLoanPlanDrawer] = useState(false);
  const [showActivateLoanPlanModal, setShowActivateLoanPlanModal] =
    useState(false);
  const [showDeactivateLoanPlanModal, setShowDeactivateLoanPlanModal] =
    useState(false);
  const [showDeleteLoanPlanModal, setShowDeleteLoanPlanModal] = useState(false);
  useEffect(() => {
    getLoanPlanList();
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

  const getLoanPlanList = async () => {
    setLoading(true);
    const res = await LoanPlanApi.GetLoanPlanList();
    if (res.status === 200) {
      setLoading(false);
      setLoanPlanList(res.data.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Active Loan Plan"
      extra={[
        <Button
          key="addLoanPlan"
          type="primary"
          onClick={() => setShowCreateLoanPlanDrawer(true)}
        >
          Create Loan Plan
        </Button>,
      ]}
    />
  );

  const columns = [
    // {
    //   title: "Creation Date",
    //   dataIndex: "creation_date",
    //   key: "creation_date",
    //   render: (creation_date) => (
    //     <span>{moment(creation_date).format("YYYY-MMM-DD")}</span>
    //   ),
    // },
    {
      title: "Loan Plan Id",
      dataIndex: "loan_plan_id",
      key: "loan_plan_id",
      ...getColumnSearchProps("loan_plan_id"),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Maximum Loan",
      dataIndex: "max_loan",
      key: "max_loan",
      render: (max_loan) => <Currency currency="MYR" quantity={max_loan} />,
    },
    {
      title: "Annual Interest Rate",
      dataIndex: "annual_interest_rate",
      key: "annual_interest_rate",
      render: (annual_interest_rate) => <span>{annual_interest_rate}%</span>,
    },
    {
      title: "Activation Status",
      dataIndex: "activated",
      key: "activated",
      filterMultiple: false,
      filters: [
        {
          text: <Badge status="default" text="Inactive" />,
          value: false,
        },
        {
          text: <Badge status="success" text="Active" />,
          value: true,
        },
      ],
      onFilter: (value, record) => {
        return record.activated === value;
      },
      render: (activated) => (
        <Badge
          status={activated === true ? "success" : "default"}
          text={activated === true ? "Active" : "Inactive"}
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
                  setData({
                    loan_plan_id: value.loan_plan_id,
                  });
                  setShowActivateLoanPlanModal(true);
                }}
                disabled={value.activated !== false}
              >
                Activate Loan Plan
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setData({
                    loan_plan_id: value.loan_plan_id,
                  });
                  setShowDeactivateLoanPlanModal(true);
                }}
                disabled={value.activated !== true}
              >
                Deactivate Loan Plan
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setData({
                    loan_plan_id: value.loan_plan_id,
                  });
                  setShowDeactivateLoanPlanModal(true);
                }}
                disabled={value.activated !== true}
              >
                Delete Loan Plan
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setEditFormData(value);
                  setShowEditLoanPlanDrawer(true);
                }}
              >
                Edit Loan Plan
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
        dataSource={loanPlanList}
        scroll={{
          x: 768,
        }}
      />
      <CreateLoanPlanDrawer
        visible={showCreateLoanPlanDrawer}
        closeModal={() => {
          setShowCreateLoanPlanDrawer(false);
        }}
        reload={getLoanPlanList}
      />
      <EditLoanPlanDrawer
        visible={showEditLoanPlanDrawer}
        data={editFormData}
        closeModal={() => {
          setShowEditLoanPlanDrawer(false);
        }}
        reload={getLoanPlanList}
      />
      <ActivateLoanPlanModal
        visible={showActivateLoanPlanModal}
        data={data}
        closeModal={() => {
          setShowActivateLoanPlanModal(false);
        }}
        reload={getLoanPlanList}
      />
      <DeactivateLoanPlanModal
        visible={showDeactivateLoanPlanModal}
        data={data}
        closeModal={() => {
          setShowDeactivateLoanPlanModal(false);
        }}
        reload={getLoanPlanList}
      />
      <DeleteLoanPlanModal
        visible={showDeleteLoanPlanModal}
        data={data}
        closeModal={() => {
          setShowDeleteLoanPlanModal(false);
        }}
        reload={getLoanPlanList}
      />
    </AdminMenu>
  );
};

export default withRouter(LoanPlanList);
