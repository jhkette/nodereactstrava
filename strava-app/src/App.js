import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash"
import moment from "moment";

// components
import ReturnProfile from "./components/profile";
import AthleteRecords from "./components/AthleteRecords";
import Linechart from "./linechart";
import DoughnutChart from "./doughnut";
import ActivityList from "./ActivityList";

function App() {
  const [link, setLink] = useState();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [athlete, setAthlete] = useState({});
  const [latest, setLatest] = useState(null);
  const [userActivities, setUseractivities] = useState([]);
  const [userRecords, setUserRecords] = useState({});

  const baseURL = "http://localhost:3000";
  /**
   * Get athlete use effect hook
   */
  useEffect(() => {
    axios
      .get(baseURL + "/auth/link")
      .then((res) => setLink(res.data.link))
      .catch((err) => {
        setError(err.message);
      });
    setToken(Cookies.get("token"));
  }, []);
  // https://code.tutsplus.com/getting-started-with-chartjs-scales--cms-28477t
  // https://stackoverflow.com/questions/48081521/line-chart-with-x-y-point-data-displays-only-2-values
  // https://jsfiddle.net/1sxrtcw5/1/
  //https://stackoverflow.com/questions/37204298/how-can-i-hide-dataset-labels-in-chart-js-v2
  useEffect(() => {
    const authToken = Cookies.get("token");
    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    console.log(config);

    const getData = async () => {
      try {
        const userData = await axios.get(baseURL + "/user/athlete", config);
        if (userData.data.errors) {
          console.log(userData.data);
          return;
        }
        console.log(userData);
        setAthlete(userData.data.profile);
        const userRecordsInfo =  _.omit(userData.data.user, 'activities')
        setUserRecords(userRecordsInfo)
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
    if (authToken) {
      getData();
    }
  }, [token]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const getLatestData = async () => {
      console.log("the get latest function ran");
      try {
        console.log("THIS IS THE LATEST THAT IS IMPORTANT!!!", latest);
        const date = Math.floor(Date.parse(latest) / 1000);
        console.log(date, "this is the date");
        const activities = await axios.get(
          baseURL + `/user/activities/${date}`,
          config
        );

        console.log(
          activities,
          "THIS IS THE ACTIVITIES THAT ARE FROM THE DATE"
        );

        //  setUseractivities()
        if (activities.data.error) {
          console.log(activities.data.error, "THIS IS THE LOGGED ERROR");
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
    const userRecordsInfo =  _.omit(response.data, 'activities')
    setUserRecords(userRecordsInfo)
    setUseractivities(response.data.activities);
  };

  const logout = () => {
    Cookies.remove("token");
    axios.get(baseURL + "/auth/logout");
    window.location.reload();
  };

  return (
    <div className="font-body">
      <header className="top-0 ... py-4 px-40  w-full border-solid border-b-2 border-slate-200 ">
        <h1 className="text-2xl">Strava Dashboard</h1>
      </header>

      <main className="py-12  bg-slate-100 min-h-screen flex">
        <div className="px-40">
          {token ? (
            <ReturnProfile athlete={athlete} />
          ) : (
            <p className="py-4">
              Please click the authorise button to allow this application to use
              your strava data
            </p>
          )}

          {token ? (
            <button
              className="bg-sky-500/100 px-6 py-2 rounded-md"
              onClick={logout}
            >
              logout
            </button>
          ) : (
            <button className="bg-sky-500/100 px-6 py-2 rounded-md">
              <a href={link}>Authorise</a>
            </button>
          )}

          {userActivities.length === 0 &&
            (<>
            <button
              className="bg-sky-500/100 px-6 py-2 rounded-md"
              onClick={importData}
            >
              import
            </button>
            <p>If this is your first time logging in - please click import. This will retrieve data from Strava. Future activities
              will be added automatically.
            </p>
            </>
          )}
          <Linechart />
          {userActivities.length && (
          <ActivityList activities={userActivities}/>
          ) }
          <DoughnutChart />
          
        </div>
      </main>
    </div>
  );
}

export default App;
