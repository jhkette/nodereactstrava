import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBiking,
  faCalendar,
  faDoorOpen,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Sidebar({logout, token}) {
  return (
    <div className="h-auto w-4/12 bg-sky-900 h-lvh">
      <div className="flex flex-col p-12">
        <div className="flex flex-row justify-start items-center py-2">
        <div className="w-10">
          <FontAwesomeIcon icon={faCalendar} inverse size="xl" />
          </div>
          <p className="p-2 text-xl text-white">
            
          <Link to="/"> Home </Link></p>
        </div>
        <div className="flex flex-row justify-start items-center py-2">
          <div className="w-10">
          <FontAwesomeIcon icon={faBiking} inverse size="xl" />
          </div>
          <p className="p-2 text-xl text-white">
          <Link to="/cycling">  Cycling</Link>
          </p>
        </div>
        <div className="flex flex-row justify-start items-center py-2">
        <div className="w-10">
          <FontAwesomeIcon icon={faRunning} inverse size="xl" />
          </div>
          <p className=" p-2 text-xl text-white">
          <Link to="/running"> Running</Link>
          </p>
        </div>
        {token &&
        <div className="flex flex-row justify-start items-center py-2">
        <div className="w-10">
        <FontAwesomeIcon  icon={faDoorOpen} inverse size="xl" />
         
          </div>
          <p className=" p-2 text-xl text-white cursor-pointer" onClick={logout}>
          Logout
          </p>
        </div>
        }
      </div>
    </div>
  );
}
