import React, { useEffect, useState } from "react";
import Account from "./Account";
import Notifications from "./Notifications";
import { useContext } from "react";
import { AppContext } from "../context";
import { base_url } from "../utils/url";

const Page = ({
  title,
  containerStyles = "",
  headerStyles = "",
  children,
  enableHeader,
}) => {
  const { user } = useContext(AppContext);
  const initialState = { account: false, notifications: false };
  const [notifications, setNotifications] = useState(null);
  const [toggle, setToggle] = useState(initialState);

  const type = user?.role === "1" ? "Company" : "Project Manager";

  const setSingleToggle = (key, value) =>
    setToggle({ ...initialState, [key]: value });

  const fetchNotifications = async () => {
    const url = base_url + "/show-admin-notification/" + user?.id;

    try {
      const formdata = new FormData();
      formdata.append("type", type);
      const requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      const res = await fetch(url, requestOptions);
      const json = await res.json();

      if (json.success) {
        const data = json.success.data;
        console.log("data", data);
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = title + " - EvCharging Administator";

    return () => {
      document.title = "EvCharging Administator";
    };
  }, [title]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const notifications = await fetchNotifications();
      // console.log("notifications", notifications);
      setNotifications(notifications);
    }, 20000);

    // const mouseDownHandler = (e) => {
    //   const accountMenu = document.getElementById("account-menu");
    //   const notifications = document.getElementById("notifications");

    //   console.log({ accountMenu, notifications });

    //   if (accountMenu && !accountMenu.contains(e.target)) {
    //     setToggle({ ...toggle, account: false });
    //     console.log("first");
    //   } else if (notifications && !notifications.contains(e.target)) {
    //     console.log("second");
    //     setToggle({ ...toggle, notifications: false });
    //   }
    // };

    // document.addEventListener("click", mouseDownHandler);

    return () => {
      // document.removeEventListener("click", mouseDownHandler);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {}, [user]);

  const styles = {
    header:
      "flex justify-between items-center w-full my-2 mb-6 " + headerStyles,
    heading: "text-xl font-semibold truncate",
  };

  return (
    <div
      className={`font-poppins bg-white w-full h-full p-3 pl-4 ${containerStyles}`}
    >
      {enableHeader && (
        <header className={styles.header}>
          <h1 className={styles.heading}>{title}</h1>

          <div className="flex items-center space-x-3">
            <Notifications
              {...{
                toggle,
                setSingleToggle,
                notifications,
                setNotifications,
                userId: user?.id,
                role: type,
              }}
            />
            <Account
              toggle={toggle.account}
              setSingleToggle={setSingleToggle}
            />
          </div>
        </header>
      )}
      {children}
    </div>
  );
};

export default Page;
