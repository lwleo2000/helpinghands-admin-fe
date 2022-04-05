import { Connector } from "./api";
const instance = Connector;

export default {
  GetDasboardAnalytics: (start_date, end_date) => {
    return instance
      .get(
        "/dashboard/get-dashboard-analytics?start_date=" +
          start_date +
          "&end_date=" +
          end_date
      )
      .then((res) => res)
      .catch((error) => error);
  },
};
