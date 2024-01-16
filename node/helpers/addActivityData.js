


for (element of data_set) {
    // element["test"] ="this is just a test"
    if (element["type"] == "Ride" || element["type"] == "VirtualRide") {
      const watts = await axios.get(
        // https://communityhub.strava.com/t5/developer-discussions/strava-api-keys-and-streams/m-p/5393
        `https://www.strava.com/api/v3/activities/${element.id}/streams/watts?series_type=time&resolution=medium`,
        { headers: { Authorization: `${token}` } }
      );
      if (watts.data.length >= 2) {
        element["watt_stream"] = watts.data;
        const sorted = quickSort(element["watt_stream"][0].data);
        console.log(sorted);
        // element["watt_stream"].push(sorted)
      }
    }
    if (element["type"] == "Run") {
      const run = await axios.get(
        `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=medium`,
        { headers: { Authorization: `${token}` } }
      );
      element["run_stream"] = run.data;
    }
  }