const { durations, distances } = require("./values");

function checkPbs(dataSet, cyclingAllTime, runAllTime) {
  const cyclingiImprovements = {};
  const runImprovements = {};
  for (activity of dataSet) {
    if (activity["type"] == "Ride" || activity["type"] == "VirtualRide") {
      for (duration of durations) {
        if (activity[pbs][duration] > cyclingAllTime[duration]) {
          cyclingiImprovements[duration] = activity[pbs][duration];
        }
      }
    }
    if (activity["type"] == "Run") {
      for (distance of distances) {
        if (activity[pbs][distance] < runAllTime[distance]) {
          runImprovements[duration] = activity[pbs][duration];
        }
      }
    }
  }
  return {cyclingiImprovements, runImprovements}
}

module.exports = checkPbs;
