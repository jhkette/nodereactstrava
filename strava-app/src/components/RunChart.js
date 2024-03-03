import React from "react";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";
// import { enUS } from 'date-fns/locale';
import "chartjs-adapter-moment";
import { intervalToDuration } from "date-fns";

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

export default function Linechart(props) {
  if (!props.data.runningpbs) {
    return (
      <div>
        <p>Please import cycling power files</p>
      </div>
    );
  }
 
  const finaldata = [];

  if (props.data.runningpbs) {
    const timeObj = props.data.runningpbs;

    for (let key in timeObj) {
      const mins = timeObj[key];
      const distance = key / 1000;

      const speed = distance / mins;

      const perkm = 1 / speed;
      finaldata.push(perkm);
      
    }
  }
  const labels = Object.keys(props.data.runningpbs);

  const floatingLabels = {
    id: "floatingLabels",
    afterDatasetDraw(chart, args, options) {
      const {
        ctx,
        scales: { x, y },
      } = chart;
      // var xAxis = chart.scales.x;
      // var yAxis = chart.scales.y;
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 26,104,1)";
      ctx.font = "bolder 12px Arial";
      var finalx = x.getPixelForValue("300");
      var finaly = y.getPixelForValue("310");
      ctx.fillText("Critical power estimate", finalx, finaly);
    },
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Running pace chart",
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
      tooltip: {
        callbacks: {
          label: (tooltipItem, data) => {
            const duration = intervalToDuration({
              start: 0,
              end: tooltipItem.formattedValue * 1000,
            });

            let perKmPaceSeconds = duration["seconds"];
            if (duration["seconds"] < 10) {
              // add 0 to the string if duration of seconds is less that 10 ie 09 seconds
              perKmPaceSeconds= `0${duration["seconds"]}`;
            }
            return `${duration["minutes"]}:${perKmPaceSeconds} per/km`;
            // return tooltipItem.formattedValue + " seconds";
          },
          title: (tooltipItems, data) => {
            const tooltipItem = tooltipItems[0];
            if (tooltipItem.label === "2,414") {
              return "1.5 miles";
            }
            return `${tooltipItem.label} metres`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          color: "#1a1a1a",
          font: {
            weight: "bold",
          },
        },
        title: {
          display: true,
          text: "Distance",
          font: {
            weight: "bold",
            size: 22,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Pace",
          font: {
            weight: "bold",
            size: 22,
          },
        },
        ticks: {
          stepSize: 60,
          callback: (val) => {
            if (val < 60) {
              return val;
            }
            const remainder = val % 60;
            const minutes = (val - remainder) / 60;
            return `${minutes} min`;
          },
        },

        beginAtZero: true,
      },
    },
  };

  //   https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/types/line.html
  const data = {
    labels,
    datasets: [
      {
        label: "Best pace",
        data: finaldata,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Line options={options} plugins={[floatingLabels]} data={data} />;
}
