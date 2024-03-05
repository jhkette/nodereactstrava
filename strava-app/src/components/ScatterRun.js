import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Scatter, Line } from "react-chartjs-2";
import regression from "regression";
// https://stackoverflow.com/questions/60622195/how-to-draw-a-linear-regression-line-in-chart-js

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend,   annotationPlugin);

export default function ScatterPlot(props) {
    if(!props.userRecords.runningpbs){
        return <p>ndsakd</p>
    }


//    if(!props.userRecords){
//     return ""
//    } 
  const finaldata = [
    { x: 759, y: 4260 },
    { x: 985, y: 4320 },
    { x: 994, y: 5220 },
    { x: 1007, y: 4380 },
    { x: 1063, y: 5280 },
    { x: 1090, y: 4920 },
    { x: 1101, y: 5160 },
    { x: 1198, y: 5400 },
    {x: 1352 , y:  6480}, 
    {x: 1285 , y: 6304},
    {x: 1521, y:7550 }, 
  ];

  const regData = finaldata.map(({ x, y }) => {
    return [x, y]; // we need a list of [[x1, y1], [x2, y2], ...]
  });

  const my_regression = regression.linear(regData);
  const prediction = my_regression.predict(props.userRecords.runningpbs["5000"])[1]

  console.log(my_regression, "THIS IS THE REGESSION");

  const options = {
    //   showLine: false,
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        beginAtZero: false,
      },
    },
  };

  const data = {
    datasets: [
      {
        type: "scatter",
        label: "A dataset",
        data: finaldata,
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const lineData = {
    labels: my_regression.points.map((data) => data[0]),
    datasets: [
      {
        label: "run regression",
        data: my_regression.points.map((data) => data[1]),
        borderColor: "#00897b",
        backgroundColor: "#26a69a",
      },
    ],
  };

  const options2 = {
    elements: {
        point:{
            radius: 0
        }
    },
    plugins: {
    tooltip: {
            enabled: false, // Disable tooltips
          },
    annotation: {
      annotations: {
        point1: {
          type: "point",
          xValue: props.userRecords.runningpbs['5000'],
          yValue: prediction,
          backgroundColor: "rgba(255, 99, 132, 0.25)",
        },
      },
    },
},

    scales: {
      x: {
        type: "linear",
        beginAtZero: false,
        ticks: {
          stepSize: 120,
          color: "#1a1a1a",
          font: {
            fontSize: '8pts',
          },
          callback: (val) => {
            if (val < 60) {
              return `${val} seconds`;
            }
            const remainder = val % 60;
            const minutes = (val - remainder) / 60;
            return `${minutes}mins`;
          },
        },

       
        },
      },
    }
  
 
  console.log(props, "THIS IS USER RECORDS IN SCATTER PLOT");
  console.log(my_regression.predict(props.userRecords.runningpbs["5000"]));

  return (
    <div className="px-8 ">
      {/* <p>{props.userRecords.runningpbs['5000']}</p> */}

      <div className="flex m-auto">
        <div className="w-5/12">
          <Scatter options={options} data={data} />;
        </div>
        <div className="w-5/12">
          <Line options={options2} data={lineData} />
        </div>
      </div>
      <p>{props.userRecords.runningpbs["5000"]}</p>
      <p>{my_regression.string}</p>
      <p>{my_regression.predict(props.userRecords.runningpbs["5000"])[1]}</p>
    </div>
  );
}
