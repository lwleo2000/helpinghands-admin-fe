import { Connector } from "./api";
const instance = Connector;

export default {
  GetLoanPlanList: () => {
    return instance
      .get("/loan-plan-management/get-loan-plan-list")
      .then((res) => res)
      .catch((error) => error);
  },
  CreateLoanPlan: (data) => {
    return instance
      .post("/loan-plan-management/create-loan-plan", data)
      .then((res) => res)
      .catch((error) => error);
  },
  EditLoanPlan: (data) => {
    return instance
      .post("/loan-plan-management/edit-loan-plan", data)
      .then((res) => res)
      .catch((error) => error);
  },
  LoanPlanAction: (data) => {
    return instance
      .post("/loan-plan-management/loan-plan-action", data)
      .then((res) => res)
      .catch((error) => error);
  },
};
