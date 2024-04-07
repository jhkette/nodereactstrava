import React from "react";
import LineChart from "./components/LineChart";
import DoughnutChart from "./components/Doughnut";
import RidechartRegression from "./components/RideChartRegression";
import Ftp from "./components/Ftp"



export default function Cycling({ userRecords, alpedataset,  boxdataset, ftp, weight }) {


  return (
    <section className="min-h-screen w-full py-4 px-24">
       
        <h1 className="text-2xl font-bold py-8 ">Power Chart</h1>
        <LineChart power={userRecords} />
        <p className="py-8 px-6">This is a power chart showing your power records for various time periods. Ideally, you wouldd
        want a high peak over the very short periods. For the longer periods it should only very gradually level out. 
        Your FTP is marked with a dotted line - this is the theoretical power you can hold for an hour - based on an extrapolation
        from other time periods. </p>
     
      <section className="w-full px-6">
      <h2 className="text-2xl font-bold pb-8">Predicting your climbing</h2>
      <p className="pb-8">Climbing is an important part of cycling. Here, I have used two datasets from the popular online training 
      platform zwift. While it is online, the game physics reflect climbing in real life - the climbing speed is defined by watts produced on the 
      bike trainer and the weight of individual. Each climb is a virtual replica of the real thing, (alpe d'huez and box hill). The sample data is from the platform
      and  reflects a good range of amateur ability. I've used a regression analysis to predict your time based on the numbers on your power curve.
      The two climbs aim to give you an insight into your ability on longer and shorter climbs </p>
      <RidechartRegression regdata={alpedataset} userRecords={userRecords}  weight={weight} ftp={ftp}   />
      <div className="flex flex-wrap w-full py-18  justify-between">
      <div className=" w-4/12 my-8 h-72 bg-[url('./images/alpe.jpg')]  bg-no-repeat bg-cover bg-center border-8 border-slate-300">
      
      </div>
      <div className="w-7/12 py-8">
      <h3>Alpe du Zwift</h3>
        Alpe du zwift is an exact replica of Alpe d'huez and should reflect your ability to climb for longer periods at around your threshold. 
        </div>
        </div>
      </section>

      <section className="w-full px-6">
      <RidechartRegression regdata={boxdataset} userRecords={userRecords} weight={weight} ftp={ftp} />
      <div className="flex flex-wrap w-full py-8  justify-between">
      <div className="w-7/12">
        <h3>Box Hill</h3>
       <p> Box Hill is a shorter effort and should reflect your ability to climb at around your vo2 max. </p>
     

      </div>
      <div className=" w-4/12 h-72 bg-[url('./images/boxhill.jpg')]  bg-no-repeat bg-cover bg-center border-8 border-slate-300">
      
      </div>
     
      </div>
      </section>
       
      <section className="flex flex-wrap w-full  px-12 justify-between" >
      <div className="w-5/12">
      <h2 className="text-2xl font-bold pb-8">Training - Heart Rate</h2>
      <DoughnutChart hr={userRecords.bikeHrZones} />
      </div>
      <div className="w-6/12  py-6">
      <h3 className="pb-4">Heart rate zones</h3>
              <p>
                These are your heart rate zone -derived from your max heart-rate - calculated by the app.
                Zone 2 heart rate should corrospond to easy runs, zone 3 tempo. zone 4 threshold and finally, zone5 your vo2 max zone.
              </p>

      </div>
      </section>
      <section className="flex flex-wrap w-full py-12 px-12 justify-between">
      <div className="w-6/12 ">
      <h2 className="text-2xl font-bold pb-8">Training - Power</h2>
      <h3 className="pb-4">Power zones</h3>
              <p>
                These are your power zones zone -derived from your FTP - calculated by the app.
                Each zone corrosponds to a different level of intensity.
              </p>

      </div>
      <div className="w-6/12  ">
      <Ftp ftp={ftp} />
</div>
      
      
     
      </section>
     
    </section>
  );
}
