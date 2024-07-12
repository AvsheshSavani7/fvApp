import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const CLRepairSummaryButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  setRoomRepairs,
  roomRepairs,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  var bgColor = roomObj?.id === roomRepairs.roomId ? "#1A65D6" :roomObj?.repair_ids?.length === 0 ? "#D8D8D8":"";

  const handleRoomRepairsClick = (room) => {
    if (room.repair_ids.length > 0) {
      let filteredRepairs = singleCustomerData.repairs.filter(
        (repair) => repair.within_room_id === room?.id
      );

      setRoomRepairs({ roomId: room?.id, repairs: filteredRepairs });
    } else {
      setRoomRepairs({ roomId: room?.id, repairs: [] });
    }
  };

  return (
    <>
      <ProjectMotionBtn
        className={` decoration-black ${className} `}
        style={
          bgColor
            ? { backgroundColor: `${bgColor}` }
            : { backgroundColor: "white" }
        }
        type={type}
        onClick={() => roomObj?.repair_ids?.length !== 0 ? handleRoomRepairsClick(roomObj) : null}
      >
        <GetRoomIcon
          iconName={roomObj?.type || roomObj?.name}
          data={bgColor ? { color: "white" } : { color: "black" }}
        />
        <Text className={`${bgColor ? "!text-white" : "text-black"} text-[13px]`}>
          {roomObj?.name}
        </Text>
      </ProjectMotionBtn>
    </>
  );
};

export default CLRepairSummaryButton;

CLRepairSummaryButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
