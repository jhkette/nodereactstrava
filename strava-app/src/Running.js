import React from "react";
import RunChart from "./components/RunChart";
import DoughnutChart from "./components/Doughnut";
import ScatterPlot from "./components/ScatterRun";
import RunchartRegression from "./components/RunChartRegression";

export default function Running({ userRecords, mardataset, halfdataset, alpedataset }) {

  console.log(mardataset, halfdataset, "THESE ARE THE SETS")
 
  return (
    <div className="min-h-screen">
       <div className="w-full py-18 px-12">
      <RunChart data={userRecords} />
      </div>
      <div className="w-6/12 py-18 px-12">
      <DoughnutChart hr={userRecords.runHrZones} />

       </div>
     {/* <ScatterPlot userRecords={userRecords}/> */}
     {userRecords.runningpbs ?
     <>
      <RunchartRegression userRecords={userRecords} event={"Half Marathon"}  regdata={halfdataset}/> 
      <RunchartRegression userRecords={userRecords} event={"Marathon"}  regdata={mardataset}/> 
     
      
      </>: ""
     }
    </div>
  );
}
