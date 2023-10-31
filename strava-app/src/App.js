import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
// components
import ReturnProfile from "./components/profile";
import AthleteRecords from "./components/AthleteRecords";

function App() {
  const [link, setLink] = useState();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [athlete, setAthlete] = useState({});
  const [totals, setTotals] = useState({});

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

  const logout = () => {
    Cookies.remove("token");
    axios.get(baseURL + "/auth/logout")
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
              onClick={logout }
            >
              logout
            </button>
          ) : (
            <button class="bg-sky-500/100 px-6 py-2 rounded-md">
              <a href={link}>Authorise</a>
            </button>
          )}
        </div>
        <div>
          {totals.all_ride_totals && <AthleteRecords totals={totals} />}
        </div>
      </main>
    </div>
  );
}

export default App;
