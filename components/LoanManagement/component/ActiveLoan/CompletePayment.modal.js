import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import moment from "moment";
import LoanManagementApi from "../../../../tools/Api/LoanManagement.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const CompletePaymentModal = (props) => {
  const [loading, setLoading] = useState(false);
  const currentDueDate = new Date(props.data.emi_due_date);
  const newDueDate = currentDueDate.setMonth(currentDueDate.getMonth() + 1);

  const handleSubmit = async () => {
    console.log(props.data.application_id, 1234);
    setLoading(true);
    const res = await LoanManagementApi.CompletePayment({
      application_id: props.data.application_id,
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("Payment completed.");
      props.onCancel();
      props.reload();
    } else {
      setLoading(false);
      ResponseError(res);
    }
    props.onCancel();
  };

  return (
    <Modal
      title="Complete Payment"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Complete Equated Monthly Installment (EMI) payment"
        description={
          <Row>
            <Col span={24}>
              The EMI of{" "}
              <span style={{ color: "#5DBA5B", fontWeight: "bold" }}>
                {moment(props.data.emi_due_date).format("YYYY-MM-DD")}
              </span>{" "}
              is paid.
            </Col>
            <Col span={24}>
              The next EMI due date will be{" "}
              <span style={{ fontWeight: "bold" }}>
                {moment(newDueDate).format("YYYY-MM-DD")}
              </span>
            </Col>
          </Row>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
    </Modal>
  );
};

export default CompletePaymentModal;
