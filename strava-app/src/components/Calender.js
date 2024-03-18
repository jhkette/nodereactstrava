import { subMonths, eachDayOfInterval, format } from "date-fns";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDumbbell, faHeart } from "@fortawesome/free-solid-svg-icons";

import {
  faBiking,
  faCalendar,
  faDoorOpen,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";



export default function EventsCalender({ userActivities }) {
  const currentDate = new Date(); // get current date

  const pastDate = subMonths(currentDate, 1); // get one month before current day

  const interval = eachDayOfInterval({
    // get the interval of days between these dates
    start: currentDate,
    end: pastDate,
  });
  // This is essentially a hash table that stores the dates
  const allDates = interval.map((date) => {
    // create an array of objects with this array with date, event, and tss keys
    return {
      date: date.toString().split(" ").slice(0, 4).join(" "), // formatting date here
      events: [],
      tss: 0,
    };
  });

  const lastMonth = userActivities.filter((event) => {
    // filter activities that happen in that month
    return new Date(event.start_date) >= new Date(pastDate);
  });
  // loop through activities and find the object with the same date key
  // then add that activity to that object
  for (let activity of lastMonth) {
    let date = new Date(activity.start_date);
    let formattedDate = format(date, "E LLL dd yyyy");
    let dateFound = allDates.find((obj) => obj.date === formattedDate);
    if (dateFound) {
     
      if (activity["average_heartrate"]) {
        dateFound.events.push([
          activity.sport_type,
          activity.average_heartrate,
          activity.tss,
        ]);
        dateFound.tss += activity.tss;
      } else {
        dateFound.events.push([activity.sport_type]);
      }
    }
  }

  const finalHtml = allDates.map((date) => {
    let classes = classNames({
      "bg-blue-300 h-12 w-auto": date.tss <= 25,
      "bg-yellow-200 h-12 w-auto": date.tss > 25 && date.tss <= 50,
      "bg-yellow-400 h-12  w-auto": date.tss > 50 && date.tss <= 70,
      "bg-orange-300 h-12 w-auto": date.tss > 70 && date.tss <= 100,
      "bg-orange-500 h-12 w-auto": date.tss > 100 && date.tss <= 130,
      "bg-red-400 h-12 w-auto": date.tss > 130 && date.tss <= 200,
      "bg-red-600 h-12  w-auto": date.tss > 200,
    });
     const sports = ["VirtualRide", "Ride", "Run", "WeightTraining" ]
    if (date.events.length) {
      let eventText = date.events.map((eventArr) => {
        if (eventArr.length < 2) {
          return (
            <div>
              <p className="font-semibold py-2">{eventArr[0]}</p>{" "}
            </div>
          );
        }
        return (
          <div>
            <p className="font-semibold"> 
            {(eventArr[0] === 'VirtualRide' || eventArr[0] === 'Ride' ) &&  <FontAwesomeIcon icon={faBiking} size="sm"  className="pr-2"/> } 
            {(eventArr[0] === "Run") &&   <FontAwesomeIcon icon={faRunning} size="sm"  className="pr-2"/>} 
            {(eventArr[0] === "WeightTraining") &&   <FontAwesomeIcon icon={faDumbbell} size="sm" className="pr-2" />} 
            {(!sports.includes(eventArr[0])) && <FontAwesomeIcon icon={faHeart} size="sm" className="pr-2" />}
            {eventArr[0]}</p>
            <p>Average heartrate:{eventArr[1]}</p>
            <p className="pb-2">TSS:{eventArr[2]}</p>{" "}
          </div>
        );
      });

      return (
        <div className=" flex flex-col  bg-gray-200 justify-between  p-2 min-h-[150px]">
          <div className="py-2">
            <p className="font-semibold">{date.date}</p>
            <p>{eventText}</p>
            <p className="font-semibold">Total Training stress:{date.tss}</p>
          </div>
          <div className={classes}></div>
        </div>
      );
    } else {
      return (
        <div className="p-2 bg-gray-200 p-2 min-h-[150px]">
          <p className="font-semibold py-2">{date.date}</p>
          <p className="font-semibold py-2">Rest day</p>
        </div>
      );
    }
  });

  return (
    <>
      <div className="w-auto inline-block ">
        <div className="flex flex-col mb-4 bg-gray-200  p-4">
          <p className="flex font-bold items-center py-2">
            Training stress key: Low{" "}
            <FontAwesomeIcon icon={faArrowRight} size="sm" className="mx-2" />{" "}
            High.{" "}
          </p>
          <div className="w-full flex">
            <div className="bg-blue-300 mx-1 h-12 w-12"></div>
            <div className="bg-yellow-200 mx-1 h-12 w-12"></div>
            <div className="bg-yellow-400 mx-1 h-12  w-12"></div>
            <div className="bg-orange-300  mx-1 h-12 w-12"></div>
            <div className="bg-orange-500 mx-1 h-12 w-12"></div>
            <div className="bg-red-400 mx-1 h-12 w-12"></div>
            <div className="bg-red-600 mx-1 h-12  w-12"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 text-sm w-full">{finalHtml}</div>
    </>
  );
}
