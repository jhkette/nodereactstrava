import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import EventCalendar from './components/Calender';



export default function Landing({token, userActivities, link, importData}) {
  return (
    <main className="py-12  bg-slate-100 min-h-screen">
    <div className="px-32">
      {!token &&
        <>
        <p className="py-4">
        Please click the authorise button to allow this application to use
        your strava data
      </p>
        <button className="bg-teal-600 px-6 py-2 rounded-md">
          <a href={link}>Authorise</a>
        </button>
        </>
      }

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
      {/* {userActivities.length && (
        <ActivityList activities={userActivities} />
      )} */}
       {userActivities.length && (
       <EventCalendar userActivities={userActivities}/>
       )}
    </div>
  </main>
    
  )
}
