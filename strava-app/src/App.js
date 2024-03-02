import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";

import {
  Routes, 
  Route,
} from "react-router-dom";
// components
import ReturnProfile from "./components/profile";
import Sidebar from "./components/Sidebar";
import Landing from "./Landing";
import Cycling from "./Cycling";
import Running from "./Running";

function App() {
  const [link, setLink] = useState();

  const [token, setToken] = useState(null);
  const [athlete, setAthlete] = useState({});
  const [latest, setLatest] = useState(null);
  const [userActivities, setUseractivities] = useState([]);
  const [userRecords, setUserRecords] = useState({});

  const baseURL = "http://localhost:3000";

  useEffect(() => {
    axios
      .get(baseURL + "/auth/link")
      .then((res) => setLink(res.data.link))
      .catch((err) => {
        console.log(err);
      });

    setToken(Cookies.get("token"));
  }, []);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const getData = async () => {
      try {
        const userData = await axios.get(baseURL + "/user/athlete", config);
        if (userData.data.errors) {
          console.log(userData.data);
          return;
        }
        console.log(userData);
        setAthlete(userData.data.profile);
        const userRecordsInfo = _.omit(userData.data.user, "activities");
        setUserRecords(userRecordsInfo);
        setUseractivities(userData.data.user.activities);
        setLatest(
          userData.data.user.activities[
            userData.data.user.activities.length - 1
          ]["start_date"]
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      getData();
    }
  }, [token]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const getLatestData = async () => {
      try {
        console.log("THIS IS THE LATEST THAT IS IMPORTANT!!!", latest);
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
          console.log(activities.data);
          setUseractivities((oldArray) => [...oldArray, ...activities.data]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log("the latest use effect ran", latest);
    if (token && latest && userActivities) {
      getLatestData();
    }
  }, [token, latest, userActivities]);

  /**
   * function importData
   * function runs when user logs in for first time
   * and first set of data is imported.
   * setsUserRecords and
   * setsUseractivities
   * @returns void
   */
  const importData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}`, id: athlete.id },
    };

    const response = await axios(baseURL + `/user/activities/import`, config);
    console.log(response.data, "msadmskald");
    if (response.data.error) {
      console.log(response.data.error);
      return;
    }
    const userRecordsInfo = _.omit(response.data, "activities");
    setUserRecords(userRecordsInfo);
    setUseractivities(response.data.activities);
  };

  /**
   * function logout
   * remove token
   * calls logout function on server
   * @return void
   */
  const logout = () => {
    Cookies.remove("token");
    axios.get(baseURL + "/auth/logout");
    window.location.reload();
  };

  return (
    <div className="font-body flex">
      <Sidebar />
      <div className="h-auto w-9/12">
        <header className="top-0 ... py-4 px-40   bg-slate-100  flex justify-between">
          <h1 className="text-2xl">Strava Dashboard</h1>
          {token ? (
            <ReturnProfile athlete={athlete} />
          ) : (
            <p className="py-4">
              Please click the authorise button to allow this application to use
              your strava data
            </p>
          )}
        </header>

        <div>
         
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <Landing
                    token={token}
                    logout={logout}
                    userActivities={userActivities}
                    importData={importData}
                    link={link}
                  />
                }
              ></Route>
              <Route
                path="/cycling"
                element={<Cycling userRecords={userRecords} />}
              ></Route>

              <Route
                path="/running"
                element={<Running userRecords={userRecords} />}
              ></Route>
            </Routes>
       
        </div>
      </div>
    </div>
  );
}

export default App;
