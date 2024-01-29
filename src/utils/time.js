import moment from "moment";

const convert24TimeTo12 = (time) => {
  // with moment.js
  return moment(time, "HH:mm").format("hh:mm A");
};

export { convert24TimeTo12 };
