import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";

import { Routes, Route } from "react-router-dom";
// components
import ReturnProfile from "./components/UserProfile";
import Sidebar from "./components/Sidebar";
import Landing from "./Landing";
import Cycling from "./Cycling";
import Running from "./Running";
import { faSquareArrowUpRight } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [link, setLink] = useState();

  const [auth, setAuth] = useState(false);
  const [athlete, setAthlete] = useState({});
  const [latest, setLatest] = useState(null);
  const [userActivities, setUseractivities] = useState([]);
  const [userRecords, setUserRecords] = useState({});
  const [marathon, setMarathon] = useState({});
  const [half, setHalf] = useState({});
  const [alpe, setAlpe] = useState({});
  const [boxHill, setBoxHill] = useState({});
  const [message, setMessage] = useState("");

  const baseURL = "http://localhost:3000";

  /*
   * Useffect function runs when page loads,
   * return the oauth link to authorise strava
   */
  useEffect(() => {
    axios
      .get(baseURL + "/auth/link")
      .then((res) => setLink(res.data.link))
      .catch((err) => {
        console.log(err);
      });

   
  }, []);

  // useffect function - gets the main athlete data from /user/athlete/
  // and the datasets from /data/datasets. Then sets the state variables
  // with response. 
  useEffect(() => {
    const token = Cookies.get("token")
    if(token){
      setAuth(true)
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const getData = async () => {
      try {
        const userData = await axios.get(baseURL + "/user/athlete", config);
        const dataSet = await axios.get(baseURL + "/data/datasets", config);
        if (userData.data.errors) {
          console.log(userData.data.errors);
          return;
        }
        // set the state values with response
        setAthlete(userData.data.profile);
      
        const userRecordsInfo = _.omit(userData.data.user, "activities");
        setUserRecords(userRecordsInfo);
        setUseractivities(userData.data.user.activities);
        setLatest(
          userData.data.user.activities[
            userData.data.user.activities.length - 1
          ]["start_date"]
        );
        setMarathon(dataSet.data.marathon);
        setHalf(dataSet.data.half);
        setAlpe(dataSet.data.alpe);
        setBoxHill(dataSet.data.boxHill);
      } catch (error) {
        console.log(error);
      }
    };
    // only call the get data function 
    // if there is a token - avoid axios error
    if (token) {
      getData();
    }
  }, []);  
  /**
   * useffect data 
   * get the latest data from strava api
   * call the api with the date of last activity in app state.
   * get all events recorded after that. 
   */
  useEffect(() => {
    const token = Cookies.get("token")
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const getLatestData = async () => {
      try {
        // date is a unix timestamp - just modifying so it works with strava api
        const date = Math.floor(Date.parse(latest) / 1000);
        const activities = await axios.get(
          baseURL + `/user/activities/${date}`,
          config
        );
        console.log(
          activities,
          "THIS IS THE ACTIVITIES THAT ARE FROM THE DATE"
        );
        if (activities.data.error) {
          console.log(activities.data.error);
          return;
        } else {
          
          if (activities.data.length) {
            setUseractivities((oldArray) => [...oldArray, ...activities.data]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log("the latest use effect ran", latest);
    if (auth && latest && userActivities.length) {
      getLatestData();
    }
  }, [auth, latest, userActivities]);

  /**
   * function importData
   * function runs when user logs in for first time
   * and first set of data is imported.
   * setsUserRecords and
   * setsUseractivities
   * @returns void
   */
  const importData = async () => {
    const token = Cookies.get("token")
    setMessage(
      "Please come back and login after an hour - the data will be uploaded by then"
    );
    const config = {
      headers: { Authorization: `Bearer ${token}`, id: athlete.id },
    };
    axios(baseURL + `/user/activities/all-activities`, config);

    setTimeout(() => {
      logout();
    }, 20000);
  };

 
  /**
   * function logout
   * remove token
   * calls logout function on server
   * @return void
   */
  const logout = () => {
    setAuth(false)
    setMessage("");
    Cookies.remove("token");
   
    axios.get(baseURL + "/auth/logout");
    window.location.href = "/";
    if (window.location.pathname === "/") {
      window.location.reload();
    }
    
  };

  // define weight variable for cycling page
  let weight
  if(athlete.weight === undefined){
    weight = 75;
  }else{
    weight = athlete.weight
  }

  return (
    <div className="font-body flex ">
      <Sidebar
        logout={logout}
        auth={auth}
        importData={importData}
        userActivities={userActivities}
       
      />
      <div className="h-auto w-full ">
        {!!athlete.id && (
          <header className="top-0 ... pt-4 px-32 flex justify-end ">
            {faSquareArrowUpRight && <ReturnProfile athlete={athlete} />}
          </header>
        )}

        <div className="bg-grey-50">
          {/* App Naviation each route shows a different element in the 
          main block of the page/ ie the cycling page, running page etc*/}
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Landing
                  auth={auth}
                  logout={logout}
                  userActivities={userActivities}
                  importData={importData}
                  link={link}
                  message={message}
                />
              }
            ></Route>
            <Route
              path="/cycling"
              element={
                <Cycling
                  userRecords={userRecords}
                  ftp={userRecords.cyclingFTP}
                  alpedataset={alpe}
                  boxdataset={boxHill}
                  weight={weight}
                />
              }
            ></Route>

            <Route
              path="/running"
              element={
                <Running
                  userRecords={userRecords}
                  mardataset={marathon}
                  halfdataset={half}
                />
              }
            ></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
