import React from "react";
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/Doughnut";
import RidechartRegression from "./components/RideChartRegression";
import Ftp from "./components/Ftp"

export default function Cycling({ userRecords, alpedataset,  boxdataset, ftp }) {
 
 console.log(ftp, "THIS IS FTP")
  return (
    <section className="min-h-screen w-full py-18 px-12">
      
        <h2 className="text-2xl font-bold py-14">Power Chart</h2>
        <LineChart power={userRecords} />
        <p className="italic py-4 px-12 text-lg">This is a power chart showing your power records for various time periods. Ideally, you wouldd
        want a high peak over the very short periods. For the longer periods it should only very gradually level out. 
        Your FTP is marked with a dotted line - this is the theoretical power you can hold for an hour - based on an extrapolation
        from other time periods  </p>
     
      <h2 className="text-2xl font-bold py-8">Predicting your climbing</h2>
      <div className="flex">
      
      <RidechartRegression regdata={alpedataset} userRecords={userRecords} />
      
      <div className="italic w-5/12 py-18 py-12 text-lg">
        This is a dataset from Zwift an online cycling platform. While it is online, the game physics reflect real life and climbing ability
        on the Zwift platform would reflect real life climbing ability. Similarly, it is a good dataset to use to predict climbing ability
        as there is a relatively large sample size with a large range of abilities. It also has accurate data provided by the platform. 
        Your time and position in this dataset should give you a good idea of your ability.


      </div>
      </div>

      <div className="flex">
      
      <RidechartRegression regdata={boxdataset} userRecords={userRecords}  />
      
      <div className="italic w-5/12 py-18 py-8 pl-8 text-lg">
        This is a dataset from Zwift an online cycling platform. While it is online, the game physics reflect real life and climbing ability
        on the Zwift platform would reflect real life climbing ability. Similarly, it is a good dataset to use to predict climbing ability
        as there is a relatively large sample size with a large range of abilities. It also has accurate data provided by the platform. 
        Your time and position in this dataset should give you a good idea of your ability.


      </div>
      </div>
       
      
      <div className="w-5/12 py-12">
      <h2 className="text-2xl font-bold pb-8">Training - heart rate</h2>
      <DoughnutChart hr={userRecords.bikeHrZones} />
      </div>

      <div className="w-6/12  py-12">
      <h2 className="text-2xl font-bold pb-8">Training - heart rate</h2>
      <Ftp ftp={ftp} />
      </div>
    </section>
  );
}
