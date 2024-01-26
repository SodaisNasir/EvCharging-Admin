import React, { useCallback, useContext, useState } from "react";
import { Button, Page } from "../../components";
import { base_url, image_base_url, token } from "../../utils/url";
import { AppContext } from "../../context";
import toast from "react-hot-toast";

const editProfileUrl = `${base_url}/admin/edit_profile`;

const EditProfile = () => {
  const { user, setUser } = useContext(AppContext);
  const [state, setState] = useState(user);
  const [image, setImage] = useState(user.profile_image);
  const [loading, setLoading] = useState(false);

  const keys = Object.keys(state).filter(
    (e) => e !== "__v" && e !== "password" && e !== "created_at"
  );

  const login = useCallback(
    async (email, password) => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

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
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error(err);
      }
    },
    [setUser]
  );

  console.log("user ==>", user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const formdata = new FormData();
      keys.forEach((key) => {
        formdata.append(key, state[key]);
        console.log(key, state[key]);
      });

      const requestOptions = {
        headers,
        method: "POST",
        redirect: "follow",
        body: formdata,
      };

      const res = await fetch(editProfileUrl, requestOptions);
      const json = await res.json();

      console.log("json", json);
      if (json.status) {
        toast.success("Profile updated successfully!");
        await login(user.email, user.password);

      } else {
        toast.error(json?.message || json?.error?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    if (key === "profile_image") {
      const file = e.target.files[0];

      setImage(URL.createObjectURL(file));
      setState({ ...state, profile_image: file });
    } else {
      setState({ ...state, [key]: value });
    }
  };

  return (
    <Page title="Edit Profile" enableHeader>
      <main className="max-w-md pb-10 mx-2 mt-10 sm:mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-center text-gray-700">
              Photo
            </label>
            <div className="flex flex-col items-center mt-1 text-xs">
              <div className="inline-block w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                {image || state.profile_image ? (
                  <img
                    className="w-full h-full text-gray-300"
                    src={image || image_base_url + state.profile_image}
                    alt="profile"
                  />
                ) : (
                  <svg
                    className="w-full h-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <input
                id="profile_image"
                type="file"
                accept="image/*"
                className="hidden"
                name="profile_image"
                onChange={handleChange}
              />
              <button
                onClick={() => document.getElementById("profile_image").click()}
                type="button"
                className="bg-white py-1.5 px-3 mt-2 border border-gray-300 rounded-md shadow-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
              >
                Change
              </button>
            </div>
          </div>

          {/* {keys.map(
            (key) =>
              key !== "_id" && (
                )
            )} */}
          <div className="col-span-2">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-700 capitalize"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                value={state.name}
                onChange={handleChange}
                className="p-2.5 w-full text-xs shadow-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700 capitalize"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="email"
                id="email"
                value={state.email}
                onChange={handleChange}
                className="p-2.5 w-full text-xs shadow-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="col-span-2 text-right">
            <Button
              type="submit"
              isLoading={loading}
              title={loading ? "Updating" : "Update"}
              extraStyles={loading ? "!py-2 !w-full" : "!py-3 !w-full"}
            />
          </div>
        </form>
      </main>
    </Page>
  );
};

export default EditProfile;
