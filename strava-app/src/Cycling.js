import React from 'react'
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/Doughnut";
import RidechartRegression from './components/RideChartRegression';
export default function Cycling({userRecords, alpedataset}) {

  return (
    <div className='min-h-screen'>
         <div className="w-full py-18 px-12">
        <LineChart power={userRecords} />
        </div>
        <div className="w-6/12 py-18 px-12">
        <DoughnutChart hr={userRecords.bikeHrZones} />
        </div>

       

        
     
        <RidechartRegression  regdata={alpedataset}/>

        

    </div>
  )
}
