import React from "react";
import RunChart from "./components/RunChart";
import DoughnutChart from "./components/Doughnut";
export default function Running({ userRecords }) {
  return (
    <div>
       <div className="w-full py-18 px-12">
      <RunChart data={userRecords} />
      </div>
      <div className="w-6/12 py-18 px-12">
      <DoughnutChart hr={userRecords.runHrZones} />
      </div>
    </div>
  );
}
