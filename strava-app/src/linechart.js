import React from "react";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";
// import { enUS } from 'date-fns/locale';
import "chartjs-adapter-moment";
import moment from "moment";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  annotationPlugin,
  Title,
  Tooltip,
  Legend
);
const labels = [15, 30, 60, 120, 180, 240, 400, 600];
export const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
    annotation: {
      annotations: {
        line1: {
          type: "line",
          yMin: 350,
          yMax: 350,
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 2,
          borderDash: [4],
        },
      },
    },
  },
  scales: {
    x: {
      type: "linear",
      beginAtZero: true,
      ticks: {
        stepSize: 60,
        color: "green",
        font: {
          weight: "bold",
        },
       
        callback: (val) => {
          if (val < 60) {
            return val;
          }
          const remainder = val % 60;
          const minutes = (val - remainder) / 60;
          return `${minutes} min`;
        },
      },
      title: {
        display: true,
        text: "Time",
        font: {
          weight: "bold",
          size: 22,
        },
      },
    },
    y: {
      title: {
        display: true,
        text: "Power in watts",
        font: {
          weight: "bold",
          size: 22,
        },
      },
  
      beginAtZero: true,
    },
  },
};

//   https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/types/line.html
export const data = {
  labels,
  datasets: [
    {
      label: "Best power",
      data: [
        804, 627, 482, 450, 427, 402, 400, 391, 379, 373, 372, 372, 370, 371,
        369, 366, 368, 366, 357, 349, 329, 320,
      ],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function Linechart() {
  return <Line options={options} data={data}  />;
}
