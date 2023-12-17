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

  const [latestEntry, setlatestEntry] = useState(null);
  const [test, setTest] = useState({});

  const baseURL = "http://localhost:3000";

  let db = useMemo(() => new Localbase("db"), []);

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

    if (token) {
      axios
        .get(baseURL + "/user/athlete", config)
        .then((res) => setAthlete(res.data))
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [token, athlete.id]);

  //   const max = data.reduce(function(prev, current) {
  //     return (prev && prev.y > current.y) ? prev : current
  // })

  // const max = data.reduce((prev, current) => (prev && prev.y > current.y) ? prev : current)
  useEffect(() => {
    try {
      db.collection("activities")
        .get()
        .then((activities) => {
          if (activities.length) {
            setlatestEntry(
              Date.parse(activities[activities.length - 1]["start_date"]) / 1000
            );
            console.log(activities[activities.length - 1]);
            console.log("checking for latest entry");
          }
        });
    } catch (err) {
      console.log(err);
    }
  }, [db]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    console.log("hello");
    const addLatest = (finalData) => {
      for (const element of finalData) {
        db.collection("activities").add(element);
      }
    };

    console.log(token, moment(latestEntry).isValid(), latestEntry);

    console.log(latestEntry, "this should be fetching");
    if (moment(latestEntry).isValid()) {
      axios
        .get(baseURL + `/user/latestactivities/${latestEntry}`, config)
        .then((res) => addLatest(res.data))
        .then(() =>
          console.log(
            baseURL + `/user/latestactivities/${latestEntry}`,
            "this url ran"
          )
        );
    }
  }, [token, latestEntry, db]);

  const importData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios(baseURL + `/user/activities`, config);
    console.log(response);
    const finalData = [];
    for (let i = 0; i < response.data.length; i++) {
      finalData.push(response.data[i]);
    }
    console.log("import data ran");
    const reversed = finalData.reverse();
    for (const element of reversed) {
      db.collection("activities").add(element);
    }
    Cookies.set("imported", true);
  };
  // const addTo = async () => {

  // };

  const testData = () => {
    db.collection("activities")
      .get()
      .then((activities) => {
        console.log("users: ", activities);
      });
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

          <button
            class="bg-sky-500/100 px-6 py-2 rounded-md"
            onClick={testData}
          >
            test
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
