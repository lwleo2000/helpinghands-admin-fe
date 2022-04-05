import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import LoanPlanApi from "../../../tools/Api/LoanPlan.api";
import { ResponseError } from "../../../tools/ErrorHandler/ErrorHandler";

const DeleteLoanPlanModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteLoanPlan = async () => {
    setLoading(true);
    console.log(props.data.loan_plan_id, 1222);
    const res = await LoanPlanApi.LoanPlanAction({
      loan_plan_id: props.data.loan_plan_id,
      action: "delete",
    });
    if (res.status === 200) {
      setLoading(false);
      props.closeModal();
      props.reload();
      message.success("Loan plan deleted.");
    } else {
      ResponseError(res);
    }
  };

  return (
    <Modal
      title="Delete Loan Plan"
      visible={props.visible}
      onCancel={props.closeModal}
      onOk={handleDeleteLoanPlan}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Delete Loan Plan"
        description={
          <Row>
            <Col span={24}>
              Loan Plan #
              <span style={{ fontWeight: "bold" }}>
                {props.data.loan_plan_id}
              </span>{" "}
              will be deleted.
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

export default DeleteLoanPlanModal;
