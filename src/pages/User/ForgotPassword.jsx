import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Page } from "../../components";
import { useContext } from "react";
import { AppContext } from "../../context";
import { base_url, token } from "../../utils/url";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { setOtpData } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [toggleBtn, setToggleBtn] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToggleBtn(true);
    let json = null;

    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const formdata = new FormData();
      formdata.append("email", email);

      let requestOptions = {
        headers,
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(`${base_url}/admin/verify_email`, requestOptions);
      json = await res.json();
      console.log("json", json);

      if (json.status) {
        const data = json.data;
        setOtpData({ email, ...data });

        console.log("data", data);

        navigate("/email-verification");
      } else {
        toast.error(
          json?.message.toLowerCase().includes("not found")
            ? "Email not found!"
            : json?.message,
          { duration: 1500 }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggleBtn(false);
    }
  };

  return (
    <Page title="Reset Password" extraClasses="pt-10 h-screen">
      <main className="flex justify-center w-full h-full p-3 font-poppins">
        <div className="w-full max-w-md p-4">
          <h2 className="mb-2 text-lg font-semibold">Reset Password</h2>

          <p className="mb-3 text-xs">
            Please enter your email address, and we will send you an OTP to
            confirm it.
          </p>

          <form onSubmit={handleSubmit} method="POST">
            <label
              htmlFor="email"
              className="block w-full mb-1 text-xs font-medium text-gray-900"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={email}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 mb-2.5 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 focus:outline-none block w-full p-2.5"
              placeholder="example@gmail.com"
              required={true}
            />

            <button
              type="submit"
              className="flex justify-center items-center w-full text-white bg-primary-400 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-100 font-medium rounded-lg text-xs px-5 py-2.5 text-center disabled:bg-primary-300 disabled:saturate-30 disabled:py-1 disabled:cursor-not-allowed"
              disabled={toggleBtn}
            >
              {toggleBtn && (
                <Loader
                  extraStyles="!static !inset-auto !block !scale-50 !bg-transparent !saturate-100"
                  loaderColor={toggleBtn ? "fill-primary-300" : ""}
                />
              )}
              Next
            </button>
          </form>
        </div>
      </main>
    </Page>
  );
};

export default ForgotPassword;
