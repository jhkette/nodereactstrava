const { durations, distances } = require("./values");

// might be better to just change the original object
function checkPbs(dataSet, cyclingAllTime, runAllTime) {
  const cyclingImprovements = {};
  const runImprovements = {};
  for (activity of dataSet) {

    if ((activity["type"] == "Ride" || activity["type"] == "VirtualRide") && activity["pbs"]) {
     
      for (duration of durations) {
        if (activity["pbs"][duration] > cyclingAllTime[duration]) {
          console.log(activity["pbs"][duration] > cyclingAllTime[duration], "This is the comparison", activity["pbs"][duration],  cyclingAllTime[duration] )
          cyclingImprovements[duration] = activity["pbs"][duration];
        }
      }
    }
    if (activity["type"] == "Run" && activity["runningpbs"]) {
      for (distance of distances) {
        if (activity["runningpbs"][distance] < runAllTime[distance]) {
          runImprovements[duration] = activity["runningpbs"][distance];
        }
      }
    }
  }
  return [cyclingImprovements, runImprovements]
}

module.exports = checkPbs;
