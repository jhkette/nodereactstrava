import React from "react";
import RunChart from "./runChart";
import DoughnutChart from "./doughnut";
export default function Running({ userRecords }) {
  return (
    <div>
       <div className="w-11/12 py-18 px-12">
      <RunChart data={userRecords} />
      </div>
      <div className="w-6/12 py-18 px-12">
      <DoughnutChart hr={userRecords.runHrZones} />
      </div>
    </div>
  );
}
