import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import EventCalendar from './components/Calender';



export default function Landing({token, userActivities, link, importData}) {
  return (
    <main className="min-h-screen">
    <div className="px-32">
      {!token ?
        <div>
        <p className="py-4">
        Please click the authorise button to allow this application to use
        your strava data
      </p>
        <button className="bg-teal-600 px-6 py-2 rounded-md">
          <a href={link}>Authorise</a>
        </button>
        </div>  : null
      }

      {token && !userActivities.length ? 
        <div>
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
        </div> : null
      }
      
     
       {userActivities.length && 
       <EventCalendar userActivities={userActivities}/>
       }
    </div>
  </main>
    
  )
}
