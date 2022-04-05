import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { message, Form, Row, Col, Input, Button, Modal } from "antd";
import AuthApi from "../../tools/Api/Auth.api";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";

const Login = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookie = new Cookies();
    const jwt = cookie.get("jwt", { path: "/" });
    if (jwt) {
      props.router.push("/dashboard");
    }
  });
  const formLayout = {
    labelCol: {
      xs: { span: 24 },
      md: { span: 6 },
      xl: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      md: { span: 19 },
      xl: { span: 19 },
    },
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      console.log(formValues, 666);
      const res = await AuthApi.Login(formValues);
      console.log(res, 444);

      if (res.status === 200) {
        setLoading(false);
        const cookie = new Cookies();
        cookie.set("jwt", res.data.data.jwt);
        message.success("Login Successfuly!");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setLoading(false);
        ResponseError(res);
      }
    } catch (error) {
      setLoading(false);
      ResponseError(error);
    }
  };

  return (
    <Row>
      <Col span={12}>
        <img
          src="/media/loginImage.png"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </Col>
      <Col span={12}>
        <Row
          style={{
            display: "flex",
            height: "100vh",
          }}
          justify="center"
          align="middle"
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: window.innerWidth < 1300 ? 50 : 100,
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          >
            <Row justify="center" style={{ paddingBottom: 20 }}>
              <img src="/media/loginLogo.png" />
            </Row>
            <Row
              style={{
                paddingBottom: 30,
                justifyContent: "center",
                fontSize: 30,
                fontWeight: "bold",
              }}
            >
              Login to Admin Dashboard
            </Row>
            <Form
              name="login"
              form={form}
              colon={false}
              hideRequiredMark
              {...formLayout}
            >
              <Form.Item
                hasFeedback
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "Please insert valid email",
                  },
                  {
                    required: true,
                    message: "Please insert your email",
                  },
                ]}
              >
                <Input autoFocus placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please insert your password",
                  },
                ]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>
              <Row type="flex" justify="end" style={{ marginTop: 16 }}>
                <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 18 }}>
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    style={{ backgroundColor: "#61ACF1" }}
                    loading={loading}
                    onClick={() => handleLogin()}
                  >
                    Login
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Row>
      </Col>
    </Row>
  );
};

export default withRouter(Login);
