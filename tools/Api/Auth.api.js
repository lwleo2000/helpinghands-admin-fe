import { Connector } from "./api";
const instance = Connector;

export default {
  Login: (data) => {
    return instance
      .post("/auth/login", data)
      .then((res) => res)
      .catch((error) => error);
  },
};
