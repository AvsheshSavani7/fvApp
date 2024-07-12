import React from "react";

const Divider = ({ className }) => {
  return (
    <div
      className={`h-[1px] bg-gray-200 w-full ${className}`}
    ></div>
  );
};

export default Divider;
