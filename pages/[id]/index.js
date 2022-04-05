import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Dashboard = dynamic(
  () => import("../../components/Dashboard/dashboard"),
  {
    ssr: false,
  }
);

const LoanApproval = dynamic(
  () => import("../../components/LoanApplication/LoanApproval"),
  {
    ssr: false,
  }
);

const ActiveLoan = dynamic(
  () => import("../../components/LoanManagement/ActiveLoan"),
  {
    ssr: false,
  }
);

const LoanApplicationList = dynamic(
  () => import("../../components/LoanManagement/LoanApplicationList"),
  {
    ssr: false,
  }
);

const User = dynamic(
  () => import("../../components/UserManagement/User/User"),
  {
    ssr: false,
  }
);

const Admin = dynamic(
  () => import("../../components/UserManagement/Admin/Admin"),
  {
    ssr: false,
  }
);

const FormDetails = dynamic(
  () => import("../../components/LoanApplication/FormDetails"),
  {
    ssr: false,
  }
);

const PaymentDetails = dynamic(
  () => import("../../components/LoanManagement/PaymentDetails"),
  {
    ssr: false,
  }
);

const LoanPlanList = dynamic(
  () => import("../../components/LoanPlanManagement/LoanPlanList"),
  {
    ssr: false,
  }
);

const Index = () => {
  const router = useRouter();
  const { id } = router.query;

  const RenderContent = (id) => {
    switch (id) {
      case "dashboard":
        return <Dashboard />;
      case "loan-approval":
        return <LoanApproval />;
      case "active-loan":
        return <ActiveLoan />;
      case "loan-application-list":
        return <LoanApplicationList />;
      case "user":
        return <User />;
      case "admin":
        return <Admin />;
      case "form-details":
        return <FormDetails />;
      case "payment-details":
        return <PaymentDetails />;
      case "loan-plan-list":
        return <LoanPlanList />;
      default:
        return <h1>No such page found</h1>;
    }
  };

  return <>{RenderContent(id)}</>;
};

export default Index;
