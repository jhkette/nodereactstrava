import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Localbase from "localbase";
import moment from "moment";

// components
import ReturnProfile from "./components/profile";
import AthleteRecords from "./components/AthleteRecords";

function App() {
  const [link, setLink] = useState();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [athlete, setAthlete] = useState({});
  const [latest, setLatest] = useState(null);
  const [userActivities, setUseractivities] = useState([]);

  const baseURL = "http://localhost:3000";

  useEffect(() => {
    axios
      .get(baseURL + "/auth/link")
      .then((res) => setLink(res.data.link))
      .catch((err) => {
        setError(err.message);
      });
    setToken(Cookies.get("token"));
  }, []);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log(config);

    const getData = async () => {
      try{
      const userData = await axios.get(baseURL + "/user/athlete", config);
      if(userData.data.errors){
        console.log(userData.data)
        return;
      }
      console.log(userData);
      setAthlete(userData.data.profile);
      setUseractivities(userData.data.user.activities);
      setLatest(userData.data.user.activities[0]["start_date"]);
      }catch(error){
        console.log(error)
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
      console.log("the get latest function ran");
      try {
        const date = Date.parse(latest) / 1000;
        const activities = await axios.get(
          baseURL + `/user/activities/${date}`,
          config
        );
        //  setUseractivities()
        if (activities.data.error) {
          console.log(activities.data.error);
          return;
        } else {
          console.log(activities.data)
          setUseractivities((oldArray) => [...activities.data, ...oldArray]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log("the latest use effect ran", latest);
    if (token && latest !== null) {
      getLatestData();
    }
  }, [token, latest]);

  const importData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios(baseURL + `/user/activities/import`, config);
    console.log(response.data, "msadmskald");
    setUseractivities(response.data);

    Cookies.set("imported", true);
  };


  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("imported");
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
              class="bg-sky-500/100 px-6 py-2 rounded-md"
              onClick={logout}
            >
              logout
            </button>
          ) : (
            <button class="bg-sky-500/100 px-6 py-2 rounded-md">
              <a href={link}>Authorise</a>
            </button>
          )}

          {Cookies.get("imported") ? (
            ""
          ) : (
            <button
              class="bg-sky-500/100 px-6 py-2 rounded-md"
              onClick={importData}
            >
              import
            </button>
          )}


        </div>
      </main>
    </div>
  );
}

export default App;
