"use client"

import { useState } from "react";
import Link from "next/link";
import NavbarElementType from "@/types/NavbarElements";
import { IoHomeOutline, IoPersonAddOutline } from "react-icons/io5";
import { CiBookmarkCheck, CiCalendarDate } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineLogin } from "react-icons/ai";
import {FaRegArrowAltCircleRight} from "react-icons/fa";

const SideNavbar = () => {
  const isUserLoggedIn = true;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };

  const NavbarElements: NavbarElementType[] = [
    {
      name: "Home",
      icon: IoHomeOutline,
      link: "/",
    },
    {
      name: "Events",
      icon: CiCalendarDate,
      link: "#events",
    },
  ];

    return (
        <div className={`fixed top-0 left-0 h-screen  bg-[var(--darkVariant)] z-40 ${isExpanded ? "w-64" : "w-0"} duration-500 transition-all`}>
            <button className="z-[1000]" onClick={toggleExpanded}><i className={`text-black text-3xl absolute top-2 -right-10`}><FaRegArrowAltCircleRight className={`text-black cursor-pointer text-3xl ${isExpanded && "rotate-180"}`}/></i></button>
            <Link href="/" className={`cursor-pointer p-8 flex ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}`}>
                <h1 className={`text-white text-2xl font-bold duration-500 transition-all ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}`}>Tickify</h1>
            </Link>

      <ul className="whitespace-nowrap">
        {NavbarElements.map((element, index) => {
          return (
            <li key={index} className="mt-8">
              <Link
                href={element.link}
                className="flex items-center gap-x-8 ps-8 "
              >
                <element.icon
                  className={`text-orange-400 text-3xl ${
                    isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
                  }`}
                />
                <h2 className={`text-orange-400 text-center font-semibold ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"} duration-500 transition-all`}>
                  {element.name}
                </h2>
              </Link>
            </li>
          );
        })}
      </ul>

            {isUserLoggedIn ? <div className="flex flex-col gap-y-8 mt-8 ps-8">
                <Link href="/dashboard/reservations" className={`flex items-center gap-x-8 text-orange-400 font-semibold text-nowrap ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"} duration-500 transition-all`}>
                    <CiBookmarkCheck className="text-3xl" /> My Bookings
                </Link>
                <button className={`flex items-center gap-x-8 text-orange-400 font-semibold cursor-pointer text-nowrap ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"} duration-500 transition-all`}>
                    <FiLogOut className="text-3xl"/> Sign out
                </button>
            </div> : <div className="flex flex-col gap-y-8 mt-8 ps-8">
                <button className={`flex items-center gap-x-8 text-orange-400 font-semibold cursor-pointer text-nowrap ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"} duration-500 transition-all`}>
                    <AiOutlineLogin className="text-3xl"/>   Sign In
                </button>
                <button className={`flex items-center gap-x-8 text-orange-400 font-semibold cursor-pointer text-nowrap ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"} duration-500 transition-all`}>
                    <IoPersonAddOutline className="text-3xl"/> Sign Up
                </button>
            </div>}
    </div>
  );
};

export default SideNavbar;
