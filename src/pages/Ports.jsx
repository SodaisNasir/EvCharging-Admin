import GeneralPage from "./GeneralPage";
import { base_url } from "../utils/url";
import { useState, useEffect, useContext } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../utils";
import { AppContext } from "../context";

const neededProps = [
  "id",
  // "_role_id",
  // "sin_number",
  { from: "firstname", to: "first_name" },
  { from: "lastname", to: "last_name" },
  "email",
  // "_email_verified_at",
  "phone_number",
  "_project_manager",
  "_password",
  "_address",
  // "_city",
  // "_salary",
  // "_primary_trade",
  // "_secondary_trade",
  // "_vendor",
  "_work_type",
  "status",
  "_type",
];
const template = convertPropsToObject(neededProps);
const showAllWorkers = `${base_url}/get-user/`;
const editUrl = `${base_url}/edit-worker-portal`;
const createUrl = `${base_url}/create-workers/`;
const blockUrl = `${base_url}/block-worker-portal`;
const notificationUrl = `${base_url}/sendnotify/`;
const notificationUrlBulk = `${base_url}/send-bulk-notificaton`;
const deleteUrl = (data) => {
  const formdata = new FormData();
  formdata.append("type", "User");
  const url = `${base_url}/delete-api/${data?.id}`;
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

const Ports = () => {
  const { user } = useContext(AppContext);
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
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
      key: "project_manager",
      title: "project_manager",
      arr: managers,
      getOption: (val) => `${val?.firstname} ${val?.lastname}`,
      getValue: (val) => val?.id,
      required: true,
    },
    {
      key: "status",
      title: "status",
      arr: ["Active", "InActive"],
      getOption: (val) => val,
      required: true,
    },
    {
      title: "work_type",
      key: "_work_type",
      arr: workTypes,
      getOption: (val) => val?.name,
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
    title: "Ports",
    actionCols: ["View", "Edit", "Push Notification", "Block/Unblock"],
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
      createUrl: createUrl + user?.id,
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
    notificationModalProps: {
      notificationUrl,
      notificationUrlBulk,
    },
    tableProps: {
      checkboxEnabled: true,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2  max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch(`${base_url}/show-pm/${user?.company_id}`);
        const json = await res.json();

        if (json.success) {
          const data = json.success.data;
          setManagers(data);
          // console.log("managers data ==>", data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchWorkTypes = async () => {
      try {
        const res = await fetch(base_url + "/get-work");
        const json = await res.json();

        if (json.success) {
          const data = json.success.data;
          setWorkTypes(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const formdata = new FormData();
    formdata.append("type", "Project Manager");
    formdata.append("user", "worker");
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetchData({
      neededProps,
      setIsLoading,
      requestOptions,
      url: showAllWorkers + user?.id,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });

    fetchManagers();
    fetchWorkTypes();
  }, [user]);

  return <GeneralPage {...props} />;
};

export default Ports;
