import React from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { FaChargingStation, FaCheck, FaClipboardList, FaFileInvoiceDollar } from "react-icons/fa";
import { IoIosNotifications, IoMdBriefcase } from "react-icons/io";
import { FaPersonDigging } from "react-icons/fa6";
import { BsPersonBadgeFill } from "react-icons/bs";
import { MdCoPresent, MdOutlinePlaylistAddCheck } from "react-icons/md";
import { RxLapTimer } from "react-icons/rx";

// NavLinks
export const navLinks = [
  {
    id: 1,
    icon: <FaChargingStation className="-ml-0.5 text-xl" />,
    path: "/stations",
    title: "stations",
  },
];

// Dashboard Analytics
export const dashboardCards = {
  company: [
    {
      title: "Total_Lead",
      icon: <IoMdBriefcase className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task",
      icon: <FaClipboardList className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Invoice",
      icon: <FaFileInvoiceDollar className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Invoice_Paid",
      icon: (
        <div className="relative">
          <FaFileInvoiceDollar className="text-lg text-blue-500" />
          <FaCheck className="absolute text-xs p-0.5 text-blue-500 bg-white rounded-full -bottom-1 -right-1" />
        </div>
      ),
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Invoice_Pending",
      icon: (
        <div className="relative">
          <FaFileInvoiceDollar className="text-lg text-blue-500" />
          <GiSandsOfTime className="absolute text-sm p-0.5 text-blue-500 bg-white rounded-full -bottom-1.5 -right-1" />
        </div>
      ),
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Sales",
      icon: <BsPersonBadgeFill className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Workers",
      icon: <FaPersonDigging className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Project_Manager",
      icon: <MdCoPresent className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
  ],
  project_manager: [
    {
      title: "Total_Lead",
      icon: <IoMdBriefcase className="text-lg text-blue-500" />,
      colSpan: "col-span-2",
    },
    {
      title: "Total_Task",
      icon: <FaClipboardList className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task_Inprogress",
      icon: <RxLapTimer className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task_Pending",
      icon: <GiSandsOfTime className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Task_completed",
      icon: <MdOutlinePlaylistAddCheck className="text-xl text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Sales",
      icon: <BsPersonBadgeFill className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
    {
      title: "Total_Workers",
      icon: <FaPersonDigging className="text-lg text-blue-500" />,
      colSpan: "col-span-2 sm:col-span-1",
    },
  ],
};

// Notification Icons
export const notificationIcons = {
  default: <IoIosNotifications className="text-lg" />,
};

export const colors = {
  error: "border-red-600 bg-red-100 text-red-600",
  info: "border-blue-600 bg-blue-100 text-blue-600",
  warning: "border-yellow-600 bg-yellow-100 text-yellow-600",
  success: "border-green-600 bg-green-100 text-green-600",
};

export const paginationEntries = ["All", 50, 100, 200, 500, 1000];
