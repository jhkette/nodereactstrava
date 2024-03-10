import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression from "regression";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

export default function RunchartRegression({ userRecords, event, regdata }) {
  // https://www.youtube.com/watch?v=1b1wC1ksJoI
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  


  

  const regData = regdata[0].dataset.map(({ x, y }) => {
    return [parseInt(x), parseInt(y)]; // we need a list of [[x1, y1], [x2, y2], ...]
  });
  let my_regression;
  let prediction;
  if (userRecords.runningpbs["5000"]) {
    my_regression = regression.linear(regData);
   
    prediction = my_regression.predict(userRecords.runningpbs["5000"])[1];
  }

  useEffect(() => {
    if (!userRecords.runningpbs["5000"] || !regdata) {
      return;
    }
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
   
    const myChartRef = chartRef.current.getContext("2d");
   // create  a new chart
    chartInstance.current = new Chart(myChartRef, {
      type: "line",
      data: {
        labels: regData.map((item) => item[0]),
        datasets: [
          {
            type: "line",
            label: `5k-${event} dataset`,
            data: regData.map((item) => item[1]),
            fill: false,
            borderColor: "rgb(54, 162, 235)",
            showLine: false,
          },
          {
            type: "line",
            label: "Linear regression",
            data: my_regression.points.map((data) => data[1]),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            showLine: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: false // <-- this option disables tooltips
              },
          annotation: {
            annotations: {
              point1: {
                type: "point",
                xValue: userRecords.runningpbs["5000"],
                yValue: prediction,
                backgroundColor: "rgba(255, 99, 132, 0.25)",
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "5k time",
              font: {
                weight: "bold",
                size: 22,
              },
            },
            type: "linear",
            beginAtZero: false,
            ticks: {
              stepSize: 120,
              color: "#1a1a1a",
              font: {
                fontSize: "8pts",
              },
              callback: (val) => {
                if (val < 60) {
                  return `${val} seconds`;
                }
                const remainder = val % 60;
                const minutes = (val - remainder) / 60;
                return `${minutes}:00`;
              },
            },
          },
          y: {
            title: {
              display: true,
              text: `${event} time`,
              font: {
                weight: "bold",
                size: 22,
              },
            },
            ticks: {
              stepSize: 120,
              color: "#1a1a1a",
              font: {
                fontSize: "8pts",
              },
              callback: (val) => {
                if (val < 60) {
                  return `${val} seconds`;
                }
                const remainder = val % 60;
                const minutes = (val - remainder) / 60;
                if (val < 60) {
                  return `${minutes}mins`;
                }
                let hoursRemainder = minutes % 60;

                const hours = (minutes - hoursRemainder) / 60;
                if (hoursRemainder < 10) {
                  hoursRemainder = `0${hoursRemainder}`;
                }
                return `${hours}:${hoursRemainder}`;
              },
            },
          },
        },
      },
    
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  
  }, [userRecords, prediction, regData, my_regression.points, event, regdata]);

  const getTime = (val) => {
    const remainder = val % 60;
    const minutes = (val - remainder) / 60;
    if (val < 60) {
      return `${minutes}mins`;
    }
    let hoursRemainder = minutes % 60;

    const hours = (minutes - hoursRemainder) / 60;
    if (hoursRemainder < 10) {
      hoursRemainder = `0${hoursRemainder}`;
    }
    return `${hours}:${hoursRemainder}`;
  };
  return userRecords.runningpbs  ? (
    <div className="w-8/12  m-auto">
      <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} />

      <p>{userRecords.runningpbs["5000"]}</p>
   
      <p>{event} prediction: {getTime(my_regression.predict(userRecords.runningpbs["5000"])[1])}</p>
    </div>
  ) : (
    <p>       <FontAwesomeIcon icon={faSpinner} spinPulse /></p>
  );
}
