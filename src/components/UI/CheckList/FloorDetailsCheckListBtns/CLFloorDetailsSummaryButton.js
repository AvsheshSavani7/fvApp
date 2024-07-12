import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const CLFloorDetailsSummaryButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
}) => {
  var bgColor = roomObj.bgColor ? roomObj.bgColor : "";

  return (
    <>
      <ProjectMotionBtn
        className={`decoration-black ${className} `}
        style={
          bgColor
            ? { backgroundColor: `${bgColor}` }
            : { backgroundColor: "white" }
        }
        type={type}
      >
        <GetRoomIcon
          iconName={buttonName}
          data={bgColor ? { color: "white" } : { color: "black" }}
        />
        <Text className={`${bgColor ? "!text-white" : "text-black"} text-[13px]`}>
          {roomObj?.name}
        </Text>
      </ProjectMotionBtn>
    </>
  );
};

export default CLFloorDetailsSummaryButton;

CLFloorDetailsSummaryButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
