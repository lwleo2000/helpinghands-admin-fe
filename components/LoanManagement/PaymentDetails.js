import React, { useEffect, useState } from "react";
import {
  PageHeader,
  Col,
  Row,
  Card,
  Modal,
  Skeleton,
  Tag,
  Descriptions,
  Table,
} from "antd";
import { withRouter } from "next/router";
import AdminMenu from "../Menu/Menu";
import Currency from "react-currency-formatter";
import { UserOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";
import moment from "moment";
import LoanManagementApi from "../../tools/Api/LoanManagement.api";

const PaymentDetails = (props) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    getPaymentDetails();
  }, []);

  const getPaymentDetails = async () => {
    setLoading(true);
    const res = await LoanManagementApi.GetPaymentDetails(
      props.router.query.applicationNumber
    );
    if (res.status === 200) {
      console.log(res.data.data, 78);
      setLoading(false);
      setPaymentDetails(res.data.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const previewModal = (
    <Modal
      visible={previewVisible}
      footer={null}
      onCancel={() => setPreviewVisible(false)}
    >
      <img alt="Image" style={{ width: "100%" }} src={previewImage} />
    </Modal>
  );

  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Payment Details"
    />
  );

  const paymentLogColumns = [
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      fixed: true,
      width: 100,
      sorter: (a, b) => moment(a.payment_date) - moment(b.payment_date),
      render: (payment_date) =>
        moment(payment_date).format("DD-MMM-YYYY hh:mm A"),
    },
    {
      title: "Payment History Log",
      dataIndex: "payment_details",
      render: (payment_details) => payment_details,
    },
  ];

  const PaymentDetails =
    paymentDetails[0] && fileList ? (
      <div style={{ backgroundColor: "#fff", paddingLeft: 8, paddingRight: 8 }}>
        <div style={{ padding: 10 }}>
          <Row>
            <Col span={24}>
              <Card
                title={
                  <Row>
                    <Col>
                      <span style={{ paddingLeft: 4 }}>
                        {paymentDetails[0].basic_information.name}
                      </span>
                      {paymentDetails[0].payment.payment_delay > 0 ? (
                        <span style={{ paddingLeft: 8 }}>
                          <Tag color="red">
                            Payment Delay{" "}
                            {paymentDetails[0].payment.payment_delay}
                          </Tag>
                        </span>
                      ) : null}
                    </Col>
                  </Row>
                }
                style={{ marginTop: 8, borderLeft: 0, borderRight: 0 }}
                headStyle={{ padding: "0px 8px " }}
                bodyStyle={{ padding: "0px 0px 0px" }}
              >
                <Row>
                  <Col>
                    <Descriptions bordered>
                      <Descriptions.Item label="EMI Paid">
                        {paymentDetails[0].payment.emi_paid} time(s)
                      </Descriptions.Item>
                      <Descriptions.Item label="Total Repayment">
                        <Currency
                          quantity={paymentDetails[0].payment.total_repayment}
                          currency="MYR"
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="EMI Payment Reminder">
                        {paymentDetails[0].payment.reminder} day(s) before the
                        due date
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Delay">
                        Customer currently delay{" "}
                        {paymentDetails[0].payment.payment_delay} time(s) the
                        payment
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 16, backgroundColor: "#fff" }}>
            <Col
              style={{
                fontSize: 16,
                fontWeight: 600,
                padding: "16px 16px 0 16px",
              }}
            >
              Payment History Log
            </Col>

            <Col span={24} style={{ padding: 16 }}>
              <Table
                bordered
                size="small"
                rowKey="payment_date"
                columns={paymentLogColumns}
                dataSource={paymentDetails[0].payment.payment_history_log}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    ) : (
      <Skeleton avatar paragraph={{ rows: 25 }} />
    );

  return (
    <AdminMenu menu={props.router.query.id} ViewPageHeader={pageHeader}>
      {PaymentDetails}
      {previewModal}
    </AdminMenu>
  );
};

export default withRouter(PaymentDetails);
