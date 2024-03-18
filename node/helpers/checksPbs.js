const { durations, distances } = require("./values");

/**
 * function checkpb
 * check to see if pb have improved
 * @param dataSet []
 * @param cyclingAllTime {}
 * @param runAllTime {}
 * @returns [] an array of alltime pbs with boolean flags to see if they have changed
 */
function checkPbs(dataSet, cyclingAllTime, runAllTime) {
  let updateFlagCycling = false;
  let updateFlagRunning = false;
  let ftpChange = false;
  let criticalChange = false;

  for (activity of dataSet) {
    console.log(activity["type"])
    if (
      (activity["type"] == "Ride" || activity["type"] == "VirtualRide") &&
      activity["pbs"]
    ) {
      for (duration of durations) {
        if (activity["pbs"][duration] > cyclingAllTime[duration]) {
          if (duration === "720" || "1200") {
            ftpChange = true;
          }
          updateFlagCycling = true;
          cyclingAllTime[duration] = activity["pbs"][duration];
        }
      }
    }
    if (activity["type"] == "Run" && activity["runpbs"]) {
      for (distance of distances) {
        if (activity["runpbs"][distance] < runAllTime[distance]) {
          console.log(runAllTime[distance], updateFlagRunning, "THIS IS PBS" )
         
          updateFlagRunning = true;
          runAllTime[distance] = activity["runpbs"][distance];

          console.log(runAllTime[distance], updateFlagRunning, "THIS IS PBS" )
        }
        if ((activity["runpbs"][distance] != false) && (runAllTime[distance] == false)) {
          updateFlagRunning = true;
          runAllTime[duration] = activity["runpbs"][distance];
         
          console.log(runAllTime[duration], updateFlagRunning, "THIS IS PBS" )
        }
      }
    }
  }

  return [
    cyclingAllTime,
    runAllTime,
    updateFlagCycling,
    updateFlagRunning,
    ftpChange,
  ];
}

module.exports = checkPbs;
