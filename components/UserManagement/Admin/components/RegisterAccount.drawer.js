import React, { Component, useEffect, useState, useRef } from "react";
import { Modal, Form, Col, Row, Input, Drawer, Button } from "antd";
import AuthApi from "../../../../tools/Api/UserManagement.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";
const RegisterAccount = (props) => {
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

  const compareToFirstPassword = (rule, value) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject("Password Inconsistent");
    } else {
      return Promise.resolve();
    }
  };

  const handleRegisterAccount = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      delete formValues.confirm_password;
      const res = await AuthApi.RegisterAdminAccount(formValues);
      console.log(res, 7777);
      if (res.status === 200) {
        setLoading(false);
        Modal.success({
          title: "Register Successful!",
          content:
            "Successfully registered new account!\nEmail: " + formValues.email,
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

  const RegistrationForm = (
    <Row>
      <Col span={24}>
        <Form
          {...formItemLayout}
          form={form}
          hideRequiredMark
          colon={false}
          name="registration"
          scrollToFirstError
        >
          <Form.Item
            label="Full Name"
            hasFeedback
            name="full_name"
            rules={[
              {
                required: true,
                message: "Please insert your full name",
              },
            ]}
          >
            <Input disabled={loading} placeholder="Lean Wei Liang" />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            hasFeedback
            name="phone_number"
            rules={[
              {
                required: true,
                message: "Please insert your phone number",
              },
              {
                min: 10,
                max: 11,
                message: "Please key in 10-11 numbers",
              },
            ]}
          >
            <Input type="number" disabled={loading} placeholder="0123456789" />
          </Form.Item>
          <Form.Item
            label="Email"
            hasFeedback
            name="email"
            rules={[
              {
                required: true,
                message: "Please insert your email",
              },
              {
                type: "email",
                message: "Please insert valid email",
              },
            ]}
          >
            <Input disabled={loading} placeholder="lwleo02@hotmail.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            hasFeedback
            name="password"
            rules={[
              {
                required: true,
                message: "Please insert your password",
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/,
                message:
                  "Minimum 8 characters, at least 1 Uppercase letter, 1 Lowercase letter and 1 Number",
              },
            ]}
          >
            <Input.Password disabled={loading} />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            hasFeedback
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "Password Inconsistent",
              },
              {
                validator: compareToFirstPassword,
              },
            ]}
          >
            <Input.Password disabled={loading} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleRegisterAccount();
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
      title="Register New Account"
      width={580}
    >
      {RegistrationForm}
    </Drawer>
  );
};

export default RegisterAccount;
