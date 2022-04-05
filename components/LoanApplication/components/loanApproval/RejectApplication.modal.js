import React, { useState } from "react";
import { Modal, Alert, Input, Form, message } from "antd";
import LoanApplicationApi from "../../../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const RejectApplicationModal = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    const values = await form.validateFields();
    const res = await LoanApplicationApi.VerifyApplication({
      application_id: props.data.application_id,
      customer_id: props.data.customer_id,
      loan_amount: props.data.emi_plan.loan_amount,
      loan_term: props.data.emi_plan.loan_term,
      loan_emi: props.data.emi_plan.loan_emi,
      total_interest: props.data.emi_plan.total_interest,
      email: props.data.basic_information.email,
      action: "Rejected",
      remarks: values.remarks,
    });
    if (res.status === 200) {
      setLoading(false);
      form.resetFields();
      message.success("Loan Application is rejected.");
      props.onCancel();
      props.reload();
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  return (
    <Modal
      title="Reject Application"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleReject}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Reject"
        description="Write down the remarks for the rejection of loan application."
        type="info"
        showIcon
      />
      <Form form={form} style={{ marginTop: 16 }}>
        <Form.Item
          label="Remarks"
          name="remarks"
          rules={[
            {
              required: true,
              message: "Remarks is required",
            },
          ]}
        >
          <Input disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectApplicationModal;
