import React, { useEffect, useState } from "react";
import Account from "./Account";

const Page = ({
  title,
  containerStyles = "",
  headerStyles = "",
  children,
  enableHeader,
}) => {
  const initialState = { account: false, notifications: false };
  const [toggle, setToggle] = useState(initialState);

  const setSingleToggle = (key, value) =>
    setToggle({ ...initialState, [key]: value });

  useEffect(() => {
    document.title = title + " - EvCharging Administator";

    return () => {
      document.title = "EvCharging Administator";
    };
  }, [title]);

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
          <Account toggle={toggle.account} setSingleToggle={setSingleToggle} />
        </header>
      )}
      {children}
    </div>
  );
};

export default Page;
