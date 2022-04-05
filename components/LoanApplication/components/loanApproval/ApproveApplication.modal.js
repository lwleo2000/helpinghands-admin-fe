import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import LoanApplicationApi from "../../../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const ApproveApplicationModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.VerifyApplication({
      application_id: props.data.application_id,
      customer_id: props.data.customer_id,
      loan_amount: props.data.emi_plan.loan_amount,
      loan_term: props.data.emi_plan.loan_term,
      loan_emi: props.data.emi_plan.loan_emi,
      total_interest: props.data.emi_plan.total_interest,
      email: props.data.basic_information.email,
      action: "Approved",
      remarks: "",
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("Loan Application is approved.");
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
      title="Approve Application"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleApprove}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Approve"
        description={
          <Row>
            <Col span={24}>
              The application with following application number will be approved
              :
            </Col>
            <Col style={{ marginTop: "5%" }}>#{props.data.application_id}</Col>
          </Row>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
    </Modal>
  );
};

export default ApproveApplicationModal;
