import { Connector } from "./api";
const instance = Connector;

export default {
  CompletePayment: (data) => {
    return instance
      .post("/loan-management/complete-payment", data)
      .then((res) => res)
      .catch((error) => error);
  },
  EditEMIDueDate: (data) => {
    return instance
      .post("/loan-management/edit-emi-due-date", data)
      .then((res) => res)
      .catch((error) => error);
  },
  AssignPenalty: (data) => {
    return instance
      .post("/loan-management/assign-penalty", data)
      .then((res) => res)
      .catch((error) => error);
  },
  GetPaymentDetails: (application_id) => {
    return instance
      .get(
        "/loan-management/get-payment-details?application_id=" + application_id
      )
      .then((res) => res)
      .catch((error) => error);
  },
};
