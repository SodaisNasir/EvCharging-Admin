import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
  Ports
} from "../pages";
import { base_url } from "../utils/url";

// Router component handles the routing of the application
const Router = () => {
  const { user, setUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);


  const accessPrivateRoutes = (Page) => (user ? <Page /> : <AccessDenied />);
  const accessPublicRoutes = (Page) =>
    user ? <Navigate to="/stations" /> : <Page />;

  const login = async (email, password, role) => {
    setIsLoading(true);
    let json = null;

    try {
      let formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password);

      let requestOptions = {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(`${base_url}/admin/login`, requestOptions);
      json = await res.json();

      if (json.success) {
        let data = json.success.data;

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
  };

  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user"));

    if (user_data) {
      login(
        user_data.email || user_data.company_email,
        user_data.password,
        user_data.role
      );
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

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
            <Route path="/ports" element={accessPrivateRoutes(Ports)} />
            <Route path="/stations" element={accessPrivateRoutes(Stations)} />
            <Route path="/edit-profile" element={accessPrivateRoutes(EditProfile)} />
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
