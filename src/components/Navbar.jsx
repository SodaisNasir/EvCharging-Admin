import React, { useContext, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../constants/data";
import { VscClose } from "react-icons/vsc";
import { AppContext } from "../context";

const Navbar = ({ toggle, setToggle }) => {
  const { user } = useContext(AppContext);
  const permissions = user?.permissions;

  return (
    <>
      <nav
        id="navbar"
        className={`flex flex-col justify-between h-screen overflow-y-auto absolute md:static top-0 left-0 border-r bg-white ${
          toggle ? "" : "-translate-x-full md:-translate-x-0"
        } max-md:transition-all max-md:duration-300 w-full max-w-[230px] px-5 pb-7 md:py-8 z-[3]`}
      >
        <div>
          {/* close btn (inside navbar) */}
          <button
            onClick={() => setToggle(false)}
            className="mt-3 text-lg md:hidden"
          >
            <VscClose />
          </button>

          <h1>EvCharging</h1>

          {navLinks.map((data) => (
            <NavItem {...{ key: data.title, data, permissions }} />
          ))}
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ data, permissions }) => {
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  // if Nav item is a link
  if (!data.items) {
    if (permissions && !permissions[data.title].view) {
      return null;
    }

    return (
      <NavLink
        to={data.path}
        className={({ isActive }) => {
          return `${
            isActive ? "text-primary-500 font-semibold" : "text-[#091A35]"
          } flex items-center hover:text-primary-500 my-4`;
        }}
      >
        {data.icon}
        <span className="ml-2 text-xs capitalize">
          {data.title.replaceAll("_", " ")}
        </span>
      </NavLink>
    );
  }

  // if Nav item is a list & if user has not permission to any of it's child
  if (
    permissions &&
    data.items
      .map((e) => e.title)
      .every((childTitle) => {
        let hasPermission = permissions[data.title][childTitle.toLowerCase()];
        hasPermission =
          typeof hasPermission === "object"
            ? hasPermission.view
            : hasPermission;
        return !hasPermission;
      })
  ) {
    return null;
  }

  return (
    <>
      <div
        className={`flex items-center my-4 mb-2 cursor-pointer hover:text-primary-500 ${
          location.pathname.includes(data.path)
            ? "!text-primary-500 !font-semibold"
            : "text-[#091A35]"
        }`}
        onClick={() => setToggle(!toggle)}
      >
        {data.icon}
        <span className="ml-2 text-xs capitalize">
          {data.title.replaceAll("_", " ")}
        </span>
      </div>
      <div
        className={`${toggle ? "block" : "hidden"} relative ml-[26px] text-xs`}
      >
        <div className="absolute left-[3px] bg-[#909090] w-0.5 h-full -z-10" />
        {data.items.map(({ path, title }) => {
          if (permissions && !permissions[data.title][title.toLowerCase()].view)
            return null;
          return (
            <NavLink
              key={title}
              to={path}
              className={({ isActive }) => {
                return `${
                  isActive ? "font-semibold" : "font-normal"
                } group flex items-center max-w-fit transition-all duration-300 hover:font-semibold text-[#909090] z-10 capitalize`;
              }}
            >
              <div
                className={`${
                  window.location.pathname === path
                    ? "bg-[#909090] scale-110"
                    : "bg-[#D9D9D9]"
                } group-hover:bg-[#909090] group-hover:scale-125 rounded-full transition-all duration-300 w-2 h-2 mr-2 my-2`}
              />
              {title.replaceAll("_", " ")}
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

// const BottomNavItem = ({ title, path, icon, handleClick, isLast }) => {
//   const Element = isLast ? "button" : NavLink;
//   const className = isLast
//     ? "flex items-center hover:font-medium text-red-500 hover:text-red-600"
//     : ({ isActive }) => {
//         return `flex items-center my-4 ${
//           isActive
//             ? "text-blue-500 font-medium"
//             : "text-[#091A35] hover:text-blue-500 hover:font-medium"
//         }`;
//       };

//   return (
//     <Element
//       to={isLast ? undefined : path}
//       onClick={isLast ? handleClick : undefined}
//       className={className}
//     >
//       {/* <img className="w-4" src={data.icon} alt="icon" /> */}
//       {icon}
//       <span className="ml-3 text-xs">{title}</span>
//     </Element>
//   );
// };

export default Navbar;
