import React, { useEffect, useState } from "react";
import {
  Table,
  Dropdown,
  Menu,
  PageHeader,
  Statistic,
  Input,
  Button,
} from "antd";
import { withRouter } from "next/router";
import AdminMenu from "../Menu/Menu";
import Currency from "react-currency-formatter";
import Highlighter from "react-highlight-words";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import CompletePaymentModal from "./component/ActiveLoan/CompletePayment.modal";
import EditEMIDueDateModal from "./component/ActiveLoan/EditEMIDueDate.modal";
import LoanApplicationApi from "../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";
import AssignPenaltyModal from "./component/ActiveLoan/AssignPenalty.modal";

const ActiveLoan = (props) => {
  const [loading, setLoading] = useState(false);
  const [completePaymentModalVisible, setCompletePaymentModalVisible] =
    useState(false);
  const [editEMIDueDateModalVisible, setEditEMIDueDateModalVisible] =
    useState(false);
  const [assignPenaltyModalVisible, setAssignPenaltyModalVisible] =
    useState(false);
  const [activeLoan, setActiveLoan] = useState([]);
  const [data, setData] = useState({});
  const currentDate = moment().format("YYYY-MM-DD");

  const [searchText, setSearchText] = useState("");
  const searchInput = React.createRef();

  useEffect(() => {
    getActiveLoan();
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

  const getActiveLoan = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.GetActiveLoan();
    if (res.status === 200) {
      setLoading(false);
      setActiveLoan(res.data.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Active Loan"
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
      title: "EMI Paid",
      render: (value) => (
        <Statistic
          value={value.payment.emi_paid}
          suffix={"/ " + value.emi_plan.loan_term}
          valueStyle={{ fontSize: 15 }}
        />
      ),
    },
    {
      title: "Total Repayment",
      dataIndex: "payment",
      key: "total_repayment",
      render: (payment) => (
        <Currency currency="MYR" quantity={payment.total_repayment} />
      ),
    },
    {
      title: "EMI Due Date",
      dataIndex: "payment",
      key: "emi_due_date",
      render: (payment) => (
        <span
          style={{
            color:
              moment(payment.emi_due_date).isBefore(currentDate) == true
                ? "#E44444"
                : "#000",
          }}
        >
          {moment(payment.emi_due_date).format("YYYY-MM-DD")}
        </span>
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
                    "payment-details?applicationNumber=" + value.application_id,
                    "_blank"
                  )
                }
              >
                View Payment Details
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setCompletePaymentModalVisible(true);
                  setData({
                    application_id: value.application_id,
                    emi_due_date: value.payment.emi_due_date,
                  });
                }}
              >
                Complete Payment
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setEditEMIDueDateModalVisible(true);
                  setData({
                    application_id: value.application_id,
                    emi_due_date: value.payment.emi_due_date,
                  });
                }}
              >
                Edit EMI due date
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setAssignPenaltyModalVisible(true);
                  setData({
                    application_id: value.application_id,
                    customer_id: value.customer_id,
                    name: value.basic_information.name,
                    loan_emi: value.emi_plan.loan_emi,
                  });
                }}
              >
                Assign Penalty
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
        dataSource={activeLoan}
        scroll={{
          x: 768,
        }}
      />
      <CompletePaymentModal
        visible={completePaymentModalVisible}
        onCancel={() => {
          setCompletePaymentModalVisible(false);
        }}
        data={data}
        reload={getActiveLoan}
      />
      <EditEMIDueDateModal
        visible={editEMIDueDateModalVisible}
        onCancel={() => {
          setEditEMIDueDateModalVisible(false);
        }}
        data={data}
        reload={getActiveLoan}
      />
      <AssignPenaltyModal
        visible={assignPenaltyModalVisible}
        onCancel={() => {
          setAssignPenaltyModalVisible(false);
        }}
        data={data}
        reload={getActiveLoan}
      />
    </AdminMenu>
  );
};

export default withRouter(ActiveLoan);
