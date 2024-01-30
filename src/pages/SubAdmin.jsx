import { useContext } from "react";
import { base_url, token } from "../utils/url";
import { useState, useEffect } from "react";
import { convertPropsToObject, fetchData, getObjProperty } from "../utils";
import { defaultPermissions } from "../constants/data";
import { AppContext } from "../context";
import GeneralPage from "./GeneralPage";
import toast from "react-hot-toast";

const neededProps = [
  "_id",
  "profile_image",
  "name",
  "email",
  "password",
  { from: "role_id", to: "role" },
  "_permissions",
  "_admin_id",
];
const template = convertPropsToObject(neededProps);
const showAllSubAdmins = `${base_url}/admin/sub_admin_list`;
const editUrl = `${base_url}/admin/edit_sub_admin_role`;
const createUrl = `${base_url}/admin/sub_admin_register`;

const SubAdmin = () => {
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
  const hasCreateAccess = getObjProperty(
    permissions,
    "access.sub_admin.create"
  );
  const hasEditAccess = getObjProperty(permissions, "access.sub_admin.edit");
  const hasPermissionsAccess = getObjProperty(
    permissions,
    "access.sub_admin.permissions"
  );

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
            if (key !== "_permissions" && key !== "profile_image") {
              const matched = String(item?.[key])
                ?.toLowerCase()
                ?.includes(str?.toLowerCase());

              return matched;
            }

            return false;
          })
        ),
      }));
    }
  };

  const createTemplate = {
    profile_image: "",
    name: "",
    email: "",
    password: "",
    role: "",
    _permissions: JSON.stringify(defaultPermissions),
    _admin_id: user?.admin_id,
  };

  const uploadFields = [
    {
      key: "profile_image",
      title: "Profile Image",
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
    title: "Sub Admin",
    actionCols: ["Permissions", "Edit"],
    data,
    setData,
    template,
    isLoading,
    actions: {
      hasEditAccess,
      hasPermissionsAccess,
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Name, Email, Password, or Role",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      createUrl,
      neededProps,
      uploadFields,
      initialState: createTemplate,
      hideFields: ["_permissions", "_admin_id"],
      excludeFields: ["_id", "created_at", "updated_at"],
      successCallback: (json, state) => {
        setData((prev) => [state, ...prev]);
        setPaginatedData((prev) => ({ ...prev, items: [state, ...prev] }));
        toast.success("Sub admin created successfuly!");
      },
      gridCols: 1,
    },
    editModalProps: {
      editUrl,
      template,
      neededProps,
      uploadFields,
      appendableFields,
      hideFields: ["_admin_id", "role", "_permissions", "_id"],
      excludeFields: ["created_at", "updated_at"],
      successCallback: (json, state) => {
        setReload((prev) => !prev);
        toast.success("Sub admin updated successfuly!");
      },
      gridCols: 1,
    },
    permissionsModalProps: {
      url: editUrl,
      successCallback: (json, state) => {
        setReload((prev) => !prev);
        toast.success("Permissions updated successfuly!");
      },
      gridCols: 1,
    },
    tableProps: {
      checkboxEnabled: false,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2 max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
    hasCreateAccess,
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
      url: showAllSubAdmins,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [reload]);

  return <GeneralPage {...props} />;
};

export default SubAdmin;
