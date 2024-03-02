import React from 'react'
import Linechart from "./linechart";
import DoughnutChart from "./doughnut";
export default function Cycling({userRecords}) {
  return (
    <div>
         <div className="w-11/12 py-18 px-12">
        <Linechart power={userRecords} />
        </div>
        <div className="w-6/12 py-18 px-12">
        <DoughnutChart hr={userRecords.bikeHrZones} />
        </div>

    </div>
  )
}
