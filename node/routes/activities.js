const express = require("express");
const axios = require("axios");
const userActivities = require("../models/activities")

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
    const response2 = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      { headers: { Authorization: token }, params: { after: after } }
    );
   
 
    return res.json(response2.data);
  } catch (err) {
    console.log(err);
  }
};

const getActivities = async (req, res) => {
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
  const {id} = data_set[0];
  // const useracts = userActivities.find({ id: id})

  // await useracts.updateOne({$push: {activities:{$each: data_set}}})
  console.log(id)
  return res.send(data_set);
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
router.get("/activities", getActivities);
router.get("/athlete", getAthlete);
router.get("/:athleteId", getAthleteStats);
router.get("/watts", getIndividualActivities);

module.exports = router;
