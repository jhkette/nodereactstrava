import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend);

const nums = [
  [90, 110],
  [110, 120],
  [121, 130],
  [131, 134],
  [135, 148],
];
const options = {
  plugins: {
    datalabels: {
      formatter: function (value, context) {
        return `${nums[context.dataIndex][0]} - ${
          nums[context.dataIndex][1]
        } bpm`;
      },
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem, data) => {
          return `${nums[tooltipItem.dataIndex][0]} - ${
            nums[tooltipItem.dataIndex][1]
          } bpm`;
        },
      },
    },
  },
};


export const data = {
  labels: ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"],
  datasets: [
    {
      label: "Heart rate zones",
      data: [110 - 90, 120 - 110, 130 - 120, 135 - 120, 148 - 135],
      backgroundColor: [
        "rgba(222,222,222, 0.3)",
        "rgba(54, 162, 235, 0.2)",
    
        "rgba(75, 192, 192, 0.2)",
        "rgba(278, 206, 86, 0.2)",
        "rgba(230,76,60, 0.4)",
      ],
      borderColor: [
        "rgba(222,222,222, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(278, 206, 86, 1)",
        "rgba(230,76,60, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function DoughnutChart() {
  return <Doughnut data={data} plugins={[ChartDataLabels]} options={options} />;
}
