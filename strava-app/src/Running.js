import React from "react";
import RunChart from "./components/RunChart";
import DoughnutChart from "./components/Doughnut";
import RunchartRegression from "./components/RunChartRegression";

// running page with charts
export default function Running({ userRecords, mardataset, halfdataset }) {
  return (
    <div className="min-h-screen">
      {userRecords.runningpbs && (
        <>
          <div className="w-full py-18 px-12">
            <h1 className="pb-8">Pace chart: minutes per km </h1>
            <RunChart data={userRecords} />
          </div>

          <section className="flex flex-wrap w-full py-18 px-12 justify-between">
            <div className="w-4/12 py-12 pr-8">
              <h2 className="pb-4">Half Marathon prediction</h2>
              <p className="text-lg">
                This is a dataset from a running club, with 5k times on the x
                axis and half marathon on the y axis. The green line is a linear
                regression line mapped onto this data. The circle is your 5k
                time mapped onto the regression line, which gives the prediction
                of your half marathon time{" "}
              </p>
            </div>
            <div className="w-8/12 py-12">
              <RunchartRegression
                userRecords={userRecords}
                event={"Half Marathon"}
                regdata={halfdataset}
              />
            </div>
          </section>
          <section className="flex flex-wrap w-full py-18 px-12 justify-between">
            <div className="w-8/12 py-12">
              <RunchartRegression
                userRecords={userRecords}
                event={"Marathon"}
                regdata={mardataset}
              />
            </div>
            <div className="w-4/12 py-12 pl-8">
              <h2 className="pb-4">Marathon prediction</h2>
              <p className="text-lg">
                This is another dataset from a running club, with 5k times on
                the x axis and marathon on the y axis. The green line is another
                linear regression line mapped onto this data. The circle is the
                intersection of your 5k time and the marathon time predicted by
                the linear regression.
              </p>
            </div>
          </section>
          <section className="flex flex-wrap w-full py-18 px-12 justify-between">
            <div className="w-6/12 py-18 px-12">
              <DoughnutChart hr={userRecords.runHrZones} />
            </div>
            <div className="w-6/12 py-12 pl-8">
              <h2 className="pb-4">Heart rate zones</h2>
              <p className="text-lg">
                These are your heart rate zone -derived from your max heart-rate - calculated by the app.
                Zone 2 heart rate should corrospond to easy runs, zone 3 tempo. zone 4 threshold and finally, zone5 your vo2 max zone.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
