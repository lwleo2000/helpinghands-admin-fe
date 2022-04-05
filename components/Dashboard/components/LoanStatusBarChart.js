import React, { useState } from "react";
import { Chart, Interval, Tooltip } from "bizcharts";
import { Row } from "antd";
const LoanStatusBarChart = (props) => {
  console.log(props.data, 5566);
  const [data, setData] = useState([
    {
      year: "1991",
      value: 3,
    },
    {
      year: "1992",
      value: 4,
    },
    {
      year: "1993",
      value: 3.5,
    },
    {
      year: "1994",
      value: 5,
    },
    {
      year: "1995",
      value: 4.9,
    },
    {
      year: "1996",
      value: 4.1,
    },
  ]);

  return (
    <Chart
      height={400}
      autoFit
      data={props.data}
      interactions={["active-region"]}
      padding={[60, 20, 40, 60]}
    >
      <Interval
        position="loan_status*count"
        color={[
          "loan_status",
          ["#D78A17", "#B80909", "#1E7310", "#3A44F4", "#8E17D7", "#03ADAD"],
        ]}
      />
      <Row>
        <Tooltip shared />
      </Row>
    </Chart>
  );
};

export default LoanStatusBarChart;
