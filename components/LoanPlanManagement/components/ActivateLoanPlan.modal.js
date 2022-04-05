import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import LoanPlanApi from "../../../tools/Api/LoanPlan.api";

const ActivateLoanPlanModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleActivateLoanPlan = async () => {
    setLoading(true);
    console.log(props.data.loan_plan_id, 1222);
    const res = await LoanPlanApi.LoanPlanAction({
      loan_plan_id: props.data.loan_plan_id,
      action: "activate",
    });
    if (res.status === 200) {
      setLoading(false);
      props.closeModal();
      props.reload();
      message.success("Loan plan activated.");
    } else {
      ResponseError(res);
    }
  };

  return (
    <Modal
      title="Activate Loan Plan"
      visible={props.visible}
      onCancel={props.closeModal}
      onOk={handleActivateLoanPlan}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Activate Loan Plan"
        description={
          <Row>
            <Col span={24}>
              Loan Plan #
              <span style={{ fontWeight: "bold" }}>
                {props.data.loan_plan_id}
              </span>{" "}
              will be activated.
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

export default ActivateLoanPlanModal;
