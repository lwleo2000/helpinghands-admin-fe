import React, { useState, useEffect } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import moment from "moment";
import LoanManagementApi from "../../../../tools/Api/LoanManagement.api";
import Currency from "react-currency-formatter";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const AssignPenaltyModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [penaltyFee, setPenaltyFee] = useState(0);

  useEffect(() => {
    calculatePenaltyFee();
  });

  const calculatePenaltyFee = () => {
    const loan_emi = props.data.loan_emi;
    const penalty_fee = parseFloat(loan_emi * 0.02).toFixed(2);
    setPenaltyFee(penalty_fee);
    console.log(penaltyFee, 5566);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await LoanManagementApi.AssignPenalty({
      application_id: props.data.application_id,
      penalty_fee: penaltyFee,
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("Penalty assigned");
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
      title="Assign Penalty"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Penalty on Late EMI payment"
        description={
          <Row>
            <Col span={24}>Customer ID: {props.data.customer_id}</Col>
            <Col span={24}>Customer Name: {props.data.name}</Col>
            <Col span={24}>
              The customer above will be charged with penalty fee of{" "}
              <Currency currency="MYR" quantity={penaltyFee} />
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

export default AssignPenaltyModal;
