import { subMonths, eachDayOfInterval, format } from "date-fns";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function EventsCalender({ userActivities }) {

  const currentDate = new Date(); // get current date

  const pastDate = subMonths(currentDate, 1); // get one month before current day

  const interval = eachDayOfInterval({ // get the interval of days between these dates
    start: currentDate,
    end: pastDate,
  });

  const allDates = interval.map((date) => { // create an array of objects with this array with date, event, and tss keys
    return {
      date: date.toString().split(" ").slice(0, 4).join(" "), // formatting date here
      events: [],
      tss: 0,
    };
  });

  const lastMonth = userActivities.filter((event) => { // filter activities that happen in that month
    return new Date(event.start_date) >= new Date(pastDate);
  });
  // loop through activities and find the object with the same date key
  // then add that activity to that object
  for (let activity of lastMonth) {  
    let date = new Date(activity.start_date);
    let formattedDate = format(date, "E LLL dd yyyy");
    let dateFound = allDates.find((obj) => obj.date === formattedDate);
    if (dateFound ) {
        dateFound.events.push(activity.sport_type);
        dateFound.tss += activity.tss;
    }
  }

  const finalHtml = allDates.map((date) => {
    let classes = classNames({
      "bg-blue-300 h-12 w-12 self-end": date.tss <= 25,
      "bg-yellow-200 h-12 w-12 self-end": date.tss > 25 && date.tss <= 50,
      "bg-yellow-400 h-12  w-12 self-end": date.tss > 50 && date.tss <= 70,
      "bg-orange-300 h-12 w-12 self-end": date.tss > 70 && date.tss <= 100,
      "bg-orange-500 h-12 w-12 self-end": date.tss > 100 && date.tss <= 130,
      "bg-red-400 h-12 w-12 self-end": date.tss > 130 && date.tss <= 200,
      "bg-red-600 h-12  w-12 self-end": date.tss > 200,
    });

    if (date.events.length) {
      let eventText = date.events.map((event) => {
        return <p>{event.substring(0, 25)}</p>;
      });

      return (
        <div className="border border-dashed flex flex-col justify-between border-gray-600 p-2 min-h-[150px]">
          <div className="py-2">
            <p className="font-extrabold">{date.date}</p>
            <p>{eventText}</p>
            <p>Training stress:{date.tss}</p>
          </div>
          <div className={classes}></div>
        </div>
      );
    } else {
      return (
        <div className="border border-dashed border-gray-600 p-2 min-h-[150px]">
          <p className="font-extrabold">{date.date}</p>
        </div>
      );
    }
  });

  return (
    <>
    <div className="w-auto inline-block ">
    <div className="flex flex-col my-4 bg-teal-200  p-4">
        <p className="flex font-bold items-center py-2">Training stress key:   Low <FontAwesomeIcon icon={faArrowRight} size="sm" className="mx-2"/>  High. </p>
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
    <div className="grid grid-cols-5 gap-3 text-sm w-full">{finalHtml}</div>
    </>
  );
}
