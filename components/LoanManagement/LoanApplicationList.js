import React, { useEffect, useState } from "react";
import {
  Table,
  Dropdown,
  Menu,
  PageHeader,
  Tag,
  Input,
  Button,
  Badge,
} from "antd";
import { withRouter } from "next/router";
import AdminMenu from "../Menu/Menu";
import Currency from "react-currency-formatter";
import Highlighter from "react-highlight-words";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import LoanApplicationApi from "../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";

const LoanApplicationList = (props) => {
  const [loading, setLoading] = useState(false);
  const [loanApplicationList, setLoanApplicationList] = useState([]);
  const [data, setData] = useState({});
  const currentDate = moment().format("YYYY-MM-DD");

  const [searchText, setSearchText] = useState("");
  const searchInput = React.createRef();

  useEffect(() => {
    getLoanApplicationList();
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

  const getLoanApplicationList = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.GetLoanApplicationList();
    if (res.status === 200) {
      setLoading(false);
      setLoanApplicationList(res.data.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Loan Application"
    />
  );
  const columns = [
    {
      title: "Application Number",
      dataIndex: "application_id",
      key: "application_id",
      ...getColumnSearchProps("application_id"),
    },
    {
      title: "Name",
      dataIndex: ["basic_information", "name"],
      key: "name",
      ...getColumnSearchProps(["basic_information", "name"]),
    },
    {
      title: "Loan Amount",
      dataIndex: "emi_plan",
      key: "loan_amount",
      render: (emi_plan) => (
        <Currency currency="MYR" quantity={emi_plan.loan_amount} />
      ),
    },
    {
      title: "Loan Term",
      dataIndex: "emi_plan",
      key: "loan_term",
      render: (emi_plan) => <span>{emi_plan.loan_term} month(s)</span>,
    },
    {
      title: "EMI",
      dataIndex: "emi_plan",
      key: "loan_emi",
      render: (emi_plan) => (
        <Currency currency="MYR" quantity={emi_plan.loan_emi} />
      ),
    },
    {
      title: "Total Interest",
      dataIndex: "emi_plan",
      key: "total_interest",
      render: (emi_plan) => (
        <Currency currency="MYR" quantity={emi_plan.total_interest} />
      ),
    },

    {
      title: "Potential Default",
      dataIndex: "loan_default",
      key: "loan_default",
      filterMultiple: false,
      filters: [
        {
          text: <Badge status="error" text="High Risk" />,
          value: "High Risk",
        },
        {
          text: <Badge status="success" text="Low Risk" />,
          value: "Low Risk",
        },
      ],
      onFilter: (value, record) => {
        return record.loan_default === value;
      },
      render: (loan_default) => (
        <Badge
          status={loan_default === "High Risk" ? "error" : "success"}
          text={loan_default === "High Risk" ? "High Risk" : "Low Risk"}
        />
      ),
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
        return record.user_details.defaulter
          ? record.user_details.defaulter
          : false === value;
      },
      render: (value) => (
        <Badge
          status={value.user_details.defaulter === true ? "error" : "success"}
          text={
            value.user_details.defaulter === true
              ? "Defaulter"
              : "Non-defaulter"
          }
        />
      ),
    },
    {
      title: "Loan Agreement",
      key: "loan_agreement",
      filterMultiple: false,
      filters: [
        {
          text: <Badge status="success" text="Agree" />,
          value: true,
        },
        {
          text: <Badge status="error" text="Not agree" />,
          value: false,
        },
      ],
      onFilter: (value, record) => {
        return record.loan_agreement.agree === value;
      },
      render: (value) => (
        <Badge
          status={value.loan_agreement.agree === true ? "success" : "error"}
          text={value.loan_agreement.agree === true ? "Agree" : "Not agree"}
        />
      ),
    },
    {
      title: "Loan Status",
      dataIndex: "loan_status",
      key: "loan_status",
      filterMultiple: false,
      filters: [
        {
          text: <Tag color="#D78A17">Under Approval</Tag>,
          value: "Under Approval",
        },
        {
          text: <Tag color="#B80909">Rejected</Tag>,
          value: "Rejected",
        },
        {
          text: <Tag color="#1E7310">Approved</Tag>,
          value: "Approved",
        },
        {
          text: <Tag color="#3A44F4">Loan Disbursed</Tag>,
          value: "Loan Disbursed",
        },
        {
          text: <Tag color="#8E17D7">Suspended</Tag>,
          value: "Suspended",
        },
        {
          text: <Tag color="#00C4B4">Fully Paid</Tag>,
          value: "Fully Paid",
        },
      ],
      onFilter: (value, record) => {
        return record.loan_status === value;
      },
      render: (loan_status) => (
        <Tag
          color={
            loan_status === "Under Approval"
              ? "#D78A17"
              : loan_status === "Rejected"
              ? "#B80909"
              : loan_status === "Approved"
              ? "#1E7310"
              : loan_status === "Loan Disbursed"
              ? "#3A44F4"
              : loan_status === "Suspended"
              ? "#8E17D7"
              : "#00C4B4"
          }
        >
          {loan_status}
        </Tag>
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
                onClick={() =>
                  value.loan_status === "Approved" ||
                  value.loan_status === "Rejected" ||
                  value.loan_status === "Suspended" ||
                  value.loan_status === "Loan Disbursed" ||
                  value.loan_status === "Fully Paid"
                    ? window.open(
                        "form-details?read_only=true&applicationNumber=" +
                          value.application_id
                      )
                    : window.open(
                        "form-details?read_only=false&applicationNumber=" +
                          value.application_id
                      )
                }
              >
                View Application Form
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  window.open(
                    "payment-details?applicationNumber=" + value.application_id
                  )
                }
              >
                View Payment Details
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
        rowKey="application_id"
        loading={loading}
        columns={columns}
        dataSource={loanApplicationList}
        scroll={{
          x: 768,
        }}
      />
    </AdminMenu>
  );
};

export default withRouter(LoanApplicationList);
