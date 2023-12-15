import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Localbase from "localbase";
// components
import ReturnProfile from "./components/profile";
import AthleteRecords from "./components/AthleteRecords";

function App() {
  const [link, setLink] = useState();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [athlete, setAthlete] = useState({});
  const [activities, setActivities] = useState({});
  const [latestEntry, setlatestEntry] = useState({});
  const [test, setTest] = useState({});
  const [totals, setTotals] = useState({});
  const [imported, setImported] = useState(false)

  const baseURL = "http://localhost:3000";

  let db = new Localbase("db");

  useEffect(() => {
    db.collection("activities")
      .get()
      .then((activities) => {
        if (activities[0]) {
          setlatestEntry(activities[0][2]["start_date"]);
          console.log(activities[0][2]["start_date"]);
          setImported(true);
        }
      });
  });
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

    if (athlete.id) {
      axios
        .get(baseURL + `/user/${athlete.id}`, config)
        .then((res) => setTotals(res.data))
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [token, athlete.id]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (athlete.id) {
      const date = Date.parse(latestEntry).toString();

      axios
        .get(baseURL + `/user/activities/${date}`, config)
        .then((res) => setTest(res.data))

        .catch((err) => {
          setError(err.message);
        });
    }
  }, [athlete.id, token, latestEntry]);

  const importData = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

   const response = await axios(baseURL + `/user/activities`, config)
   console.log(response.data);
   setActivities(response.data, "this is all activities")

    addTo();
  };
  const addTo = async () => {
    const finalData = [];
    for (const element of activities) {
      finalData.push(...element);
    }
    await db.collection("activities").set({
      ...finalData,
    });
    setImported(true)
  };

  const testData = () => {
    console.log(test, "this is test");
  };
  const logout = () => {
    Cookies.remove("token");
   
    axios.get(baseURL + "/auth/logout");
    window.location.reload();
  };

  // const getLatest = (after) => {
  //   const afterFinal = String(Date.parse(after))
  //   const config = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  //   axios
  //   .get(baseURL + `/user/activities/${afterFinal}`, config)
  // }

  // console.log(getLatest("2023-12-10T19:50:54Z"));

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
          {!imported && (
          <button
            class="bg-sky-500/100 px-6 py-2 rounded-md"
            onClick={importData}
          >
            import
          </button>) 
          }
          <button
            class="bg-sky-500/100 px-6 py-2 rounded-md"
            onClick={testData}
          >
            test
          </button>
        </div>
        <div>
          {totals.all_ride_totals && <AthleteRecords totals={totals} />}
        </div>
      </main>
    </div>
  );
}

export default App;
