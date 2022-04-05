import React, { useState } from "react";
import { Modal, Row, Alert, Col, message } from "antd";
import UserManagementApi from "../../../../tools/Api/UserManagement.api";
import { ResponseError } from "../../../../tools/ErrorHandler/ErrorHandler";

const UnsetDefaulterModal = (props) => {
  const [loading, setLoading] = useState(false);

  const handleUnsetDefaulter = async () => {
    setLoading(true);
    const res = await UserManagementApi.UnsetDefaulter({
      account_number: props.data.account_number,
    });
    if (res.status === 200) {
      setLoading(false);
      props.onCancel();
      props.reload();
      message.success("Account is now non-defaulter.");
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  return (
    <Modal
      title="Unset Defaulter"
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleUnsetDefaulter}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Unset Defauler of Customer"
        description={
          <Row>
            <Col span={24}>
              Account with the following details will be set back to
              non-defaulter:
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

export default UnsetDefaulterModal;
