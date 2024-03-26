import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import regression from "regression";
import { intervalToDuration } from "date-fns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { sortedIndex, quickSort } from "../helpers/helpers";

export default function RidechartRegression({
  regdata,
  userRecords: { cyclingpbs },
  weight,
  ftp,
}) {
  let predWkg;
  if (cyclingpbs && weight && regdata[0] !== undefined) {
    console.log(cyclingpbs);
    if (regdata[0]["name"] === "Alpe du zwift") {
      if (cyclingpbs["1800"] / weight >= 6.5) {
        predWkg = cyclingpbs["1800"];
      } else if (cyclingpbs["2700"] / weight >= 5) {
        predWkg = cyclingpbs["2700"];
      } else if (ftp / weight >= 3) {
        predWkg = ftp / weight;
      } else {
        predWkg = (ftp / weight) * 0.9;
      }
    }

    if (regdata[0]["name"] === "Box Hill") {
      console.log(cyclingpbs["1800"]);
      if (cyclingpbs["180"] / weight >= 7) {
        predWkg = cyclingpbs["180"] / weight;
      } else if (cyclingpbs["300"] / weight >= 6) {
        predWkg = cyclingpbs["300"] / weight;
      } else if (cyclingpbs["390"] / weight >= 5) {
        predWkg = cyclingpbs["390"] / weight;
      } else if (cyclingpbs["480"] / weight >= 4) {
        predWkg = cyclingpbs["480"] / weight;
      } else {
        predWkg = cyclingpbs["600"] / weight;
      }
    }
  }

  // console.log(regdata[0]["name"], predWkg, weight, ftp, predWkg2);

  // https://www.youtube.com/watch?v=1b1wC1ksJoI
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // initialising variable so they are avialble outside if statement
  let regData,
    finalScatter,
    expRegression,
    prediction,
    formattedPred,
    sorted,
    indexPred;

  if (regdata.length) {
    regData = regdata[0]["dataset"].map(({ x, y }) => {
      return [parseFloat(x), parseInt(y)]; //  need a list of [[x1, y1], [x2, y2], ...]
    });

    finalScatter = regData.map((item) => {
      return { x: item[0], y: item[1] };
    });

    expRegression = regression.logarithmic(regData);

    prediction = Math.round(expRegression.predict([predWkg])[1]);

    sorted = expRegression.points.sort(function (a, b) {
      return a[0] - b[0];
    });

    const hilltimes = quickSort(finalScatter.map((item) => item.y));
  
    indexPred = Math.round(
      (sortedIndex(hilltimes, prediction) / hilltimes.length) * 100
    );

    function humanDuration(time) {
      return intervalToDuration({ start: 0, end: time * 1000 });
    }

    formattedPred = humanDuration(prediction);
  }

  useEffect(() => {
    if (!regdata) {
      return;
    }
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (chartRef.current !== null) {
      const myChartRef = chartRef.current.getContext("2d");

      // create  a new chart
      chartInstance.current = new Chart(myChartRef, {
        type: "scatter",
        data: {
          labels: sorted.map((data) => data[0]),
          datasets: [
            {
              type: "line",
              label: "Logarithmic regression",
              data: sorted.map((data) => data[1]),
              borderColor: "#00897b",
              backgroundColor: "#00897b88",

              showLine: true,
            },
            {
              type: "scatter",
              label: `${regdata[0]["name"]} dataset`,
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
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            tooltip: {
              enabled: false, // <-- this option disables tooltips
            },
            annotation: {
              annotations: {
                point1: {
                  type: "point",
                  xValue: predWkg,
                  yValue: prediction,
                  borderColor: "#000",
                  backgroundColor: "#00000088",
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Watts/kg of bodyweight",
                font: {
                  weight: "bold",
                  family: "lato",
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
                  family: "lato"
                },
      
              },
            },
            y: {
              title: {
                display: true,
                text: `${regdata[0]["name"]} time (hh:mm)`,
                font: {
                  weight: "bold",
          family: "lato",
                  size: 18,
                },
              },

              grace: "15%",
              ticks: {
                stepSize: 10,
                color: "#1a1a1a",
                font: {
                  fontSize: "8pts",
                  family: "lato"
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
                  if ((hours > 0) &&(hoursRemainder < 10)) {
                    hoursRemainder = `0${hoursRemainder}`;
                  }
                  if ((hours === 0) &&(hoursRemainder < 10)) {
                    
                    return `0:0${hoursRemainder}`;
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
  }, [finalScatter, regdata, sorted, prediction, predWkg]);

  return regdata.length ? (
    <div className="w-10/12 bg-white p-4">
      <canvas ref={chartRef} className="w-full" />
      {/* some conditional formatting to check time is readable */}
      <h3 className="border-b-2 mb-2 border-green-800 inline-block">
        {" "} Your predicted time is: 
        {formattedPred["hours"] ? formattedPred["hours"] : ""}{" "}
        {formattedPred["minutes"]}:
        {formattedPred["seconds"] < 10
          ? "0" + formattedPred["seconds"]
          : formattedPred["seconds"]}
      </h3>
      <p>
        This predicted time would put you in the top {indexPred}% of the sampled
        riders
      </p>
    </div>
  ) : (
    <p>
      {" "}
      <FontAwesomeIcon icon={faSpinner} spinPulse />
    </p>
  );
}
