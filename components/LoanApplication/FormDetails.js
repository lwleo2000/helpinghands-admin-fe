import React, { useEffect, useState } from "react";
import {
  PageHeader,
  Avatar,
  Col,
  Row,
  Divider,
  Descriptions,
  Upload,
  Modal,
  Skeleton,
  Alert,
  Button,
  Form,
  Input,
  Tabs,
} from "antd";
import { withRouter } from "next/router";
import AdminMenu from "../Menu/Menu";
import Currency from "react-currency-formatter";
import { UserOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import LoanApplicationApi from "../../tools/Api/LoanApplication.api";
import { ResponseError } from "../../tools/ErrorHandler/ErrorHandler";
import moment from "moment";

const FormDetails = (props) => {
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loanApplicationForm, setLoanApplicationForm] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [approvalButtonVisible, setApprovalButtonVisible] = useState(true);
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    getLoanApplicationForm();
    if (props.router.query.read_only === "true") {
      setApprovalButtonVisible(false);
    }
  }, []);

  const getLoanApplicationForm = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.GetLoanApplicationForm(
      props.router.query.applicationNumber
    );
    if (res.status === 200) {
      setLoading(false);
      setLoanApplicationForm(res.data.data);
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleApproveApplication = async () => {
    setLoading(true);
    const res = await LoanApplicationApi.VerifyApplication({
      application_id: loanApplicationForm[0].application_id,
      customer_id: loanApplicationForm[0].customer_id,
      loan_amount: loanApplicationForm[0].emi_plan.loan_amount,
      loan_term: loanApplicationForm[0].emi_plan.loan_term,
      loan_emi: loanApplicationForm[0].emi_plan.loan_emi,
      total_interest: loanApplicationForm[0].emi_plan.total_interest,
      email: loanApplicationForm[0].basic_information.email,
      action: "Approved",
      remarks: "",
    });
    if (res.status === 200) {
      setLoading(false);
      props.router.push("/loan-approval");
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const handleRejectApplication = async () => {
    setLoading(true);
    const values = await form.validateFields();
    const res = await LoanApplicationApi.VerifyApplication({
      application_id: loanApplicationForm[0].application_id,
      customer_id: loanApplicationForm[0].customer_id,
      loan_amount: loanApplicationForm[0].emi_plan.loan_amount,
      loan_term: loanApplicationForm[0].emi_plan.loan_term,
      loan_emi: loanApplicationForm[0].emi_plan.loan_emi,
      total_interest: loanApplicationForm[0].emi_plan.total_interest,
      email: loanApplicationForm[0].basic_information.email,
      action: "Rejected",
      remarks: values.remarks,
    });
    if (res.status === 200) {
      setLoading(false);
      form.resetFields();
      props.router.push("/loan-approval");
    } else {
      setLoading(false);
      ResponseError(res);
    }
  };

  const previewModal = (
    <Modal
      visible={previewVisible}
      footer={null}
      onCancel={() => setPreviewVisible(false)}
    >
      <img alt="Image" style={{ width: "100%" }} src={previewImage} />
    </Modal>
  );

  const RejectModal = (
    <Modal
      visible={modalVisible}
      title="Reject Loan Application"
      onCancel={() => setModalVisible(false)}
      onOk={handleRejectApplication}
      okButtonProps={{ loading: loading }}
      cancelButtonProps={{ disabled: loading }}
    >
      <Alert
        message="Informational Notes"
        description="Additional description and information about copywriting."
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

  const pageHeader = (
    <PageHeader
      style={{ backgroundColor: "#fff", marginTop: 4 }}
      title="Loan Application Form Details"
      extra={[
        approvalButtonVisible && (
          <Button.Group key="approvalButton">
            <Button
              type="danger"
              key="rejectAccount"
              onClick={() => {
                setModalVisible(true);
              }}
              loading={loading}
            >
              <CloseOutlined /> Reject
            </Button>
            <Button
              type="primary"
              key="approveAccount"
              loading={loading}
              onClick={() =>
                Modal.confirm({
                  title: "Approve Loan Application?",
                  content: "Customer will be notified with the loan approval.",
                  onOk: () => {
                    handleApproveApplication();
                  },
                })
              }
            >
              <CheckOutlined /> Approve
            </Button>
          </Button.Group>
        ),
      ]}
    />
  );

  const loanApplicationDetails =
    loanApplicationForm[0] && fileList ? (
      <div style={{ backgroundColor: "#fff", paddingLeft: 8, paddingRight: 8 }}>
        <div style={{ padding: 10 }}>
          <Row style={{ alignItems: "center" }}>
            <Col>
              <Avatar size={100} icon={<UserOutlined />} />
            </Col>
            <Col style={{ fontSize: 20, paddingLeft: 25 }}>
              {loanApplicationForm[0].basic_information.name}
            </Col>
          </Row>
          <Row style={{ marginTop: "3%" }}>
            <Col span={24}>
              <Descriptions
                title={
                  <Divider orientation="left">Personal Information</Divider>
                }
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Birth Date">
                  {moment(
                    loanApplicationForm[0].basic_information.birth_date
                  ).format("YYYY-MM-DD")}
                </Descriptions.Item>
                <Descriptions.Item label="NRIC">
                  {loanApplicationForm[0].basic_information.ic_number}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {loanApplicationForm[0].basic_information.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Race">
                  {loanApplicationForm[0].basic_information.race}
                </Descriptions.Item>
                <Descriptions.Item label="Martial Status">
                  {loanApplicationForm[0].basic_information.martial_status}
                </Descriptions.Item>
                <Descriptions.Item label="Educational level">
                  {loanApplicationForm[0].basic_information.educational_level}
                </Descriptions.Item>
                <Descriptions.Item label="Home Ownership">
                  {loanApplicationForm[0].basic_information.home_ownership}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions
                title={
                  <Divider orientation="left">
                    Current Residential Address
                  </Divider>
                }
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Address Line 1">
                  {loanApplicationForm[0].basic_information.address_line_1}
                </Descriptions.Item>
                <Descriptions.Item label="Address Line 2">
                  {loanApplicationForm[0].basic_information.address_line_2}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {" "}
                  {loanApplicationForm[0].basic_information.city}
                </Descriptions.Item>
                <Descriptions.Item label="Post Code">
                  {" "}
                  {loanApplicationForm[0].basic_information.post_code}
                </Descriptions.Item>
                <Descriptions.Item label="State">
                  {" "}
                  {loanApplicationForm[0].basic_information.state}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={
                  <Divider orientation="left">Contact Information</Divider>
                }
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Email">
                  {loanApplicationForm[0].basic_information.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {loanApplicationForm[0].basic_information.phone_number}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={
                  <Divider orientation="left">Working Information</Divider>
                }
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Company Name">
                  {loanApplicationForm[0].social_information.company_name}
                </Descriptions.Item>
                <Descriptions.Item label="Employment Status">
                  {loanApplicationForm[0].social_information.employment_status}
                </Descriptions.Item>
                <Descriptions.Item label="Position">
                  {loanApplicationForm[0].social_information.position}
                </Descriptions.Item>
                <Descriptions.Item label="Office Address">
                  {loanApplicationForm[0].social_information.office_address}
                </Descriptions.Item>
                <Descriptions.Item label="Company Contact">
                  {
                    loanApplicationForm[0].social_information
                      .company_phone_number
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Annual Income">
                  <Currency
                    currency="MYR"
                    quantity={
                      loanApplicationForm[0].social_information.annual_income
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Employment Length">
                  {loanApplicationForm[0].social_information.employment_length}{" "}
                  year(s)
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={
                  <Divider orientation="left">1.Emergency Contact</Divider>
                }
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Name">
                  {loanApplicationForm[0].social_information.dependant_name_1}
                </Descriptions.Item>
                <Descriptions.Item label="Relationship">
                  {" "}
                  {
                    loanApplicationForm[0].social_information
                      .dependant_relationship_1
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {
                    loanApplicationForm[0].social_information
                      .dependant_phone_number_1
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={
                  <Divider orientation="left">2.Emergency Contact</Divider>
                }
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Name">
                  {" "}
                  {loanApplicationForm[0].social_information.dependant_name_2}
                </Descriptions.Item>
                <Descriptions.Item label="Relationship">
                  {" "}
                  {
                    loanApplicationForm[0].social_information
                      .dependant_relationship_2
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {
                    loanApplicationForm[0].social_information
                      .dependant_phone_number_2
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={<Divider orientation="left">NRIC photo</Divider>}
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="NRIC Front Photo">
                  <Upload
                    accept="image/*"
                    fileList={
                      loanApplicationForm[0].identity_photo.front_NRIC_photo
                    }
                    listType="picture-card"
                    showUploadList={{
                      showDownloadIcon: false,
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                    }}
                    onPreview={handlePreview}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="NRIC Back Photo">
                  <Upload
                    accept="image/*"
                    fileList={
                      loanApplicationForm[0].identity_photo.back_NRIC_photo
                    }
                    listType="picture-card"
                    showUploadList={{
                      showDownloadIcon: false,
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                    }}
                    onPreview={handlePreview}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="User Indentity Confirmation Photo">
                  <Upload
                    accept="image/*"
                    fileList={loanApplicationForm[0].identity_photo.face_photo}
                    listType="picture-card"
                    showUploadList={{
                      showDownloadIcon: false,
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                    }}
                    onPreview={handlePreview}
                  />
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={<Divider orientation="left">Bank Information</Divider>}
                layout="horizontal"
                bordered
                size="middle"
              >
                <Descriptions.Item label="Bank">
                  {loanApplicationForm[0].bank_information.bank}
                </Descriptions.Item>
                <Descriptions.Item label="Account Number">
                  {loanApplicationForm[0].bank_information.bank_account_number}
                </Descriptions.Item>
                <Descriptions.Item label="Account Name">
                  {loanApplicationForm[0].bank_information.bank_account_name}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      </div>
    ) : (
      <Skeleton avatar paragraph={{ rows: 25 }} />
    );

  const lenderSignatureFile = [
    {
      uid: "1",
      name: "lenderSign.png",
      status: "done",
      url: "https://helpinghands-bucket-2000.s3.ap-southeast-1.amazonaws.com/lenderSign.png",
    },
  ];

  const loanAgreement = loanApplicationForm[0] ? (
    <div style={{ backgroundColor: "#fff", paddingLeft: 8, paddingRight: 8 }}>
      <div style={{ padding: 50 }}>
        <Row>
          <Col span={24} style={{ textAlign: "center", fontSize: 25 }}>
            HelpingHands Loan Agreement
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            The loan agreement is made and will be effective on.{" "}
            {moment(
              loanApplicationForm[0].loan_agreement.submission_date
            ).format("YYYY-MM-DD")}
          </Col>
          <Col
            span={24}
            style={{ textAlign: "center", fontWeight: "bold", marginTop: "2%" }}
          >
            BETWEEN
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            {loanApplicationForm[0].basic_information.name +
              " with the introduction as borrower with street address of " +
              loanApplicationForm[0].basic_information.address_line_1 +
              ", " +
              loanApplicationForm[0].basic_information.address_line_2 +
              " along with city of " +
              loanApplicationForm[0].basic_information.city +
              ", state of " +
              loanApplicationForm[0].basic_information.state +
              ", post code of " +
              loanApplicationForm[0].basic_information.post_code +
              "."}
          </Col>
          <Col
            span={24}
            style={{ textAlign: "center", fontWeight: "bold", marginTop: "2%" }}
          >
            AND
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            HelpingHands with the introduction as lender with street address of
            1, lorong Oren 66, Taman Oren along with city of Sungai Long, state
            of Selangor, post code of 43000.
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            HEREINAFTER, the Borrower and Lender agree to the following loan
            details:
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            <span style={{ fontWeight: "bold" }}>LOAN AMOUNT: </span>
            <Currency
              quantity={loanApplicationForm[0].emi_plan.loan_amount}
              currency="MYR"
            />
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            <span style={{ fontWeight: "bold" }}>LOAN TERM: </span>
            {loanApplicationForm[0].emi_plan.loan_term} month(s)
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            <span style={{ fontWeight: "bold" }}>LOAN EMI: </span>
            <Currency
              quantity={loanApplicationForm[0].emi_plan.loan_emi}
              currency="MYR"
            />
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            <span style={{ fontWeight: "bold" }}>TOTAL INTEREST AMOUNT: </span>
            <Currency
              quantity={loanApplicationForm[0].emi_plan.total_interest}
              currency="MYR"
            />
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            {"Bear the interest is at the rate of " +
              loanApplicationForm[0].loan_plan.annual_interest_rate +
              "% compounded annually."}
          </Col>
          <Col span={24} style={{ fontWeight: "bold", marginTop: "2%" }}>
            PROMISE TO PAY:
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            {"Within " +
              loanApplicationForm[0].emi_plan.loan_term +
              " months from the next month after the loan is disbursed. Borrower promises to pay the Lender " +
              loanApplicationForm[0].emi_plan.loan_term +
              " before the EMI due date of each month."}
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            All payments made by the Borrower are to be applied first to any
            accrued interest and then to the principal balance.
          </Col>
          <Col span={24} style={{ fontWeight: "bold", marginTop: "2%" }}>
            PAYMENT INSTRUCTIONS:
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            The Borrower shall make payment to the Lender using FPX online
            banking provided by the HelpingHands apps.
          </Col>
          <Col span={24} style={{ fontWeight: "bold", marginTop: "2%" }}>
            LATE FEE:
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            If the Borrower missed the payment due date, the Lender shall charge
            a late fee of 2% of the payment owed.
          </Col>
          <Col span={24} style={{ fontWeight: "bold", marginTop: "2%" }}>
            LICENSE:
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            The Lender is a licensed moneylender under the Moneylenders Act 1951
            hereby agrees to lend the Borrower and the Borrowers agree to borrow
            from the Lender for the purpose of this agreement a sum of money as
            specified above.
          </Col>
          <Col span={24} style={{ fontWeight: "bold", marginTop: "2%" }}>
            DEFAULT:
          </Col>
          <Col span={24} style={{ marginTop: "2%" }}>
            The Lender has the right to assign the Borrower as loan defaulter if
            the Borrower delays their equated monthly installment by 90 days.
          </Col>
          <Col span={24} style={{ fontWeight: "bold", marginTop: "2%" }}>
            <Row>
              <Col span={12}>
                Lender's Signature:
                <Upload
                  accept="image/*"
                  fileList={lenderSignatureFile}
                  listType="picture-card"
                  showUploadList={{
                    showDownloadIcon: false,
                    showPreviewIcon: true,
                    showRemoveIcon: false,
                  }}
                  onPreview={handlePreview}
                />
              </Col>
              <Col span={12}>
                Borrower's Signature:
                <Upload
                  accept="image/*"
                  fileList={loanApplicationForm[0].loan_agreement.signature}
                  listType="picture-card"
                  showUploadList={{
                    showDownloadIcon: false,
                    showPreviewIcon: true,
                    showRemoveIcon: false,
                  }}
                  onPreview={handlePreview}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  ) : (
    <Skeleton avatar paragraph={{ rows: 25 }} />
  );

  return (
    <AdminMenu menu={props.router.query.id} ViewPageHeader={pageHeader}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Application Form" key="1">
          {loanApplicationDetails}
          {previewModal}
          {RejectModal}
        </TabPane>
        <TabPane tab="Loan Agreement" key="2">
          {loanAgreement}
        </TabPane>
      </Tabs>
    </AdminMenu>
  );
};

export default withRouter(FormDetails);
