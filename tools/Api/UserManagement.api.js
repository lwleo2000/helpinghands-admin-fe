import { Connector } from "./api";
const instance = Connector;

export default {
  RegisterAdminAccount: (data) => {
    return instance
      .post("/user-management/register-admin-account", data)
      .then((res) => res)
      .catch((error) => error);
  },
  GetAdminList: () => {
    return instance
      .get("/user-management/get-admin-list")
      .then((res) => res)
      .catch((error) => error);
  },
  GetUserList: () => {
    return instance
      .get("/user-management/get-user-list")
      .then((res) => res)
      .catch((error) => error);
  },
  BanUserAccount: (data) => {
    return instance
      .post("/user-management/ban-user-account", data)
      .then((res) => res)
      .catch((error) => error);
  },
  BanAdminAccount: (data) => {
    return instance
      .post("/user-management/ban-admin-account", data)
      .then((res) => res)
      .catch((error) => error);
  },
  UnsetDefaulter: (data) => {
    return instance
      .post("/user-management/unset-defaulter", data)
      .then((res) => res)
      .catch((error) => error);
  },
};
