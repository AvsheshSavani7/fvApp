import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const CLFurnitureSummaryProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  activeRepairObj,
  setActiveRoomFurnitureIds,
  activeRoomFurnitureIds,
}) => {
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );

  const handleClickRoomFurnitureBtn = () => {
    let lstFurnitureIds = [...activeRoomFurnitureIds];
    if (lstFurnitureIds?.includes(roomObj?.id)) {
      lstFurnitureIds = lstFurnitureIds.filter((id) => id != roomObj?.id);
    } else {
      lstFurnitureIds.push(roomObj?.id);
    }
    setActiveRoomFurnitureIds(lstFurnitureIds);
  };

  return (
    <>
      {checkListActiveBtn === "kitchen" ? (
        <>
          <ProjectMotionBtn
            className={`decoration-black ${className} relative`}
            style={{
              backgroundColor:
                roomObj.type === "Kitchen" ? `#1E2E5A` : "#D8D8D8",
              zIndex: "1 !important",
            }}
            type={type}
          >
            <GetRoomIcon
              iconName={buttonName}
              data={{
                color: "white",
              }}
            />
            <Text className={`text-white text-[13px]`}>{roomObj?.name}</Text>
            {activeRoomFurnitureIds?.includes(roomObj?.id) &&
              roomObj.furniture_ids?.length > 0 && (
                <motion.div
                  className={`absolute -bottom-0.5 -right-0.5 rounded-full padding-2.5 w-5 h-5 bg-[#009DC2] text-[14px] text-white`}
                  transition={{ duration: 1 }}
                >
                  {roomObj.furniture_ids?.length}
                </motion.div>
              )}
          </ProjectMotionBtn>
        </>
      ) : checkListActiveBtn === "standerd"?(
        <ProjectMotionBtn
          className={`decoration-black ${className} relative`}
          style={{
            backgroundColor: `${
              activeRoomFurnitureIds?.includes(roomObj?.id)
                ? "#1E2E5A"
                : "white"
            }`,
            zIndex: "1 !important",
          }}
          type={type}
          onClick={handleClickRoomFurnitureBtn}
        >
          <GetRoomIcon
            iconName={buttonName}
            data={
              activeRoomFurnitureIds?.includes(roomObj?.id)
                ? {
                    color: "white",
                  }
                : {}
            }
          />
          <Text
            className={`${
              activeRoomFurnitureIds?.includes(roomObj?.id)
                ? "!text-white"
                : "!text-black"
            } text-[13px]`}
          >
            {roomObj?.name}
          </Text>
          {activeRoomFurnitureIds?.includes(roomObj?.id) &&
            roomObj.furniture_ids?.length > 0 && (
              <motion.div
                className={`absolute -bottom-0.5 -right-0.5 rounded-full padding-2.5 w-5 h-5 bg-[#009DC2] text-[14px] text-white`}
                transition={{ duration: 1 }}
              >
                {roomObj.furniture_ids?.length}
              </motion.div>
            )}
        </ProjectMotionBtn>
      ):<></>}
    </>
  );
};

export default CLFurnitureSummaryProjectButton;

CLFurnitureSummaryProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
