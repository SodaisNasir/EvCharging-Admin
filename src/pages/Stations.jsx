import GeneralPage from "./GeneralPage";
import { base_url } from "../utils/url";
import { useState, useEffect, useContext } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../utils";
import { AppContext } from "../context";

const neededProps = [
  "id",
  "station_name",
  "unit_price",
  "latitude",
  "longitude",
];
const template = convertPropsToObject(neededProps);
const showAllStations = `${base_url}/admin/admin/station_list`;
const editUrl = `${base_url}/admin/edit-worker-portal`;
const createUrl = `${base_url}/admin/create_station/`;
const blockUrl = `${base_url}/admin/block-worker-portal`;
const deleteUrl = (data) => {
  const formdata = new FormData();
  formdata.append("type", "User");
  const url = `${base_url}/admin/delete-api/${data?.id}`;
  const requestOptions = {
    headers: {
      accept: "application/json",
    },
    method: "POST",
    body: formdata,
    redirect: "follow",
  };
  return [url, requestOptions];
};

const Stations = () => {
  const { user } = useContext(AppContext);
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
          Object.keys(template).some((key) =>
            String(item?.[key])?.toLowerCase()?.includes(str?.toLowerCase())
          )
        ),
      }));
    }
  };

  const initialState = {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    _password: "",
    phone_number: "",
    _work_type: "",
    _address: "",
    _project_manager: user?.id,
    status: "",
    _type: "Project Manager",
  };

  const editModalTemplate = {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    _address: "",
    _project_manager: user?.id,
    _work_type: "",
  };

  const dropdownFields = [
    {
      key: "status",
      title: "status",
      arr: ["Active", "InActive"],
      getOption: (val) => val,
      required: true,
    },
  ];

  const inputFields = [
    {
      key: "_password",
      pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$",
      title:
        "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be between 8 and 20 characters long.",
    },
    {
      key: "phone_number",
      pattern: "^\\+(?:[0-9] ?){6,14}[0-9]$",
      title: "Should follow this pattern: +21 123 4567 890",
    },
  ];

  const props = {
    title: "Stations",
    actionCols: ["View", "Edit", "Delete"],
    data,
    setData,
    template,
    isLoading,
    blockUrl,
    deleteUrl,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Name, Email, Phone Num...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      neededProps,
      inputFields,
      initialState,
      dropdownFields,
      textAreaFields: ["_address"],
      createUrl,
      hideFields: ["_type", "_project_manager"],
      excludeFields: ["id", "created_at", "updated_at"],
      successCallback: (json) => {
        const data = modifyData(json.success.data, neededProps, true);
        setData((prev) => [data, ...prev]);
        setPaginatedData((prev) => ({
          ...prev,
          items: [data, ...prev.items],
        }));
      },
    },
    editModalProps: {
      editUrl,
      template: editModalTemplate,
      neededProps,
      dropdownFields,
      excludeFields: [
        "id",
        "_type",
        "status",
        "created_at",
        "updated_at",
        "_password",
      ],
      inputFields,
      hideFields: ["_project_manager"],
      textAreaFields: ["_address"],
      successCallback: (json) => {
        let stateCopy = [...data];
        const updatedData = json.success.data;
        stateCopy = stateCopy.map((e) =>
          e.id === updatedData.id
            ? modifyData(updatedData, neededProps, true)
            : e
        );
        setData(stateCopy);
        setPaginatedData((prev) => ({ ...prev, items: stateCopy }));
      },
    },
    viewModalProps: {
      excludeFields: ["created_at", "updated_at", "_type", "_password"],
      longFields: ["_address", "_device_token"],
    },
    tableProps: {
      checkboxEnabled: true,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2  max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
  };

  useEffect(() => {
    const formdata = new FormData();
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetchData({
      neededProps,
      setIsLoading,
      requestOptions,
      url: showAllStations,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [user]);

  return <GeneralPage {...props} />;
};

export default Stations;
