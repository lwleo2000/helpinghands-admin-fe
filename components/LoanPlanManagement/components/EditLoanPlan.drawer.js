import React, { Component, useEffect, useState, useRef } from "react";
import {
  Modal,
  Form,
  Col,
  Row,
  Input,
  Drawer,
  Button,
  InputNumber,
} from "antd";
import LoanPlanApi from "../../../tools/Api/LoanPlan.api";
import { ResponseError } from "../../../tools/ErrorHandler/ErrorHandler";

const EditLoanPlanDrawer = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      md: { span: 6 },
      xl: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      md: { span: 18 },
      xl: { span: 18 },
    },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const handleEditLoanPlan = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const res = await LoanPlanApi.EditLoanPlan({
        loan_plan_id: props.data.loan_plan_id,
        title: formValues.title,
        annual_interest_rate: formValues.annual_interest_rate,
        max_loan: formValues.max_loan,
      });
      console.log(res, 7777);
      if (res.status === 200) {
        setLoading(false);
        Modal.success({
          title: "Loan Plan Edited",
          content: "Successfully edited the existing loan plan!",
          onOk() {
            form.resetFields();
            props.closeModal();
            props.reload();
          },
        });
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      setLoading(false);
      ResponseError(error);
      console.log(error);
    }
  };

  const LoanPlanEditForm = (
    <Row>
      <Col span={24}>
        <Form
          {...formItemLayout}
          form={form}
          hideRequiredMark
          colon={false}
          name="edition"
          scrollToFirstError
        >
          <Form.Item
            label="Title"
            hasFeedback
            name="title"
            rules={[
              {
                required: true,
                message: "Please insert your title",
              },
            ]}
          >
            <Input disabled={loading} placeholder="Personal Loan" />
          </Form.Item>
          <Form.Item
            label="Annual Interest Rate"
            hasFeedback
            name="annual_interest_rate"
            rules={[
              {
                required: true,
                message: "Please insert your annual interest rate",
              },
            ]}
          >
            <InputNumber type="number" disabled={loading} placeholder="18(%)" />
          </Form.Item>
          <Form.Item
            label="Max Loan"
            hasFeedback
            name="max_loan"
            rules={[
              {
                required: true,
                message: "Please insert your maximum loan",
              },
            ]}
          >
            <InputNumber disabled={loading} placeholder="0.00" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleEditLoanPlan();
              }}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
  return (
    <Drawer
      afterVisibleChange={() => {
        form.setFieldsValue({
          title: props.data.title,
          annual_interest_rate: props.data.annual_interest_rate,
          max_loan: props.data.max_loan,
        });
      }}
      onClose={() => {
        props.closeModal();
      }}
      destroyOnClose
      visible={props.visible}
      title="Create New Loan Plan"
      width={580}
    >
      {LoanPlanEditForm}
    </Drawer>
  );
};

export default EditLoanPlanDrawer;
