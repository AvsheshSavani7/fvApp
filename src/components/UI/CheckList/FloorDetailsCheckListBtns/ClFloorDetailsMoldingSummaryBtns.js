import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import ProjectMotionBtn from "../../ProjectMotionBtn";
import { useSelector } from "react-redux";

const CLFloorDetailsMoldingSummaryBtns = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  setRoomMolding,
  roomMolding,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  var bgColor =
    roomObj?.id === roomMolding.roomId
      ? "#1A65D6"
      : !roomObj?.molding_id
      ? "#D8D8D8"
      : "";

  const handleRoomRepairsClick = (room) => {
    if (room?.molding_id?.length) {
      let findMolding = singleCustomerData?.molding?.find(
        (molding) => molding.id === room?.molding_id
      );

      setRoomMolding({ roomId: room?.id, molding: findMolding });
    } else {
      setRoomMolding({ roomId: room?.id, molding: {} });
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
        onClick={() =>
          roomObj?.molding_id ? handleRoomRepairsClick(roomObj) : null
        }
      >
        <GetRoomIcon
          iconName={roomObj?.type || roomObj?.name}
          data={bgColor ? { color: "white" } : { color: "black" }}
        />
        <Text
          className={`${bgColor ? "!text-white" : "text-black"} text-[13px]`}
        >
          {roomObj?.name}
        </Text>
      </ProjectMotionBtn>
    </>
  );
};

export default CLFloorDetailsMoldingSummaryBtns;

CLFloorDetailsMoldingSummaryBtns.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
