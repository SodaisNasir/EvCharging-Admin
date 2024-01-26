import GeneralPage from "./GeneralPage";
import { base_url, token } from "../utils/url";
import { useState, useEffect } from "react";
import { convertPropsToObject, fetchData } from "../utils";
import toast from "react-hot-toast";

const neededProps = [
  { from: "_id", to: "id" },
  "vehicle_name",
  "model_no",
  {from: "date", to: "created_at"},
];
const template = convertPropsToObject(neededProps);
const showAllVehicles = `${base_url}/common/fetch_vehicles`;
const editUrl = `${base_url}/common/edit_vehicle`;
const createUrl = `${base_url}/common/create_vehicle`;
// const detailsUrl = `${base_url}/common/fetch_vehicle_detail`;

const Vehicles = () => {
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
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

  // const uploadFields = [
  //   {
  //     key: "port_image",
  //     title: "Port Image",
  //   },
  // ];

  const appendableFields = [
    {
      key: "id",
      appendFunc: (key, value, formdata) => {
        formdata.append("_id", value);
        console.log("_id", value);
      },
    },
  ];

  const props = {
    title: "Vehicles",
    actionCols: ["Edit"],
    data,
    setData,
    template,
    isLoading,
    // deleteUrl,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by ID, Name, Modal or Date",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      createUrl,
      neededProps,
      initialState: template,
      textAreaFields: ["port_description"],
      excludeFields: ["id", "created_at", "updated_at"],
      successCallback: (json) => {
        setReload((prev) => !prev);
        toast.success(json.message);
      },
      gridCols: 1,
    },
    editModalProps: {
      editUrl,
      template,
      neededProps,
      appendableFields,
      hideFields: ["id"],
      textAreaFields: ["port_description"],
      excludeFields: ["station_id", "created_at", "updated_at"],
      successCallback: (json) => {
        setReload((prev) => !prev);
        toast.success(json.message);
      },
      gridCols: 1,
    },
    tableProps: {
      checkboxEnabled: false,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2 max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
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
      neededProps,
      setIsLoading,
      requestOptions,
      url: showAllVehicles,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [reload]);

  return <GeneralPage {...props} />;
};

export default Vehicles;
