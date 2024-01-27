import GeneralPage from "../GeneralPage";
import { base_url, token } from "../../utils/url";
import { useState, useEffect } from "react";
import { convertPropsToObject, fetchData } from "../../utils";
import { useParams } from "react-router-dom";

const neededProps = [{ from: "_id", to: "id" }, "description", "rating"];
const template = convertPropsToObject(neededProps);
const showAllReviews = `${base_url}/admin/station_reviews`;

const Reviews = () => {
  const { station_id } = useParams();
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

  const search = (e) => {
    const str = e.target.value;
    setSearchText(str.trim());

    if (str.trim() === "") {
      setPaginatedData((prev) => ({ ...prev, items: data }));
    } else {
      setPaginatedData((prev) => ({
        ...prev,
        items: data.filter((item) =>
          Object.keys(template).some((key) => {
            const matched = String(item?.[key])
              ?.toLowerCase()
              ?.includes(str?.toLowerCase());

            return matched;
          })
        ),
      }));
    }
  };

  const props = {
    title: "Reviews",
    actionCols: [],
    data,
    setData,
    template,
    isLoading,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by ID, Rating or Description",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    tableProps: {
      checkboxEnabled: false,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2  max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
  };

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("station_id", station_id);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetchData({
      neededProps,
      setIsLoading,
      requestOptions,
      url: showAllReviews,
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [station_id]);

  return <GeneralPage {...props} />;
};

export default Reviews;
