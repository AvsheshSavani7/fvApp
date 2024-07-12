import React from "react";

const FloorPlan = ({ floorPlan }) => {
  return (
    <div className="break-avoid">
      <div className="flex item-center pl-2 p-1 pb-0 rounded-lg mt-4 ">
        <div className="text-black text-[25px] font-extrabold text-start font-lora">
          FLOOR PLAN
        </div>
      </div>
      <div
        className="ml-[15px] h-[1px] bg-[#3a3a3a] rounded-full"
        style={{ width: "calc(100% - 30px)" }}
      ></div>
      {Object.keys(floorPlan)?.map((floor) => {
        return (
          <div className="text-center text-[20px] mt-4 break-avoid">
            {floor}
            <img src={floorPlan[floor]} className="mt-4" />
          </div>
        );
      })}
    </div>
  );
};

export default FloorPlan;
