import GeneralPage from "./GeneralPage";
import { base_url, token } from "../utils/url";
import { useState, useEffect, useContext } from "react";
import { convertPropsToObject, fetchData, getObjProperty } from "../utils";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../context";

const neededProps = [
  "_id",
  "_social_id",
  "profile_image",
  "name",
  "phone",
  "email",
  "_country_code_id",
  "_notification_token",
  "_bike_mode",
  "status",
  { from: "date", to: "joined_at" },
];
const template = convertPropsToObject(neededProps);
const showAllUsers = `${base_url}/admin/users`;
const editUrl = `${base_url}/admin/edit_user_detail`;

const Users = () => {
  const { station_id } = useParams();
  const { user } = useContext(AppContext);
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

  const permissions = user?.permissions;
  const hasEditAccess = getObjProperty(permissions, "users.edit");

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
            const hasMatched = String(item?.[key])
              ?.toLowerCase()
              ?.includes(str?.toLowerCase());

            return hasMatched;
          })
        ),
      }));
    }
  };

  const uploadFields = [
    {
      key: "profile_image",
      title: "Profile Image",
    },
  ];

  const dropdownFields = [
    {
      key: "status",
      title: "Status",
      arr: ["active", "suspend", "delete"],
      getOption: (val) => val,
    },
  ];

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
    title: "Users",
    actionCols: ["View", "Edit"],
    data,
    setData,
    template,
    isLoading,
    actions: {
      hasEditAccess,
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by IDs, Name, Phone, Email...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    editModalProps: {
      editUrl,
      template,
      neededProps,
      uploadFields,
      dropdownFields,
      appendableFields,
      hideFields: ["_id"],
      excludeFields: [
        "_social_id",
        "_country_code_id",
        "_notification_token",
        "joined_at",
      ],
      successCallback: (json) => {
        setReload((prev) => !prev);
        toast.success(json.message);
      },
      gridCols: 2,
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
      url: showAllUsers,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [station_id, reload]);

  return <GeneralPage {...props} />;
};

export default Users;
