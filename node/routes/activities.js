const express = require("express");
const axios = require("axios");

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
  }catch(err){
    console.log(err)
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
  const response2 = await axios.get(
    `https://www.strava.com/api/v3/athlete/activities`,
    { headers: { Authorization: token } }
  );
  return res.json(response2.data);
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

router.get("/activities", getActivities);
router.get("/athlete", getAthlete);
router.get("/:athleteId", getAthleteStats);
router.get("/watts", getIndividualActivities);

module.exports = router;
