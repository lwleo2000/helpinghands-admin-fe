import { Connector } from "./api";
const instance = Connector;

export default {
  GetLoanApplication: () => {
    return instance
      .get("/loan-application/get-loan-application")
      .then((res) => res)
      .catch((error) => error);
  },
  GetLoanApplicationList: () => {
    return instance
      .get("/loan-application/get-loan-application-list")
      .then((res) => res)
      .catch((error) => error);
  },
  GetLoanApplicationForm: (application_id) => {
    return instance
      .get(
        "/loan-application/get-loan-application-form?application_id=" +
          application_id
      )
      .then((res) => res)
      .catch((error) => error);
  },

  VerifyApplication: (body) => {
    return instance
      .post("/loan-application/verify-loan-application", body)
      .then((res) => res)
      .catch((error) => error);
  },

  GetActiveLoan: () => {
    return instance
      .get("/loan-application/get-active-loan")
      .then((res) => res)
      .catch((error) => error);
  },
};
