import React from "react";
import Loader from "../Loaders/Loader";

const Button = ({
  title,
  handleClick,
  type = "button",
  extraStyles = "",
  isLoading,
  disabled = false,
  children,
}) => {
  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center px-6 py-2 text-xs font-medium text-center text-white rounded-md bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500/50 disabled:opacity-70 disabled:py-0 disabled:hover:bg-blue-500 disabled:saturate-30 disabled:cursor-not-allowed ${extraStyles}`}
      type={type}
      disabled={disabled || isLoading}
    >
      {isLoading && <Loader extraStyles={"w-6 h-6 !bg-transparent !static"} />}
      {title}
      {children}
    </button>
  );
};

export default Button;
