import React from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { base_url, token } from "../../utils/url";
import { useContext } from "react";
import { AppContext } from "../../context";
import { Button, Page } from "../../components";
import toast from "react-hot-toast";

const Login = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [toggleBtn, setToggleBtn] = useState(false);
  const [password, setPassword] = useState({ isVisible: false, value: "" });

  if (user) {
    return <Navigate to="/stations" replace />;
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword({ ...password, value });
    }
  };

  const togglePassword = () =>
    setPassword((prev) => ({ ...prev, isVisible: !prev.isVisible }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setToggleBtn(true);
    let json = null;

    try {
      const myHeaders = new Headers();
      // myHeaders.append("Content-Type", "multipart/form-data");
      // myHeaders.append("Accept", "multipart/form-data");
      myHeaders.append(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTg4MTAyMjFkYWU3N2Nk"
      );

      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password.value);
      // const data = {
      //   id: 1,
      //   first_name: "Mateen",
      //   last_name: "Ahmed",
      //   role: "Admin",
      //   email,
      //   password: password.value,
      //   phone: "0987654321",
      //   image: "image",
      // };
      // localStorage.setItem("user", JSON.stringify(data));
      // setUser(data);

      const res = await fetch(`${base_url}/admin/login`, {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      });

      json = await res.json();

      if (json.status) {
        let data = json.data;

        toast.success("Login successful!", { duration: 2000 });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);

        setTimeout(() => {
          navigate("/stations");
        }, 2000);
      } else {
        toast.error(json.message, { duration: 2000 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggleBtn(false);
    }
  };

  return (
    <Page
      title="Login"
      containerStyles="!h-screen !w-screen flex justify-center items-center"
    >
      <main className="w-full max-w-sm mx-4">
        <section className="w-full overflow-hidden bg-white border rounded-lg shadow-2xl pb-9">
          <div className="px-6">
            <h1 className="my-5 text-xl font-bold text-center text-blue-600">
              EvCharging Administator
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={email}
                  className="block w-full px-4 py-3 text-xs font-medium text-gray-900 bg-gray-100 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 caret-blue-400"
                  placeholder="Email"
                  required={true}
                />
              </div>
              <div className="flex items-center w-full mb-1 overflow-hidden text-xs font-medium text-gray-900 bg-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <input
                  type={password.isVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  onChange={handleChange}
                  value={password.value}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-100 outline-none caret-blue-400"
                  placeholder="Password"
                  required={true}
                />
                <div className="w-10 text-lg text-blue-500">
                  {password.isVisible ? (
                    <AiFillEyeInvisible
                      onClick={togglePassword}
                      className="cursor-pointer"
                    />
                  ) : (
                    <AiFillEye
                      onClick={togglePassword}
                      className="cursor-pointer"
                    />
                  )}
                </div>
              </div>
              <div className="w-full text-right text-[11px] font-medium mb-3 mt-2">
                <Link
                  to="/forgot-password"
                  className="hover:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                isLoading={toggleBtn}
                type="submit"
                title={toggleBtn ? "Logging in" : "Login"}
                extraStyles={toggleBtn ? "!py-2 !w-full" : "!py-3 !w-full"}
              />
            </form>
          </div>
        </section>
      </main>
    </Page>
  );
};

export default Login;
