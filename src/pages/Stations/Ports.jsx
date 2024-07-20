import GeneralPage from "../GeneralPage";
import { base_url, token } from "../../utils/url";
import { useState, useEffect, useContext } from "react";
import { convertPropsToObject, fetchData, getObjProperty } from "../../utils";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../../context";

const neededProps = [
  "_id",
  "station_id",
  "charger_id",
  "connector_id",
  "port_image",
  "port_name",
  "port_type",
  "unit_price",
  "port_description",
];
const template = convertPropsToObject(neededProps);
const showAllPorts = `${base_url}/admin/station_port_list`;
const editUrl = `${base_url}/admin/edit_station_port`;
const createUrl = `${base_url}/admin/create_station_port`;
const deleteUrl = `${base_url}/admin/delete_port`;

const Ports = () => {
  const { user } = useContext(AppContext);
  const { station_id } = useParams();
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
            const amountMatched = dollarFields.some((e) =>
              ("$" + Number(item?.[e]).toFixed(2)).includes(str)
            );
            const othersMatched = String(item?.[key])
              ?.toLowerCase()
              ?.includes(str?.toLowerCase());

            return amountMatched || othersMatched;
          })
        ),
      }));
    }
  };

  const permissions = user?.permissions;
  const hasEditAccess = user?.role_id === "super_admin" || getObjProperty(permissions, "stations.ports.edit");
  const hasCreateAccess = user?.role_id === "super_admin" || getObjProperty(permissions, "stations.ports.create");
  const hasDeleteAccess = user?.role_id === "super_admin" || getObjProperty(permissions, "stations.ports.delete");

  const dollarFields = ["unit_price"];

  const initialState = {
    station_id,
    charger_id: "",
    connector_id: "",
    port_image: "",
    port_name: "",
    port_type: "",
    unit_price: "",
    port_description: "",
  };

  const uploadFields = [
    {
      key: "port_image",
      title: "Port Image",
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
    title: "Ports",
    actionCols: ["Edit", "Delete"],
    data,
    setData,
    template,
    isLoading,
    deleteUrl,
    actions: {
      hasEditAccess,
      hasDeleteAccess,
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by ID, Name, Type, Price...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      createUrl,
      neededProps,
      initialState,
      uploadFields,
      hideFields: ["station_id"],
      textAreaFields: ["port_description"],
      excludeFields: ["_id", "created_at", "updated_at"],
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
      appendableFields,
      hideFields: ["_id"],
      textAreaFields: ["port_description"],
      excludeFields: ["station_id", "created_at", "updated_at"],
      successCallback: (json) => {
        setReload((prev) => !prev);
        toast.success(json.message);
      },
      gridCols: 2,
    },
    tableProps: {
      checkboxEnabled: false,
      dollarFields,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2 max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
    hasCreateAccess,
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
      url: showAllPorts,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [station_id, reload]);

  return <GeneralPage {...props} />;
};

export default Ports;
