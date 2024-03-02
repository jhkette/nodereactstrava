// libraries
const express = require("express");
const axios = require("axios");
const _ = require("lodash");

// user activities model
const UserActivities = require("../models/UserActivities");
// helper functions
const { calcMaxHr, getHrZones } = require("../helpers/hrCalculation");
const { sleep } = require("../helpers/sleep");
const { calcFtp } = require("../helpers/ftpCalculation");
const activityLoop = require("../helpers/addActivityData");
const calculateTss = require("../helpers/calculateTss");
const checkPbs = require("../helpers/checksPbs");

// values
const { durations, distances } = require("../helpers/values");

const getAthlete = async (req, res) => {
  console.log('get athlete ran', req.headers.authorization)
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

    // console.log(response.data, "this is the response from the data")

    const foundUserActs = await UserActivities.findOne({
      athlete_id: response.data.id,
    });

    if (foundUserActs) {
      return res.send({ profile: response.data, user: foundUserActs });
    }

    const id = parseInt(response.data.id);
    const newUser = new UserActivities({ athlete_id: id });
    const userToSave = await newUser.save();

    return res.send({ profile: response.data, user: userToSave });
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

  let response2 = await axios.get(
    `https://www.strava.com/api/v3/athlete/activities`,
    {
      headers: { Authorization: token },
      params: { after: after},
    }
  );

  if (response2.status === 429) {
    await sleep();
    response2 = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        headers: { Authorization: token },
        params: { after: after },
      }
    );
  }
 console.log("get latest")
  if (response2.data.length == 0) {
    errors["error"] = "no activities found";
    return res.send(errors);
  }
  
  const data_list = [...response2.data];

  const { id } = data_list[0].athlete;
  // equality check for latest actviity on mongo vs latest new activity
  const allActs = await UserActivities.findOne({ athlete_id: id });
  console.log(
    allActs.activities[allActs.activities.length - 1],
    "the last activity"
  );
  if (
    allActs.activities[allActs.activities.length - 1].id ==
    data_list[data_list.length - 1].id
  ) {
    errors["error"] = "this activity has already been added";
    return res.send(errors);
  }

  const data_set = await activityLoop(data_list, token);

  // check if individual activty pbs are better than all time pbs

  console.log(allActs.cyclingpbs, "THIS IS CYCLING PBS")

  const [cyclingiImprovements, runImprovements] = checkPbs(
    data_set,
    allActs.cyclingpbs,
    allActs.runningpbs
  );
  
  if(cyclingiImprovements["12"]){
    console.log("improvement")
  }

  if(cyclingiImprovements["20"]){
    console.log("improvement")
  }
  
  console.log(cyclingiImprovements, "THIS IS CYCLING IMPROVEMENTS")
  // if(Object.keys(cyclingiImprovements)){

  // }

  // check ftp!!!

  if (Object.keys(cyclingiImprovements)) {
    for (const key in cyclingiImprovements) {
      await UserActivities.updateOne(
        { athlete_id: id },
        {
          $set: {
            cyclingpbs: {
              key: cyclingiImprovements[key],
            },
          },
        }
      );
    }
  }

  if (Object.keys(runImprovements)) {
    for (const key in runImprovements) {
      await UserActivities.updateOne(
        { athlete_id: id },
        {
          $set: {
            cyclingpbs: {
              key: runImprovements[key],
            },
          },
        }
      );
    }
  }

  //add tss
  for (element of data_set) {
    const finalTss = calculateTss(
      element,
      allActs.cyclingFTP,
      allActs.bikeHrZones,
      allActs.runHrZones
    );
    element["tss"] = finalTss;
  }

  console.log("data set for latest", data_set);

  await UserActivities.updateOne(
    { athlete_id: id },
    { $push: { activities: { $each: data_set } } }
  );
  return res.send(data_set);
  // return res.json(data_set);
};

const importActivities = async (req, res) => {
  const errors = {};
  const token = await req.headers.authorization;
  const userId = req.headers.id;
  if (!token) {
    errors["error"] = "Permission not granted";
    return res.send(errors);
  }
  // // CHECK IF DATA EXISTS !!!!////

  // First I am checking if there is data for activities in mongodb
  const foundUserActs = await UserActivities.findOne({ athlete_id: userId });
  if (foundUserActs) {
    if (foundUserActs.activities.length > 5) {
      return res.send((errors["error"] = "data has already imported"));
    }
  }

  let page_num = 1;
  const data_list = [];
  try {
    while (page_num <= 10) {
      let response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities`,
        {
          headers: { Authorization: token },
          params: { per_page: 30, page: page_num },
        }
      );
      if (response.status == 429) {
        await sleep();
        response = await axios.get(
          `https://www.strava.com/api/v3/athlete/activities`,
          {
            headers: { Authorization: token },
            params: { per_page: 20, page: page_num },
          }
        );
      }
      data_list.push(...response.data);
      page_num++;
    }
  } catch (err) {
    console.log(err.message)
  }

  const data_set = await activityLoop(data_list, token);
  const allTime = {};
  const runAllTime = {};
  const bikeActivities = data_set.filter((element) =>
    element.hasOwnProperty("pbs")
  );

  const runActivities = data_set.filter((element) =>
    element.hasOwnProperty("runpbs")
  );

  for (duration of durations) {
    let result = bikeActivities.map((activity) => activity.pbs[duration]);
    allTime[duration] = _.max(result);

    console.log(allTime[duration]);
  }

  for (distance of distances) {
    
    let result = runActivities.map((activity) => activity.runpbs[distance]);
    console.log(result)
    runAllTime[distance] = _.min(result);
  }
  
  console.log(runAllTime)
  const ftp = calcFtp(allTime);

  const maxCyclingHr = calcMaxHr(bikeActivities, "ride");

  const runMaxHr =  calcMaxHr(runActivities, "run");

  const bikeZones = getHrZones(maxCyclingHr);

  const runZones = getHrZones(runMaxHr);

  for (element of data_set) {
    const finalTss = calculateTss(element, ftp, bikeZones, runZones);
    element["tss"] = finalTss;
  }

  // const { id } = data_set[0].athlete;
  /**  the data needs to be reversed - because otherwise the latest activity is first - 
  activities need to be arranged
   * first to last **/
  console.log(runAllTime[2414])
  data_set.reverse();
  const allUserData = await UserActivities.findOneAndUpdate(
    { athlete_id: userId },
    {
      $push: { activities: { $each: data_set } },
      $set: {
        cyclingpbs: {
          15: allTime["15"],
          30: allTime["30"],
          60: allTime["60"],
          90: allTime["90"],
          120: allTime["120"],
          150: allTime["150"],
          180: allTime["180"],
          210: allTime["210"],
          240: allTime["240"],
          270: allTime["270"],
          300: allTime["300"],
          330: allTime["330"],
          360: allTime["360"],
          390: allTime["390"],
          410: allTime["410"],
          440: allTime["440"],
          480: allTime["480"],
          600: allTime["600"],
          720: allTime["720"],
          900: allTime["900"],
          1200: allTime["1200"],
          1800: allTime["1800"],
          2700: allTime["2700"],
          3600: allTime["3600"],
        },
        runningpbs: {
          400: runAllTime[400],
          800: runAllTime[800],
          1000: runAllTime[1000],
          2414: runAllTime[2414],
          3000: runAllTime[3000],
          5000: runAllTime[5000],
          10000: runAllTime[10000],
        },
        bikeHrZones: {
          zone1: bikeZones['zone1'],
          zone2: bikeZones['zone2'],
          zone3: bikeZones['zone3'],
          zone4: bikeZones['zone4'],
          zone5: bikeZones['zone5'],
        },
        runHrZones: {
          zone1: runZones['zone1'],
          zone2: runZones['zone2'],
          zone3: runZones['zone3'],
          zone4: runZones['zone4'],
          zone5: runZones['zone5'],
        },

        cyclingFTP: ftp,
        cyclingMaxHr: maxCyclingHr,
        runningMaxHr: runMaxHr,
      },
    },

    // `allUserData` is the document _after_ `update` was applied because of
    // `new: true`
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

module.exports = router;
