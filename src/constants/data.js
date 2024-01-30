import React from "react";
import { FaCar, FaChargingStation, FaUsers } from "react-icons/fa";
import { IoIosLock, IoIosNotifications, IoMdSettings } from "react-icons/io";

// Home route
export const homeRoute = "/users";

// NavLinks
export const navLinks = [
  {
    id: 1,
    icon: <FaUsers className="-ml-0.5 text-xl" />,
    path: "/users",
    title: "users",
  },
  {
    id: 2,
    icon: <IoIosLock className="-ml-1 text-xl" />,
    title: "access",
    path: "/access",
    items: [
      {
        path: "/access",
        title: "sub_admin",
      },
    ],
  },
  {
    id: 3,
    icon: <FaChargingStation className="-ml-0.5 text-xl" />,
    path: "/stations",
    title: "stations",
  },
  {
    id: 4,
    icon: <FaCar className="-ml-0.5 text-xl" />,
    path: "/vehicles",
    title: "vehicles",
  },
  {
    id: 5,
    path: "/settings",
    title: "settings",
    icon: <IoMdSettings className="-ml-0.5 text-xl" />,
    items: [
      {
        path: "/settings",
        title: "country_codes",
      },
      {
        path: "/settings/terms-and-conditions",
        title: "terms_and_conditions",
      },
      {
        path: "/settings/privacy-policy",
        title: "privacy_policy",
      },
      {
        path: "/settings/faqs",
        title: "FAQs",
      },
    ],
  },
];

// defaultPermissions
export const defaultPermissions = {
  users: {
    view: false,
    edit: false,
  },
  access: {
    sub_admin: {
      view: false,
      create: false,
      edit: false,
      permissions: false,
    },
  },
  stations: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    ports: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    bookings: {
      view: false,
      cancel: false,
    },
    reviews: false,
  },
  vehicles: {
    view: false,
    create: false,
    edit: false,
  },
  settings: {
    country_codes: {
      view: false,
      create: false,
      edit: false,
    },
    terms_and_conditions: {
      view: false,
      edit: false,
    },
    privacy_policy: {
      view: false,
      edit: false,
    },
    faqs: {
      view: false,
      edit: false,
    },
  },
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
