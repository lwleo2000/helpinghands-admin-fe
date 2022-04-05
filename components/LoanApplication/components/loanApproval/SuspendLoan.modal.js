import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import LoanApplicationApi from "../../../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const SuspendLoanModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.VerifyApplication({
      application_id: props.data.applicationId,
      customer_id: props.data.customerId,
      loan_amount: props.data.loanAmount,
      loan_term: props.data.loanTerm,
      loan_emi: props.data.loanEMI,
      total_interest: props.data.totalInterest,
      email: props.data.email,
      action: "Suspended",
      remarks: "",
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("Loan Application is suspended.");
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
      title="Reject Loan"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleSuspend}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Suspension"
        description={
          <Row>
            <Col span={24}>The loan disbursement will be suspended.</Col>
          </Row>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
    </Modal>
  );
};

export default SuspendLoanModal;
