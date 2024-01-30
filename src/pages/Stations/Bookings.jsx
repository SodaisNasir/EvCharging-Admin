import GeneralPage from "../GeneralPage";
import { base_url, token } from "../../utils/url";
import { useState, useEffect, useContext } from "react";
import {
  convertPropsToObject,
  fetchData,
  getObjProperty,
  modifyData,
} from "../../utils";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context";

const neededProps = [
  "_id",
  "_user_id",
  "_station_id",
  "_port_id",
  "transaction_id",
  "amount",
  "start_time",
  "end_time",
  "date",
  "_account_type",
  "status",
];
const template = convertPropsToObject(neededProps);
const showAllBookings = `${base_url}/admin/station_detail`;
const cancelUrl = `${base_url}/admin/cancel_booking`;

const Bookings = () => {
  const { user } = useContext(AppContext);
  const { station_id } = useParams();
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  const [station, setStation] = useState(null);
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
  const hasCancelBookingAccess = getObjProperty(permissions, "stations.bookings.cancel");

  const dollarFields = ["amount"];

  const props = {
    title: `Bookings ${station ? "- " + station.station_name : ""}`,
    actionCols: ["View", "Cancel Booking"],
    data,
    setData,
    template,
    isLoading,
    actions: {
      cancelUrl,
      hasCancelBookingAccess,
    },
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by IDs, Amount, Time, Date...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    tableProps: {
      checkboxEnabled: false,
      dollarFields,
    },
    headerStyles:
      "min-[490px]:flex-row min-[490px]:space-y-0 min-[490px]:space-x-2  max-[490px]:flex-col max-[490px]:space-y-2 max-[490px]:space-x-0 max-[840px]:flex-col max-[840px]:space-y-2 max-[840px]:space-x-0 !items-baseline",
  };

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("_id", station_id);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetchData({
      setIsLoading,
      requestOptions,
      url: showAllBookings,
      callback: (data) => {
        const bookings = modifyData(data.bookings, neededProps, false);
        setStation(data);
        setData(bookings);
        setPaginatedData((prev) => ({ ...prev, items: bookings }));
      },
    });
  }, [station_id, reload]);

  return <GeneralPage {...props} />;
};

export default Bookings;
