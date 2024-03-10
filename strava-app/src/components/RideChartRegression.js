import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression from "regression";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function RidechartRegression({ regdata }) {
  // https://www.youtube.com/watch?v=1b1wC1ksJoI
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  let regData, finalScatter, expRegression, prediction, sorted;

  if (regdata.length) {
    regData = regdata[0]["dataset"].map(({ x, y }) => {
      return [parseFloat(x), parseInt(y)]; // we need a list of [[x1, y1], [x2, y2], ...]
    });

    finalScatter = regData.map((item) => {
      return { x: item[0], y: item[1] };
    });

    expRegression = regression.exponential(regData);
    
    prediction = expRegression.predict([5])[1];

    sorted = expRegression.points.sort(function (a, b) {
      return a[0] - b[0];
    });
    console.log(sorted);
  }

  useEffect(() => {
    if (!regdata) {
      return;
    }
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if(chartRef.current !== null){
    const myChartRef = chartRef.current.getContext("2d");

    // create  a new chart
    chartInstance.current = new Chart(myChartRef, {
      type: "scatter",
      data: {
        labels: sorted.map((data) => data[0]),
        datasets: [
          {
            type: "line",
            label: "Linear regression",
            data: sorted.map((data) => data[1]),
            borderColor: "#00897b",
            backgroundColor: "#00897b88",

            showLine: true,
         
          },
          {
            type: "scatter",
            label: `5k  dataset`,
            data: finalScatter,
            fill: false,
            borderColor: "rgb(54, 162, 235)",

            showLine: false,
          },
        ],
      },
      options: {
        elements: {
          point: {
            radius: 3,
          },
        },
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true, // <-- this option disables tooltips
          },
          // annotation: {
          //   annotations: {
          //     point1: {
          //       type: "point",
          //       xValue: userRecords.runningpbs["5000"],
          //       yValue: prediction,
          //       backgroundColor: "rgba(255, 99, 132, 0.25)",
          //     },
          //   },
          // },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Watts per kg of bodyweight",
              font: {
                weight: "bold",
                size: 18,
              },
            },
            suggestedMin: 1,
            // type: "linear",
            beginAtZero: false,
            ticks: {
              color: "#1a1a1a",
              font: {
                fontSize: "8pts",
              },
              // callback: (val) => {
              //   if (val < 60) {
              //     return `${val} seconds`;
              //   }
              //   const remainder = val % 60;
              //   const minutes = (val - remainder) / 60;
              //   return `${minutes}:00`;
              // },
            },
          },
          y: {
            title: {
              display: true,
              text: `Alpe time`,
              font: {
                weight: "bold",
                size: 22,
              },
            },
            
          
            ticks: {
              stepSize: 10,
              color: "#1a1a1a",
              font: {
                fontSize: "8pts",
              },
              ticks: {
                beginAtZero: true,
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
                if(hours == 0){
                  return hoursRemainder
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
  }
  }, [finalScatter, regdata, sorted]);

  // const getTime = (val) => {
  //   const remainder = val % 60;
  //   const minutes = (val - remainder) / 60;
  //   if (val < 60) {
  //     return `${minutes}mins`;
  //   }
  //   let hoursRemainder = minutes % 60;

  //   const hours = (minutes - hoursRemainder) / 60;
  //   if (hoursRemainder < 10) {
  //     hoursRemainder = `0${hoursRemainder}`;
  //   }
  //   return `${hours}:${hoursRemainder}`;
  // };
  return regdata.length ? (
    <div className="w-8/12  m-auto">
      <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} />
      <p>{prediction}</p>
    </div>
  ) : (
    <p>
      {" "}
      <FontAwesomeIcon icon={faSpinner} spinPulse />
    </p>
  );
}
