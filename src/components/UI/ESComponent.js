import React from "react";
import { useSelector } from "react-redux";

const ESComponent = ({ isActive }) => {
  const existingScope = useSelector(
    (state) => state.customerReducer.singleCustomer.scope
  );

  const bothAreExist =
    existingScope?.refinishing?.is_part && existingScope?.installation?.is_part;
  return (
    <>
      {isActive ? (
        <div className=" bg-gray-200 absolute bottom-0 w-full h-[28px] right-[0px]">
          <div className="flex items-center justify-center">
            {/* mt-1 add in R and I conditionally if it is part  */}
            {existingScope?.refinishing?.is_part && (
              <>
                <div
                  className={`text-black font-normal mb-[12px]  text-[13px]
              
              `}
                >
                  E
                </div>
                <div className="border-l border-gray-400 h-[38px] mx-[6px]"></div>
              </>
            )}
            {/* {bothAreExist && (
              <div className="border-l border-gray-400 h-[38px] mx-[12px]"></div>
            )} */}
            {existingScope?.installation?.is_part && (
              <>
                <div
                  className={`text-black font-normal mb-[12px]  text-[13px]
             
                  `}
                >
                  S
                </div>
                <div className="border-l border-gray-400 h-[38px] mx-[6px]"></div>
              </>
            )}
            <div className="text-black font-normal mb-[12px]  text-[13px]">
              M
            </div>
          </div>
        </div>
      ) : (
        <div className=" bg-gray-200 absolute bottom-0 w-full h-[20px] right-[0px]">
          <div className="flex items-center justify-center">
            {existingScope?.refinishing?.is_part && (
              <>
                <div className="text-black font-normal mb-[20px] mt-[1px] text-[10px]">
                  E
                </div>
                <div className="border-l border-gray-400 h-[38px] mx-[4px]"></div>
              </>
            )}
            {/* {bothAreExist && (
              <div className="border-l border-gray-400 h-[38px] mx-[8px]"></div>
            )} */}
            {existingScope?.installation?.is_part && (
              <>
                <div className="text-black font-normal mb-[20px] mt-[1px] text-[10px]">
                  S
                </div>
                <div className="border-l border-gray-400 h-[38px] mx-[4px]"></div>
              </>
            )}
            <div className="text-black font-normal mb-[20px] mt-[1px] text-[10px]">
              M
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ESComponent;
