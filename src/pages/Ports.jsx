import GeneralPage from "./GeneralPage";
import { base_url } from "../utils/url";
import { useState, useEffect, useContext } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../utils";
import { AppContext } from "../context";

const neededProps = ["station_id", "port_type", "slots"];
const template = convertPropsToObject(neededProps);
const showAllPorts = `${base_url}/admin/station_port_list`;
const editUrl = `${base_url}/admin/edit_station_port`;
const createUrl = `${base_url}/admin/create_station_port`;
const deleteUrl = (data) => {
  const url = `${base_url}/admin/station_port_list/${data?.id}`;
  const requestOptions = {
    headers: {
      accept: "application/json",
    },
    method: "POST",
    redirect: "follow",
  };
  return [url, requestOptions];
};

const Ports = () => {
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
    station_id: "",
    port_type: "",
    slots: "",
  };

  const props = {
    title: "Stations",
    actionCols: ["Edit", "Delete"],
    data,
    setData,
    template,
    isLoading,
    deleteUrl,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by ID, Port or Slots",
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
      hideFields: [],
      excludeFields: ["id", "created_at", "updated_at"],
      successCallback: (json) => {
        const data = modifyData(json.success.data, neededProps, true);
        setData((prev) => [data, ...prev]);
        setPaginatedData((prev) => ({
          ...prev,
          items: [data, ...prev.items],
        }));
      },
      gridCols: 1,
    },
    editModalProps: {
      editUrl,
      neededProps,
      hideFields: [],
      template: initialState,
      excludeFields: ["id", "created_at", "updated_at"],
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
      gridCols: 1,
    },
    // viewModalProps: {
    //   excludeFields: ["created_at", "updated_at"],
    // longFields: ["_address", "_device_token"],
    // },
    tableProps: {
      checkboxEnabled: false,
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
      url: showAllPorts,
      sort: (data) => data?.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, [user]);

  return <GeneralPage {...props} />;
};

export default Ports;
