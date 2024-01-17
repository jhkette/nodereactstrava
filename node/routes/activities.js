const express = require("express");
const axios = require("axios");
const UserActivities = require("../models/UserActivities");
const {
  quickSort,
  findAverage,
  returnLargest,
} = require("../helpers/arraysorting");

const getAthlete = async (req, res) => {
  const errors = {};
  const token = req.headers.authorization;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }
  try {
    const response = await axios.get(`https://www.strava.com/api/v3/athlete`, {
      headers: { Authorization: token },
    });

    const foundUserActs = await UserActivities.findOne({
      athlete_id: response.data.id,
    });

    if (foundUserActs) {
      return res.json({ profile: response.data, user: foundUserActs });
    }

    const id = parseInt(response.data.id);
    const newUser = new UserActivities({ athlete_id: id });
    const userToSave = await newUser.save();

    return res.json({ profile: response.data, user: userToSave });
  } catch (err) {
    console.log(err);
  }
};

const getAthleteStats = async (req, res) => {
  const errors = {};
  const token = req.headers.authorization;
  const id = req.params.athleteId;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athletes/${id}/stats`,
      {
        headers: { Authorization: token },
      }
    );

    return res.json(response.data);
  } catch (err) {
    console.log(err);
  }
};

const getLatestActivities = async (req, res) => {
  // we need t
  const errors = {};
  const after = parseInt(req.params.after);
  console.log("after", after);

  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.send(errors);
  }
  try {
    const response2 = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        headers: { Authorization: token },
        params: { after: after },
      }
    );
    // console.log(response2.data)
    if (response2.data.length == 0) {
      errors["error"] = "no activities found";
      return res.send(errors);
    }
    //**!!!!!!!!You NEED TO CHECK IF DATE THING RETURNS ANYTHING -CHECK LENGTH OF RESPONSE.DATA!!!!!!*/

    const data_set = [...response2.data];

    const { id } = data_set[0].athlete;
    // equality check for latest actviity on mongo vs latest new activity
    const allActs = await UserActivities.findOne({ athlete_id: id });
    console.log(
      allActs.activities[allActs.activities.length - 1],
      "the last activity"
    );
    if (
      allActs.activities[allActs.activities.length - 1].id ==
      data_set[data_set.length - 1].id
    ) {
      errors["error"] = "this activity has already been added";
      return res.send(errors);
    }

    for (element of data_set) {
      if (element["type"] == "Ride" || element["type"] == "VirtualRide") {
        const watts = await axios.get(
          // https://communityhub.strava.com/t5/developer-discussions/strava-api-keys-and-streams/m-p/5393
          `https://www.strava.com/api/v3/activities/${element.id}/streams/watts?series_type=time&resolution=medium`,
          { headers: { Authorization: `${token}` } }
        );
        if (watts.data.length >= 2) {
          element["watt_stream"] = watts.data;
          // const sorted = quickSort(findAverage(element["watt_stream"][0].data))
          // console.log(sorted)
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

    console.log("data set for latest", data_set);

    await UserActivities.updateOne(
      { athlete_id: id },
      { $push: { activities: { $each: data_set } } }
    );
    return res.send(data_set);
    // return res.json(data_set);
  } catch (err) {
    console.log(err);
  }
};

const importActivities = async (req, res) => {
  const errors = {};
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  const userId = req.headers.id;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }
  // CHECK IF DATA EXISTS !!!!////

  // First I am checking if there is data for activities in mongodb
  const foundUserActs = await UserActivities.findOne({ athlete_id: userId });
  if (foundUserActs) {
    if (foundUserActs.activities.length > 5) {
      return res.send((errors["error"] = "data has already imported"));
    }
  }

  let page_num = 1;
  const data_set = [];
  while (page_num < 3) {
    const response2 = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        headers: { Authorization: token },
        params: { per_page: 20, page: page_num },
      }
    );
    data_set.push(...response2.data);
    page_num++;
  }
  const nums = [15, 30, 60,90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 410, 440, 480, 600, 900, 1200];
  for (element of data_set) {
    // element["test"] ="this is just a test"
    if (element["type"] == "Ride" || element["type"] == "VirtualRide") {
      const watts = await axios.get(
        // https://communityhub.strava.com/t5/developer-discussions/strava-api-keys-and-streams/m-p/5393
        `https://www.strava.com/api/v3/activities/${element.id}/streams/watts?series_type=time&resolution=high`,
        { headers: { Authorization: `${token}` } }
      );
      if (watts.data.length >= 2) {
        element["watt_stream"] = watts.data;
        const pbs = {};
        for (num of nums) {
          const averages = findAverage(num, element["watt_stream"][0].data);
          if (averages) {
            const sorted = quickSort(averages);
            pbs[num] = Math.round(sorted[sorted.length - 1]);
          }
        }
        element["pbs"] = pbs;
      }
    }
    if (element["type"] == "Run") {
      const run = await axios.get(
        `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=high`,
        { headers: { Authorization: `${token}` } }
      );
      element["run_stream"] = run.data;
      const runpbs = {};
      for (num of nums) {
        const averages = findAverage(
          num,
          element["run_stream"]["velocity_smooth"].data
        );
        if (averages) {
          const sorted = quickSort(averages);

          runpbs[num] = 26.8224 / sorted[sorted.length - 1];
        }
      }
      element["runpbs"] = runpbs;
    }
  }

  const allTime = {};

  const filteredActivities = data_set.filter((element) =>
    element.hasOwnProperty("pbs")
  );

  // https://stackoverflow.com/questions/63971208/how-to-filter-array-of-objects-where-object-has-property-tagid-or-keywordid-in-j

  for (num of nums) {
    let max = filteredActivities.reduce(
      (acc, value) =>
        acc > value["pbs"][num.toString()] ? acc : value["pbs"][num.toString()],
      0
    );
    console.log(max);
    allTime[num] = max;
  }
  console.log(allTime, "THIS IS ALL TIME");

  // const { id } = data_set[0].athlete;
  /**  the data needs to be reversed - because otherwise the latest activity is first - 
  activities need to be arranged
   * first to last **/
  data_set.reverse();
  const allUserData = await UserActivities.findOneAndUpdate(
    { athlete_id: userId },
    { $push: { activities: { $each: data_set } } },
    { new: true }
  );
  console.log(userId);
  return res.send(allUserData);
};

const router = express.Router();

router.get("/activities/import", importActivities);
// router.get("/activities/all/:actid", getAllActivities);
router.get("/activities/:after", getLatestActivities);

router.get("/athlete", getAthlete);
router.get("/:athleteId", getAthleteStats);

module.exports = router;
