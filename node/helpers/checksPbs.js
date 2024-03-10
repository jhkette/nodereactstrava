const { durations, distances } = require("./values");

// might be better to just change the original object
function checkPbs(dataSet, cyclingAllTime, runAllTime) {
  const cyclingImprovements = {};
  const runImprovements = {};
  console.log(dataSet[0], cyclingAllTime["12"], runAllTime["1000"], "THIS IS A SAMPLE OF SOME OF THE DATA")
  for (activity of dataSet) {

    if ((activity["type"] == "Ride" || activity["type"] == "VirtualRide") && activity["pbs"]) {
     
      for (duration of durations) {
        console.log("COMPARISON 1 !!IMPORTANT"(activity["pbs"][duration] > cyclingAllTime[duration]), "This is the comparison", activity["pbs"][duration],  cyclingAllTime[duration] )
        if (activity["pbs"][duration] > cyclingAllTime[duration]) {
          
          console.log("COMPARISON 2 !!IMPORTANT"(activity["pbs"][duration] > cyclingAllTime[duration]), "This is the comparison", activity["pbs"][duration],  cyclingAllTime[duration] )
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
  console.log([cyclingImprovements, runImprovements], "THIS IS THE RETRUNED ARRAY")
  return [cyclingImprovements, runImprovements]
}

module.exports = checkPbs;
