// libraries
const axios = require("axios");
const _ = require("lodash");
// helper functions
const { findAverage } = require("./arraysorting");
const { runDistance, getShortestSubarray } = require("./runSorting");
const { durations, distances } = require("./values");


/**
 * This funtion takes activities in an array and then call the
 * strava api for extra infomration on those activities if neccesarray. 
 * @param data_set[], @param token String
 *  * @returns data_set
*/
async function activityLoop(data_set, token) {
  for (element of data_set) {
    if (element["type"] == "Ride" || element["type"] == "VirtualRide") {
      if (element["device_watts"]) {
        let watts = await axios.get(
          `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=watts,heartrate&key_by_type=true&resolution=high`,
          { headers: { Authorization: token } }
        );
        if (watts["data"]["watts"]) {
          element["watt_stream"] = watts.data;
          const pbs = {};
          if (element["watt_stream"]["watts"]) {
            for (duration of durations) {
              const averages = findAverage(
                duration,
                element["watt_stream"]["watts"]["data"]
              );
              if (averages) {
                const sorted = _.max(averages);
                pbs[duration] = Math.round(sorted);
              }
            }
          }

          element["pbs"] = pbs;
        }
      }
    }
    if (element["type"] == "Run") {
      if (element["has_heartrate"]) {
        let run = await axios.get(
          `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=high`,
          { headers: { Authorization: token } }
        );
       
      element["run_stream"] = run.data;
      const runpbs = {};
      const runInMetres = runDistance(
       
        element["run_stream"]["distance"]["data"]
      );

      console.log(element["run_stream"], "this is run stream")

      console.log(runInMetres)

      for (distance of distances) {
       
        const quickest = getShortestSubarray(runInMetres, distance);
        // console.log(quickest)
        runpbs[distance] = quickest;
      }

      element["runpbs"] = runpbs;
    }
  }
  }
  return data_set;
}

module.exports = activityLoop;
