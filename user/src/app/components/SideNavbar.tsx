"use client";

import { useState } from "react";
import Link from "next/link";
import NavbarElementType from "@/app/types/NavbarElements";
import { IoHomeOutline, IoPersonAddOutline } from "react-icons/io5";
import { CiBookmarkCheck, CiCalendarDate } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineLogin } from "react-icons/ai";

const SideNavbar = () => {
  const isUserLoggedIn = true;
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

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
    <div
      className={`fixed top-0 left-0 h-screen  bg-[var(--darkVariant)] z-40 ${
        isExpanded ? "w-64" : "w-0"
      } duration-300`}
    >
      <Link
        href="/"
        className={`cursor-pointer p-8 flex ${
          isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <h1 className="text-white text-2xl font-bold">Tickify</h1>
      </Link>

      <ul className="">
        {NavbarElements.map((element, index) => {
          return (
            <li key={index} className="mt-8">
              <Link
                href={element.link}
                className="flex items-center gap-x-8 ps-8 "
              >
                <element.icon
                  className={`text-orange-400 text-3xl ${
                    isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
                <h2 className="text-orange-400 text-center font-semibold">
                  {element.name}
                </h2>
              </Link>
            </li>
          );
        })}
      </ul>

      {isUserLoggedIn ? (
        <div className="flex flex-col gap-y-8 mt-8 ps-8">
          <Link
            href="/user/reservation"
            className="flex items-center gap-x-8 text-orange-400 font-semibold"
          >
            <CiBookmarkCheck className="text-3xl" /> My Bookings
          </Link>
          <button className="flex items-center gap-x-8 text-orange-400 font-semibold cursor-pointer">
            <FiLogOut className="text-3xl" /> Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-8 mt-8 ps-8">
          <button className="flex items-center gap-x-8 text-orange-400 font-semibold cursor-pointer">
            <AiOutlineLogin className="text-3xl" /> Sign In
          </button>
          <button className="flex items-center gap-x-8 text-orange-400 font-semibold cursor-pointer">
            <IoPersonAddOutline className="text-3xl" /> Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default SideNavbar;
