import React from 'react'

import RunChart from "./runChart";

import ActivityList from "./ActivityList";


export default function Landing({token, userRecords, userActivities, link, importData, logout}) {
  return (
    <main className="py-12  bg-slate-100 min-h-screen flex">
    <div className="px-40">
      {token ? (
        <button
          className="bg-teal-600 px-6 py-2 rounded-md"
          onClick={() => logout()}
        >
          logout
        </button>
      ) : (
        <button className="bg-teal-600 px-6 py-2 rounded-md">
          <a href={link}>Authorise</a>
        </button>
      )}

      {userActivities.length === 0 && (
        <>
          <button
            className="bg-teal-600 px-6 py-2 rounded-md"
            onClick={()=>importData()}
          >
            import
          </button>
          <p>
            If this is your first time logging in - please click import.
            This will retrieve data from Strava. Future activities will be
            added automatically.
          </p>
        </>
      )}
      
      {/* <RunChart data={userRecords} /> */}
      {userActivities.length && (
        <ActivityList activities={userActivities} />
      )}
     
    </div>
  </main>
    
  )
}
