import React from "react";

const FloorPlanButton = (props) => {
  const { onClick, disabled, children, className } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-3 border-[1px] flex items-center justify-center border-gray-200 shadow-md rounded mx-1 bg-white text-black text-[12px] ${className}`}
    >
      {children}
    </button>
  );
};

export default FloorPlanButton;
