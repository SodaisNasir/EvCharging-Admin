import React, { useCallback, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout, MainLoader } from "../components";
import { AppContext } from "../context";
import {
  Page404,
  Login,
  EditProfile,
  ChangePassword,
  ForgotPassword,
  EmailVerification,
  AccessDenied,
  Stations,
  Bookings,
  Ports,
  Users,
  Reviews,
  Vehicles,
  CountriesCodes,
  TermsAndConditions,
  FAQs,
  PrivacyPolicy,
} from "../pages";
import { base_url } from "../utils/url";
import CountryCodes from "../pages/Settings/CountryCodes";

// Router component handles the routing of the application
const Router = () => {
  const { user, setUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  const privateRoutes = (Page) => (user ? <Page /> : <AccessDenied />);
  const accessPublicRoutes = (Page) =>
    user ? <Navigate to="/stations" /> : <Page />;

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);

      try {
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTg4MTAyMjFkYWU3N2Nk"
        );

        const formdata = new FormData();
        formdata.append("email", email);
        formdata.append("password", password);

        const requestOptions = {
          headers: myHeaders,
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        const res = await fetch(`${base_url}/admin/login`, requestOptions);
        const json = await res.json();
        console.log("json", json);

        if (json.status) {
          const data = json.data;
          console.log("user", data);

          setUser(data);
        } else {
          localStorage.clear();
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        localStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user"));

    if (user_data) {
      login(user_data.email, user_data.password);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [login]);

  return (
    <>
      <MainLoader
        extraStyles={`${isLoading ? "" : "!opacity-0 !pointer-events-none"}`}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Layout /> : <Navigate to="/login" replace />}
          >
            <Route path="/stations">
              <Route index element={privateRoutes(Stations)} />
              <Route
                path="/stations/:station_id/reviews"
                element={privateRoutes(Reviews)}
              />
              <Route
                path="/stations/:station_id/ports"
                element={privateRoutes(Ports)}
              />
              <Route
                path="/stations/:station_id/bookings"
                element={privateRoutes(Bookings)}
              />
            </Route>
            <Route path="/users" element={privateRoutes(Users)} />
            <Route path="/vehicles" element={privateRoutes(Vehicles)} />

            <Route>
              <Route
                path="/settings/country-codes"
                element={privateRoutes(CountryCodes)}
              />
              <Route
                path="/settings/terms-and-conditions"
                element={privateRoutes(TermsAndConditions)}
              />
              <Route path="/settings/faqs" element={privateRoutes(FAQs)} />
              <Route
                path="/settings/privacy-policy"
                element={privateRoutes(PrivacyPolicy)}
              />
            </Route>
            <Route path="/edit-profile" element={privateRoutes(EditProfile)} />
          </Route>

          <Route path="*" element={<Page404 />} />
          <Route index path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/forgot-password"
            element={accessPublicRoutes(ForgotPassword)}
          />
          <Route
            path="/email-verification"
            element={accessPublicRoutes(EmailVerification)}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
