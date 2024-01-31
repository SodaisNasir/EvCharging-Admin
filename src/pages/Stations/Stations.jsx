import GeneralPage from "../GeneralPage";
import { base_url, token } from "../../utils/url";
import { useState, useEffect, useContext } from "react";
import { convert24TimeTo12, convertPropsToObject, fetchData, getObjProperty, modifyData } from "../../utils";
import { AppContext } from "../../context";
import toast from "react-hot-toast";

const neededProps = [
  { from: "_id", to: "_id" },
  "serial_no",
  "station_image",
  "station_name",
  "start_time",
  "end_time",
  { from: "location", to: "_location" },
  { from: "latitude", to: "_latitude" },
  { from: "longitude", to: "_longitude" },
];
const template = convertPropsToObject(neededProps);
const showAllStations = `${base_url}/admin/station_list`;
const editUrl = `${base_url}/admin/edit_station`;
const createUrl = `${base_url}/admin/create_station`;
const deleteUrl = `${base_url}/admin/delete_station`;

const Stations = () => {
  const { user } = useContext(AppContext);
  const [reload, setReload] = useState(false);
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

  const permissions = user?.permissions;
  const hasCreateAccess = user?.role_id === "super_admin" || getObjProperty(permissions, "stations.create");
  const hasDeleteAccess = user?.role_id === "super_admin" || getObjProperty(permissions, "stations.delete");
  const hasEditAccess = user?.role_id === "super_admin" || getObjProperty(permissions, "stations.edit");

  const search = (e) => {
    const str = e.target.value;
    setSearchText(str.trim());

    if (str.trim() === "") {
      setPaginatedData((prev) => ({ ...prev, items: data }));
    } else {
      setPaginatedData((prev) => ({
        ...prev,
        items: data.filter((item) =>
          Object.keys(template).some((key) =>
            String(item?.[key])?.toLowerCase()?.includes(str?.toLowerCase())
          )
        ),
      }));
    }
  };

  const uploadFields = [
    {
      key: "station_image",
      title: "Station Image",
    },
  ];

  const appendableFields = [
    {
      key: "start_time",
      appendFunc: (key, value, formdata) => {
        formdata.append(key, convert24TimeTo12(value));
      },
    },
    {
      key: "end_time",
      appendFunc: (key, value, formdata) => {
        formdata.append(key, convert24TimeTo12(value));
      },
    },
  ];

  const props = {
    title: "Stations",
    actionCols: ["Bookings", "Reviews", "Ports", "View", "Edit", "Delete"],
    data,
    setData,
    template,
    isLoading,
    deleteUrl,
    actions: {
      hasDeleteAccess,
      hasEditAccess,
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Name, Price, Location, lat...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      neededProps,
      initialState: template,
      createUrl,
      uploadFields,
      appendableFields,
      hideFields: ["location"],
      excludeFields: ["_id", "serial_no", "created_at", "updated_at"],
      successCallback: (json) => {
        setReload((prev) => !prev);
        toast.success(json.message);
      },
      gridCols: 2,
    },
    editModalProps: {
      editUrl,
      template,
      neededProps,
      uploadFields,
      hideFields: ["location", "_id"],
      excludeFields: ["serial_no", "created_at", "updated_at"],
      successCallback: (json) => {
        const updatedData = modifyData(json.data, neededProps, true);
        updatedData._latitude = updatedData._location.coordinates[0];
        updatedData._longitude = updatedData._location.coordinates[1];
        updatedData._location = updatedData._location.name;

        let stateCopy = [...data];
        stateCopy = stateCopy.map((e) =>
          e._id === updatedData._id ? updatedData : e
        );
        setData(stateCopy);
        setPaginatedData((prev) => ({ ...prev, items: stateCopy }));

        toast.success(json.message);
      },
      gridCols: 2,
    },
    viewModalProps: {
      excludeFields: ["created_at", "updated_at"],
      longFields: ["station_image"],
    },
    tableProps: {
      checkboxEnabled: false,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2  max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
    hasCreateAccess,
  };

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetchData({
      neededProps,
      setIsLoading,
      requestOptions,
      url: showAllStations,
      callback: (data) => {
        const newData = data.map((e) => {
          const _latitude = e._location.coordinates[0];
          const _longitude = e._location.coordinates[1];

          return {
            ...e,
            _location: e._location.name,
            _latitude,
            _longitude,
          };
        });
        console.log("newData", newData);
        setData(newData);
        setPaginatedData((prev) => ({ ...prev, items: newData }));
      },
    });
  }, [user, reload]);

  return <GeneralPage {...props} />;
};

export default Stations;
