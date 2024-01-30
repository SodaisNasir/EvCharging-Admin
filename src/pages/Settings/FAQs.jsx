import React, { useState, useEffect, useContext } from "react";
import { fetchData, getObjProperty, replaceParaWithDivs } from "../../utils";
import { Button, Loader, Page } from "../../components";
import { base_url, token } from "../../utils/url";
import Editor from "../../components/Editor";
import toast from "react-hot-toast";
import { AppContext } from "../../context";

const FAQs = () => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [state, setState] = useState({ value: "" });

  const permissions = user?.permissions;
  const hasEditAccess = getObjProperty(permissions, "settings.faqs.edit");

  const handleChange = (value) => setState({ ...state, value });
  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const formdata = new FormData();
      formdata.append("_id", state.id);
      formdata.append("html", replaceParaWithDivs(state.value));

      const requestOptions = {
        headers,
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(`${base_url}/common/edit_faqs`, requestOptions);
      const json = await res.json();
      console.log(json);

      if (json.status) {
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      headers,
      method: "POST",
      redirect: "follow",
    };

    fetchData({
      requestOptions,
      url: `${base_url}/common/fetch_faqs`,
      callback: (response) => {
        setState({ id: response._id, value: response.html });
      },
      setIsLoading: setLoading,
    });
  }, []);

  return (
    <Page
      title="FAQs"
      extraClasses="font-poppins p-3 md:px-5"
      headerStyles="!mb-0"
      enableHeader
    >
      <main className={"relative min-h-[70vh] pb-8"}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5">
              <Editor
                {...{
                  state: state.value,
                  handleChange,
                  readOnly: !hasEditAccess,
                }}
              />
            </div>

            <div className="flex justify-end">
              <Button
                title={updating ? "Updating..." : "Update"}
                handleClick={handleSubmit}
                disabled={loading || updating}
                extraStyles={updating ? "!py-2 mt-3" : "mt-3"}
              />
            </div>
          </>
        )}
      </main>
    </Page>
  );
};

export default FAQs;
