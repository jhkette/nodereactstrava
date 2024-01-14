const express = require("express");
const axios = require("axios");
const UserActivities = require("../models/UserActivities");
const {quickSort, findAverage} = require("../helpers/arraysorting")

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
    console.log("if statement is running");
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
  const errors = {};
  const after = parseInt(req.params.after);
  console.log("after", after)

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
        params: { "after": after},
      }
    );
    console.log(response2.data)
    if(response2.data.length == 0){
        errors["error"] = "no activities found";
      return res.send(errors)

    }
    //**!!!!!!!!You NEED TO CHECK IF DATE THING RETURNS ANYTHING -CHECK LENGTH OF RESPONSE.DATA!!!!!!*/

    // if (!response2.data.athlete){
    
    // }
    // const data_set = [...response2.data];
    // for (element of data_set) {
    //   if (element["type"] == "Ride" || element["type"] == "VirtualRide") {
    //     const watts = await axios.get(
    //       // https://communityhub.strava.com/t5/developer-discussions/strava-api-keys-and-streams/m-p/5393
    //       `https://www.strava.com/api/v3/activities/${element.id}/streams/watts?series_type=time&resolution=medium`,
    //       { headers: { Authorization: `${token}` } }
    //     );
    //     if (watts.data.length >= 2) {
    //       element["watt_stream"] = watts.data;
    //       // const sorted = quickSort(findAverage(element["watt_stream"][0].data))
    //       // console.log(sorted)
    //     }
    //   }
    //   if (element["type"] == "Run") {
    //     const run = await axios.get(
    //       `https://www.strava.com/api/v3/activities/${element.id}/streams?keys=time,heartrate,velocity_smooth&key_by_type=true&resolution=medium`,
    //       { headers: { Authorization: `${token}` } }
    //     );
    //     element["run_stream"] = run.data;
    //   }
    // }

    //  console.log("data set for latest", data_set)
    // const { id } = data_set[0].athlete;
    
    // const foundUserActs = await UserActivities.findOne({ athlete_id: req.params.id})
    // await UserActivities.updateOne(
    //   { athlete_id: id },
    //   { $push: { activities: { $each: data_set } } }
    // );
    return
    // return res.json(data_set);
  } catch (err) {
    console.log(err);
  }
};

const importActivities = async (req, res) => {
  const errors = {};
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }
  // CHECK IF DATA EXISTS !!!!////
  
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
        // const sorted = quickSort(findAverage(element["watt_stream"][0].data))
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
  const { id } = data_set[0].athlete;
  const foundUserActs = await UserActivities.findOne({ athlete_id: id });
  if (foundUserActs) {
    if (foundUserActs.activities.length > 5) {
      return res.send((errors["error"] = "already imported"));
    }
  }
   // the data needs to be reversed - because otherwise the latest activity is first
  data_set.reverse()
  const allUserData = await UserActivities.findOneAndUpdate(
    { athlete_id: id },
    { $push: { activities: { $each: data_set } } },
  {new: true});
  console.log(id);
  return res.send(allUserData);
};

const getIndividualActivities = async (req, res) => {
  const errors = {};
  const token = req.cookies.token;
  if (!req.cookies.token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }
  const response2 = await axios.get(
    `https://www.strava.com/api/v3/activities/10030729776/streams/watts?series_type=time&resolution=low`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.json(response2.data);
};

const router = express.Router();

router.get("/activities/import", importActivities);
// router.get("/activities/all/:actid", getAllActivities);
router.get("/activities/:after", getLatestActivities);

router.get("/athlete", getAthlete);
router.get("/:athleteId", getAthleteStats);
router.get("/watts", getIndividualActivities);

module.exports = router;
