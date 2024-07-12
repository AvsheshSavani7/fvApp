import React from "react";

const VerticalDivider = ({ className }) => {
  return (
    <div
      className={`${className} h-[390px] absolute left-1/2 translate-x-[-1px] top-0 sm:h-[645px] lg:h-[584px] flex justify-center items-center w-[2px] m-auto bg-gray-300 pt-6`}
    ></div>
  );
};

export default VerticalDivider;
