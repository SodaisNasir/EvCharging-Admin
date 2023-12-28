import React, { useContext, useEffect, useState } from "react";
import { CommonTable } from ".";
import { AppContext } from "../../context";
import { convertPropsToObject, fetchData } from "../../utils";
import { base_url } from "../../utils/url";

const neededProps = [
  "transaction_id",
  "payment_method",
  "amount",
  "type",
  { from: "created_at", to: "date/time" },
];
const template = convertPropsToObject(neededProps);
const showAllTransactions = `${base_url}/show-company-transaction/`;

const TransactionsTable = () => {
  const [data, setData] = useState(null);
  const { user } = useContext(AppContext);

  const props = {
    template,
    state: data,
    setState: setData,
  };

  useEffect(() => {
    fetchData({
      neededProps,
      url: showAllTransactions + user?.id,
      sort: (data) => data.sort((a, b) => b.id - a.id),
      callback: setData,
    });
  }, [user]);

  return (
    <section>
      <h2 className="mb-1 text-base font-semibold">Transactions</h2>
      <CommonTable {...props} />
    </section>
  );
};

export default TransactionsTable;
