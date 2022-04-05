import React, { useState, useEffect } from "react";
import { Modal, Row, Alert, Col, DatePicker, message } from "antd";
import moment from "moment";
import LoanManagementApi from "../../../../tools/Api/LoanManagement.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const EditEMIDueDateModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [newEMIDueDate, setNewEMIDueDate] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const dateFormat = "YYYY-MM-DD";

  const handleSubmit = async () => {
    setLoading(true);
    const res = await LoanManagementApi.EditEMIDueDate({
      application_id: props.data.application_id,
      new_emi_due_date: newEMIDueDate,
    });
    if (res.status === 200) {
      setLoading(false);
      message.success("EMI due date edited.");
      props.onCancel();
      props.reload();
    } else {
      ResponseError(res);
    }
    props.onCancel();
  };

  const updateEMIDueDate = (date, dateString) => {
    setButtonDisabled(false);
    setNewEMIDueDate(date);
    console.log(date, 1234);
  };

  return (
    <Modal
      title="Edit EMI Due Date"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okButtonProps={{ loading: loading, disabled: buttonDisabled }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Edit Equated Monthly Installment Due Date"
        description={
          <Row>
            <Row>
              <span style={{ color: "red" }}>
                *Remember to inform the customer to re-apply the reminder.
              </span>
            </Row>
            <Col span={24}>
              The EMI due date of customer will be set to the date selected:
            </Col>
          </Row>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Col>
        <span style={{ padding: 10 }}>Select New Due Date:</span>
        <DatePicker format={dateFormat} onChange={updateEMIDueDate} />
      </Col>
    </Modal>
  );
};

export default EditEMIDueDateModal;
