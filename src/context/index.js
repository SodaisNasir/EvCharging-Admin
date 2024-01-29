import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [otpData, setOtpData] = useState(null);
  console.log(user);

  useEffect(() => {
    let timeoutId;
    if (otpData) {
      timeoutId = setTimeout(() => {
        setOtpData(null);
      }, 100000);
    }

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [otpData]);

  return (
    <AppContext.Provider value={{ user, setUser, otpData, setOtpData }}>
      {children}
    </AppContext.Provider>
  );
};
