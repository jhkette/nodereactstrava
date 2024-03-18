import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  
  faSpinner
} from "@fortawesome/free-solid-svg-icons";



ChartJS.register(ArcElement, Tooltip, Legend);
//<FontAwesomeIcon icon="fa-solid fa-spinner" spinPulse />
export default function DoughnutChart({hr}) {
  if (!hr) {
    return <FontAwesomeIcon icon={faSpinner} spinPulse />
  }
  // const hr = props.hr;

  const nums = [hr.zone1, hr.zone2, hr.zone3, hr.zone4, hr.zone5];
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

  const data = {
    labels: ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"],
    datasets: [
      {
        label: "Heart rate zones",
        data: [
          hr.zone1[1] - hr.zone1[0],
          hr.zone2[1] - hr.zone2[0],
          hr.zone3[1] - hr.zone3[0],
          hr.zone4[1] - hr.zone4[0],
          hr.zone5[1] - hr.zone5[0],
        ],
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

  return <Doughnut data={data} plugins={[ChartDataLabels]} options={options} />;
}
