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
  CountryCodes,
  TermsAndConditions,
  FAQs,
  PrivacyPolicy,
  SubAdmin,
} from "../pages";
import { base_url } from "../utils/url";
import { homeRoute } from "../constants/data";
import { parseJson } from "../utils";

// Router component handles the routing of the application
const Router = () => {
  const { user, setUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const permissions = user?.permissions;

  const privateRoutes = (Page, path) => {
    const isBool = typeof path === "boolean";
    const hasPermission = isBool
      ? path
      : permissions
      ? path
          .split(".")
          .reduce(
            (acc, curr, indx) =>
              indx === 0 ? (acc = permissions?.[curr]) : (acc = acc?.[curr]),
            ""
          )
      : true;

    return hasPermission ? <Page /> : <AccessDenied />;
  };
  const publicRoutes = (Page) =>
    user ? <Navigate to={homeRoute} /> : <Page />;

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
          let data = json.data;
          if (data.permissions && data.permissions !== "undefined") {
            data.permissions = parseJson(data.permissions);
          }

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
              <Route index element={privateRoutes(Stations, "stations.view")} />
              <Route
                path="/stations/:station_id/reviews"
                element={privateRoutes(Reviews, "stations.reviews")}
              />
              <Route
                path="/stations/:station_id/ports"
                element={privateRoutes(Ports, "stations.ports.view")}
              />
              <Route
                path="/stations/:station_id/bookings"
                element={privateRoutes(Bookings, "stations.bookings.view")}
              />
            </Route>
            <Route path="/users" element={privateRoutes(Users, "users.view")} />
            <Route path="/access">
              <Route
                index
                element={privateRoutes(SubAdmin, "access.sub_admin.view")}
              />
            </Route>
            <Route
              path="/vehicles"
              element={privateRoutes(Vehicles, "vehicles.view")}
            />

            <Route path="/settings">
              <Route
                index
                element={privateRoutes(
                  CountryCodes,
                  "settings.country_codes.view"
                )}
              />
              <Route
                path="/settings/terms-and-conditions"
                element={privateRoutes(
                  TermsAndConditions,
                  "settings.terms_and_conditions.view"
                )}
              />
              <Route
                path="/settings/faqs"
                element={privateRoutes(FAQs, "settings.faqs.view")}
              />
              <Route
                path="/settings/privacy-policy"
                element={privateRoutes(
                  PrivacyPolicy,
                  "settings.privacy_policy.view"
                )}
              />
            </Route>
            <Route
              path="/edit-profile"
              element={privateRoutes(EditProfile, true)}
            />
          </Route>

          <Route path="*" element={<Page404 />} />
          <Route index path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/forgot-password"
            element={publicRoutes(ForgotPassword)}
          />
          <Route
            path="/email-verification"
            element={publicRoutes(EmailVerification)}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
