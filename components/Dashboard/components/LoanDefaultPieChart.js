import React, { useState, useEffect } from "react";
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction,
  getTheme,
} from "bizcharts";

const LoanDefaultPieChart = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getLoanStatusStats();
  }, []);

  const getLoanStatusStats = async () => {
    setData([
      {
        item: "Under Approval",
        count: 10,
        percent: 0.1,
      },
      {
        item: "Rejected",
        count: 20,
        percent: 0.2,
      },
      {
        item: "Suspended",
        count: 30,
        percent: 0.3,
      },
      {
        item: "Approved",
        count: 10,
        percent: 0.1,
      },
      {
        item: "Loan Disbursed",
        count: 20,
        percent: 0.2,
      },
      {
        item: "Fully Paid",
        count: 10,
        percent: 0.1,
      },
    ]);
  };

  const cols = {
    percentage: {
      formatter: (val) => {
        val = val + "%";
        return val;
      },
    },
  };

  return (
    <Chart
      height={400}
      data={props.data}
      scale={cols}
      autoFit
      onIntervalClick={(e) => {
        const states = e.target.cfg.element.getStates();
      }}
      onGetG2Instance={(c) => {
        console.log(c.getXY(data[0]));
      }}
    >
      <Coordinate type="theta" radius={0.75} />
      <Tooltip showTitle={false} />
      <Axis visible={false} />
      <Interval
        position="percentage"
        adjust="stack"
        color="loan_default"
        style={{
          lineWidth: 1,
          stroke: "#fff",
        }}
        label={[
          "loan_default",
          {
            layout: { type: "limit-in-plot", cfg: { action: "ellipsis" } },
            content: (data) => {
              return `${data.loan_default}: ${data.percentage}%`;
            },
          },
        ]}
        state={{
          selected: {
            style: (t) => {
              const res = getTheme().geometries.interval.rect.selected.style(t);
              return { ...res, fill: "#014f86" };
            },
          },
        }}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  );
};

export default LoanDefaultPieChart;
