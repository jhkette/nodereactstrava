import React from 'react'
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/Doughnut";
export default function Cycling({userRecords}) {
  return (
    <div>
         <div className="w-full py-18 px-12">
        <LineChart power={userRecords} />
        </div>
        <div className="w-6/12 py-18 px-12">
        <DoughnutChart hr={userRecords.bikeHrZones} />
        </div>

    </div>
  )
}
