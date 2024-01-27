const { sleep } = require("./sleep");
const { findAverage, largest } = require("./arraysorting");
const { runDistance, getShortestSubarray } = require("./runSorting");
const {durations, distances} = require("./values")
const axios = require("axios");

async function activityLoop(data_set, token) {
  for (element of data_set) {
    // element["test"] ="this is just a test"
    if (element["type"] == "Ride" || element["type"] == "VirtualRide") {

        let watts = await axios.get(
          // https://communityhub.strava.com/t5/developer-discussions/strava-api-keys-and-streams/m-p/5393
          `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=watts,heartrate&key_by_type=true&resolution=high`,
          { headers: { Authorization: `${token}` } }
        );
        if (watts.status == 429) {
          await sleep();
          watts = await axios.get(
            // https://communityhub.strava.com/t5/developer-discussions/strava-api-keys-and-streams/m-p/5393
            `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=watts,heartrate&key_by_type=true&resolution=high`,
            { headers: { Authorization: `${token}` } }
          );
        }

        if (watts["data"]["watts"] || watts["data"]["heartrate"]) {
          element["watt_stream"] = watts.data;
          const pbs = {};
          if (element["watt_stream"]["watts"]) {
            for (duration of durations) {
              const averages = findAverage(
                duration,
                element["watt_stream"]["watts"]["data"]
              );
              if (averages) {
                const sorted = largest(averages);
                pbs[duration] = Math.round(sorted);
              }
            }
          }
         
          element["pbs"] = pbs;
        }
        // enf of if block
     
    }
    if (element["type"] == "Run") {
      let run = await axios.get(
        `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=high`,
        { headers: { Authorization: `${token}` } }
      );
      if (run.status == 429) {
        await sleep();
        run = await axios.get(
          `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=high`,
          { headers: { Authorization: `${token}` } }
        );
      }
      element["run_stream"] = run.data;

     
      const runpbs = {};
      const runInMetres = runDistance(
        element["run_stream"]["distance"]["data"]
      );

      for (distance of distances) {
        const quickest = getShortestSubarray(runInMetres, distance);
        runpbs[distance] = quickest;
      }

      element["runpbs"] = runpbs;
    }
  }
  return data_set;
}

module.exports = activityLoop;
