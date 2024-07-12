import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import ProjectMotionBtn from "../../ProjectMotionBtn";
import { useSelector } from "react-redux";

const MatchingInstallationButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  setRoomMatching,
  roomMatching,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  var bgColor =
    roomObj?.id === roomMatching.roomId
      ? "#1A65D6"
      : !roomObj?.matching_installation_checklists_id ||
        roomObj?.matching_installation_checklists_id === "OutOfScope"
      ? "#D8D8D8"
      : "";

  const handleRoomRepairsClick = (room) => {
    if (room?.matching_installation_checklists_id) {
      let findMatching =
        singleCustomerData?.matching_installation_checklists?.find(
          (matching) =>
            matching.id === room?.matching_installation_checklists_id
        );
      setRoomMatching({ roomId: room?.id, matching: findMatching });
    } else {
      setRoomMatching({ roomId: room?.id, matching: {} });
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
          roomObj?.matching_installation_checklists_id &&
          roomObj?.matching_installation_checklists_id !== "OutOfScope"
            ? handleRoomRepairsClick(roomObj)
            : null
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

export default MatchingInstallationButton;

MatchingInstallationButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
