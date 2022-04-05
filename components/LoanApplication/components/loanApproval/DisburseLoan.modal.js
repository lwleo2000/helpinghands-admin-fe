import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import Currency from "react-currency-formatter";
import LoanApplicationApi from "../../../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const DisburseLoanModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleDisburse = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.VerifyApplication({
      application_id: props.data.applicationId,
      customer_id: props.data.customerId,
      loan_amount: props.data.loanAmount,
      loan_term: props.data.loanTerm,
      loan_emi: props.data.loanEMI,
      total_interest: props.data.totalInterest,
      email: props.data.email,
      action: "Loan Disbursed",
      remarks: "",
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("Loan is disbursed.");
      props.onCancel();
      props.reload();
    } else {
      setLoading(false);
      ResponseError(res);
    }
    props.onCancel();
  };
  console.log(props.data, 1234);
  return (
    <Modal
      title="Disburse Loan"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleDisburse}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Disburse"
        description={
          <Row>
            <Col span={24}>
              Click OK if{" "}
              <span style={{ fontWeight: "bold" }}>
                <Currency quantity={props.data.loanAmount} currency="MYR" />
              </span>{" "}
              is already disbursed to customer with following details:
            </Col>
            <Col span={24} style={{ marginTop: "5%" }}>
              Bank: {props.data.bank}
            </Col>
            <Col span={24}>
              Bank Account Number: {props.data.bankAccountNumber}
            </Col>
            <Col span={24}>Bank Account Name: {props.data.bankAccountName}</Col>
          </Row>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
    </Modal>
  );
};

export default DisburseLoanModal;
