import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import LoanPlanApi from "../../../tools/Api/LoanPlan.api";
import { ResponseError } from "../../../tools/ErrorHandler/ErrorHandler";

const DeactivateLoanPlanModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleDeactivateLoanPlan = async () => {
    setLoading(true);
    console.log(props.data.loan_plan_id, 1222);
    const res = await LoanPlanApi.LoanPlanAction({
      loan_plan_id: props.data.loan_plan_id,
      action: "deactivate",
    });
    if (res.status === 200) {
      setLoading(false);
      props.closeModal();
      props.reload();
      message.success("Loan plan deactivated.");
    } else {
      ResponseError(res);
    }
  };

  return (
    <Modal
      title="Deactivate Loan Plan"
      visible={props.visible}
      onCancel={props.closeModal}
      onOk={handleDeactivateLoanPlan}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Deactivate Loan Plan"
        description={
          <Row>
            <Col span={24}>
              Loan Plan #
              <span style={{ fontWeight: "bold" }}>
                {props.data.loan_plan_id}
              </span>{" "}
              will be deactivated.
            </Col>
          </Row>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
    </Modal>
  );
};

export default DeactivateLoanPlanModal;
