import React, { useEffect, useState } from "react";
import {
  PageHeader,
  Row,
  Col,
  DatePicker,
  Statistic,
  Card,
  Skeleton,
} from "antd";
import { withRouter } from "next/router";
import AdminMenu from "../Menu/Menu";
import moment from "moment";
import Currency from "react-currency-formatter";
import LoanStatusBarChart from "./components/LoanStatusBarChart";
import LoanDefaultPieChart from "./components/LoanDefaultPieChart";
import DashboardApi from "../../tools/Api/Dashboard.api";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().day(0).startOf("day"),
    moment().endOf("day"),
  ]);
  const [totalLoanApplication, setTotalLoanApplication] = useState(0);
  const [totalLoanApplicationApproved, setTotalLoanApplicationApproved] =
    useState(0);
  const [totalLoanDisbursed, setTotalLoanDisbursed] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [loanStatusCount, setLoanStatusCount] = useState([]);
  const [loanDefaultCount, setLoanDefaultCount] = useState([]);

  useEffect(() => {
    console.log(dateRange, 1255);
    getDashboardAnalytics();
  }, []);

  const getDashboardAnalytics = async () => {
    setLoading(true);
    console.log(dateRange[0].unix(), 55);
    const res = await DashboardApi.GetDasboardAnalytics(
      dateRange[0].unix(),
      dateRange[1].unix()
    );
    console.log(res);
    if (res.status === 200) {
      setLoading(false);
      const total_loan_application =
        res.data.data.analytic_results.total_loan_application;
      const total_loan_application_approved =
        res.data.data.analytic_results.total_loan_application_approved;
      const total_loan_disbursed =
        res.data.data.analytic_results.total_loan_disbursed;
      const total_repayment = res.data.data.analytic_results.total_repayment;
      const loan_status_count =
        res.data.data.analytic_results.loan_status_count;
      const loan_default_count =
        res.data.data.analytic_results.loan_default_count;
      setTotalLoanApplication(total_loan_application);
      setTotalLoanApplicationApproved(total_loan_application_approved);
      setTotalLoanDisbursed(total_loan_disbursed);
      setTotalRepayment(total_repayment);
      setLoanStatusCount(loan_status_count);
      setLoanDefaultCount(loan_default_count);
      console.log(res.data.data, 55);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };
  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Welcome Back To HelpingHands Admin Dashboard"
      extra={
        <DatePicker.RangePicker
          value={dateRange}
          disabled={loading}
          onChange={(e) => {
            if (e) {
              setDateRange([e[0].startOf("days"), e[1].endOf("days")]);
              getDashboardAnalytics();
            } else {
              setDateRange([
                moment().day(0).startOf("day"),
                moment().endOf("day"),
              ]);
              getDashboardAnalytics();
            }
          }}
          disabledDate={(e) => e && e > moment().endOf("day")}
        />
      }
    />
  );

  return (
    <AdminMenu menu={props.router.query.id} ViewPageHeader={pageHeader}>
      <div style={{ backgroundColor: "#fff", paddingLeft: 8, paddingRight: 8 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={6} xl={6} sm={24}>
            <Card bordered={false} loading={loading}>
              <Statistic
                title="Total Loan Application"
                value={totalLoanApplication}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6} xl={6} sm={24}>
            <Card bordered={false} loading={loading}>
              <Statistic
                title="Total Approved Loan Application"
                value={totalLoanApplicationApproved}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6} xl={6} sm={24}>
            <Card bordered={false} loading={loading}>
              <Statistic
                title="Total Loan Disbursed"
                prefix="RM"
                precision={2}
                value={totalLoanDisbursed}
              />
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6} xl={6} sm={24}>
            <Card bordered={false} loading={loading}>
              <Statistic
                title="Total Repayment"
                prefix="RM"
                precision={2}
                value={totalRepayment}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={14}>
            <Card
              title="Loan Status"
              loading={loading}
              bodyStyle={{
                paddingLeft: loading ? 24 : 0,
                paddingRight: loading ? 24 : 0,
              }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : (
                <LoanStatusBarChart data={loanStatusCount} />
              )}
            </Card>
          </Col>
          <Col span={10}>
            <Card
              title="Potential Loan Default Pie Chart"
              loading={loading}
              bodyStyle={{
                paddingLeft: loading ? 24 : 0,
                paddingRight: loading ? 24 : 0,
              }}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : (
                <LoanDefaultPieChart data={loanDefaultCount} />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </AdminMenu>
  );
};

export default withRouter(Dashboard);
