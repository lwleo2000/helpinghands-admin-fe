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

const CreateLoanPlanDrawer = (props) => {
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

  const handleCreateLoanPlan = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const res = await LoanPlanApi.CreateLoanPlan(formValues);
      console.log(res, 7777);
      if (res.status === 200) {
        setLoading(false);
        Modal.success({
          title: "Loan Plan Created",
          content: "Successfully created new loan plan!",
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

  const LoanPlanCreationForm = (
    <Row>
      <Col span={24}>
        <Form
          {...formItemLayout}
          form={form}
          hideRequiredMark
          colon={false}
          name="creation"
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
                handleCreateLoanPlan();
              }}
              loading={loading}
            >
              Submit
            </Button>
            <Button
              htmlType="button"
              onClick={() => form.resetFields()}
              disabled={loading}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
  return (
    <Drawer
      onClose={() => {
        form.resetFields();
        props.closeModal();
      }}
      destroyOnClose
      visible={props.visible}
      title="Create New Loan Plan"
      width={580}
    >
      {LoanPlanCreationForm}
    </Drawer>
  );
};

export default CreateLoanPlanDrawer;
