import React from "react";
import EventCalendar from "./components/Calender";
import Cookies from "js-cookie";

//  landing page with activity calender

export default function Landing({ auth, userActivities, link, message }) {
  return (
    <>
    {(auth == false) && (
    
    <main className="min-h-screen bg-[url('./images/hardknott.jpeg')] bg-no-repeat bg-cover bg-center bg-fixed flex flex-col content-center justify-center">
      <div className="px-32 pb-16 ">
        
          <div className=" p-8 opacity-70 rounded-md bg-blue-100 ">
          <p className="py-4 font-bold text-xl ">
             Please click authorise. For this app to work best you should upload a mixture of
             running and cycling. Ideally, you should upload at least one 10k run and some hard cycling
             efforts, with a power meter, of between 12 and 20 minutes. 
             
            </p>
            
            <button className="bg-sky-800 px-6 py-2 rounded-lg  text-xl">
              <a href={!!link && link} className="text-white">Authorise Strava</a>
            </button>
            
          </div>
        
      
        </div>
          </main>
        )}
          {!!message && 
        <div className="border border-dashed flex flex-col  bg-sky-100 justify-between border-gray-600 p-2 min-h-[250px]">
         <p className="font-extrabold"> {message}</p>
        </div> }
        {!!userActivities.length && (
            <main className="min-h-screen">
            <div className="px-32 py-16">
              
          <EventCalendar userActivities={userActivities} />
          </div>
          </main>
        )}
        </>
     
  );
}
