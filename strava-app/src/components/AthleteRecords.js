import React from "react";

const AthleteRecords = ({ totals }) => {
  return (
    <div>
      <p className="py-4">
        Ride all time total: {totals.all_ride_totals.distance / 1000}km
      </p>
      <p>Run all time total {totals.all_run_totals.distance / 1000}km</p>

      <p>
        Ride recent totals: {Math.round(totals.recent_ride_totals.distance / 1000)}km
      </p>
      <p>
        Run recent totals: {Math.round(totals.recent_run_totals.distance / 1000)}km
      </p>
    </div>
  );
};

export default AthleteRecords;
