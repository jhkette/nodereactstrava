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
    console.log(response.data.id, "this is the data.id");
    const foundUserActs = await UserActivities.findOne({
      athlete_id: response.data.id,
    });

    if (foundUserActs) {
      return res.json(response.data);

      // console.log(foundUserActs)
    }
    console.log("if statement is running");
    const newUser = new UserActivities({ athlete_id: response.data.id });
    const userToSave = await newUser.save();
    console.log(userToSave);
    return res.json(response.data);
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
        params: { per_page: 200, page: page_num },
      }
    );

    data_set.push(...response2.data);
    page_num++;
  }

  // for(element of data_set){
  //   element["test"] ="this is just a test"
  // }
  const { id } = data_set[0].athlete;

  console.log(id);
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

const getAllActivities = async () => {
  const errors = {};
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.json(errors);
  }

  const foundUserActs = await UserActivities.findOne({
    athlete_id: req.params.id,
  });
  if (!foundUserActs) {
    return res.send((errors["error"] = "user not found"));
  }
  return res.send(foundUserActs);
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

router.get("/latestactivities/:after", getLatestActivities);
router.get("/activities/import", importActivities);
router.get("/activities/:id", getAllActivities);
router.get("/athlete", getAthlete);
router.get("/:athleteId", getAthleteStats);
router.get("/watts", getIndividualActivities);

module.exports = router;
