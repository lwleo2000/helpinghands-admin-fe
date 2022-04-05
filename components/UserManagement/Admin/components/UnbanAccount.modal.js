import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import UserManagementApi from "../../../../tools/Api/UserManagement.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const UnbanAccountModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleUnbanAccount = async () => {
    setLoading(true);
    const res = await UserManagementApi.BanAdminAccount({
      account_number: props.data.account_number,
      action: "unban",
    });
    if (res.status === 200) {
      setLoading(false);
      props.onCancel();
      props.reload();
      message.success("Account has been unbanned.");
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  return (
    <Modal
      title="Unban Admin Account"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleUnbanAccount}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Unban Account"
        description={
          <Row>
            <Col span={24}>
              Account with the following details will be unbanned
            </Col>
            <Col span={24} style={{ marginTop: "5%", fontWeight: "bold" }}>
              Account Number: {props.data.account_number}
            </Col>
            <Col span={24} style={{ fontWeight: "bold" }}>
              Name: {props.data.full_name}
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

export default UnbanAccountModal;
