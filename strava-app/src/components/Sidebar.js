import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBiking,
  faCalendar,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  return (
    <div className="h-auto w-4/12 bg-teal-800">
      <div className="flex flex-col p-12">
        <div className="flex flex-row justify-start items-center">
          <FontAwesomeIcon icon={faCalendar} inverse size="2x" />
          <p className="p-2 text-xl text-white">Home</p>
        </div>
        <div className="flex flex-row justify-start items-center">
          <FontAwesomeIcon icon={faBiking} inverse size="2x" />
          <p className="p-2 text-xl text-white">
            Biking
          </p>
        </div>
        <div className="flex flex-row justify-start items-center">
          <FontAwesomeIcon icon={faRunning} inverse size="2x" />
          <p className=" p-2 text-xl text-white">
            Running
          </p>
        </div>
      </div>
    </div>
  );
}
