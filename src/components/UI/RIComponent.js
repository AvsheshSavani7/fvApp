import React from "react";
import { useSelector } from "react-redux";

const RIComponent = ({ isActive }) => {
  const existingScope = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );

  const bothAreExist =
    existingScope?.refinishing?.is_part && existingScope?.installation?.is_part;

  return (
    <>
      {isActive ? (
        <div className=" bg-gray-200 absolute bottom-0 w-full h-[28px] right-[1px]">
          <div className="flex items-center justify-center">
            {/* mt-1 add in R and I conditionally if it is part  */}
            {existingScope?.refinishing?.is_part && (
              <div
                className={`text-black font-normal mb-[12px]  text-sm
              ${!bothAreExist && "mt-1"}
              `}
              >
                R
              </div>
            )}
            {bothAreExist && (
              <div className="border-l border-gray-400 h-[38px] mx-[12px]"></div>
            )}
            {existingScope?.installation?.is_part && (
              <div
                className={`text-black font-normal mb-[12px]  text-sm
              ${!bothAreExist && "mt-1"}
              `}
              >
                I
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className=" bg-gray-200 absolute bottom-0 w-full h-[20px] right-[1px]">
          <div className="flex items-center justify-center">
            {existingScope?.refinishing?.is_part && (
              <div className="text-black font-normal mb-[20px] mt-[2px] text-xs">
                R
              </div>
            )}
            {bothAreExist && (
              <div className="border-l border-gray-400 h-[38px] mx-[8px]"></div>
            )}
            {existingScope?.installation?.is_part && (
              <div className="text-black font-normal mb-[20px] mt-[2px] text-xs">
                I
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RIComponent;
