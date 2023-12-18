const express = require("express");
const axios = require("axios");
const UserActivities = require("../models/UserActivities");

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
    // const user = new userActivities({
    //   id: response.data.id
    //  })

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
  const after = req.params.after;

  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.send(errors);
  }
  try {
    // let page_num = 1;
    // const data_set = [];

    const response2 = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      { headers: { Authorization: token }, params: { after: after } }
    );
    // const foundUserActs = await UserActivities.findOne({ athlete_id: req.params.id})
    const allUserData = await UserActivities.updateOne(
      { athlete_id: id },
      { $push: { activities: { $each: response2.data } } }
    );

    return res.json(allUserData);
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
  const allUserData = await UserActivities.updateOne(
    { athlete_id: id },
    { $push: { activities: { $each: data_set } } }
  );
  console.log(id);
  return res.send(allUserData);
};

// const getAllActivities = async (req,res) => {
//   const errors = {};
//   console.log(req.headers.authorization);
//   const token = req.headers.authorization;
//   if (!token) {
//     errors["error"] = "Permission not granted";
//     return res.json(errors);
//   }

//   const response = await axios.get(`https://www.strava.com/api/v3/athlete`, {
//       headers: { Authorization: token },
//     });
//   const finalid = parseInt(req.params.actid)
//   console.log(finalid, response.data.id)
//   if(finalid === response.data.id){
//     console.log('hello it is the same')
//   }

//   const foundUserActs = await UserActivities.findOne({
//     athlete_id: response.data.id,
//   });
//   // console.log(typeof(id), "getallactivities")
//   // const foundUserActs = await UserActivities.findById(id).exec();
//   // console.log(foundUserActs)
//   // if (!foundUserActs) {
//   //   return res.send((errors["error"] = "user not found"));
//   // }
//   return res.send(foundUserActs);
// };

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
