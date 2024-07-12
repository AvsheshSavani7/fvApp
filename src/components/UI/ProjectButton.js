import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Text from "./Text";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../assets/GetRoomIcon";
import ProjectMotionBtn from "./ProjectMotionBtn";
import NoteField from "./QuestionTypes/NoteField";
import { TextField } from "@mui/material";
import RoomNameChangeField from "./RoomNameChangeField";
import { updateSingleCustomerApi } from "../../redux/customer";

const ProjectButton = ({
  className,
  src,
  buttonName,
  type = "button",
  onClick,
  pageType,
  roomObj,
  floor,
  setIsDragEnabled,
  roomIndex,
  activeRoomobj,
}) => {
  const activeRoomId = useSelector(
    (state) => state.customerReducer.activeRoomId
  );
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const [showTextfield, setShowTextfield] = useState(false);

  const [{ isDragging, opacity }, drag, preview] = useDrag({
    type: "FLOOR_INTERNAL",
    item: {
      room: { icon: src, name: buttonName },
      type: "FLOOR_INTERNAL",
      roomObj,
      floor,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  useLayoutEffect(() => {
    if (showTextfield) {
      inputRef.current.focus();
    }
  }, [showTextfield]);

  const handleDoubleClick = () => {
    setShowTextfield(true);
  };

  const handleBlurRoomName = (e) => {
    if (e.target.value) {
      const updatedSingleCustomer = JSON.parse(
        JSON.stringify(singleCustomerData)
      );
      const floorIndex = updatedSingleCustomer?.scope?.floors?.findIndex(
        (e) => e.name === floor?.name
      );
      if (floorIndex !== -1) {
        updatedSingleCustomer.scope.floors[floorIndex].rooms[roomIndex] = {
          ...updatedSingleCustomer?.scope?.floors?.[floorIndex]?.rooms?.[
            roomIndex
          ],
          name: e.target.value,
        };
        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        setShowTextfield(false);
      }
    } else {
      setShowTextfield(false);
    }
  };

  return (
    <>
      {pageType === "imageSelection" ? (
        <ProjectMotionBtn
          className={`${
            // activeRoomId.roomId === roomObj.id
            activeRoomobj?.id === roomObj.id
              ? "bg-[#1E2E5A] decoration-white	"
              : ""
          } ${className}`}
          type={type}
          onClick={onClick}
        >
          <GetRoomIcon
            iconName={roomObj?.type || roomObj?.name}
            data={
              // activeRoomId.roomId === roomObj.id
              activeRoomobj?.id === roomObj.id ? { color: "white" } : ""
            }
          />
          <Text
            className={`${
              // activeRoomId.roomId === roomObj.id
              activeRoomobj?.id === roomObj.id ? "text-white	" : ""
            } text-[13px]`}
          >
            {roomObj?.name}
          </Text>
        </ProjectMotionBtn>
      ) : // show button in 1st slide
      !showTextfield ? (
        <div
          ref={preview}
          style={{ opacity }}
          onDoubleClick={
            roomObj?.type === "Other" ? handleDoubleClick : () => {}
          }
        >
          <ProjectMotionBtn
            ref={drag}
            className={className}
            type={type}
            onMouseEnter={() => setIsDragEnabled(false)}
            onMouseLeave={() => setIsDragEnabled(true)}
            onTouchStart={() => setIsDragEnabled(false)}
            onTouchEnd={() => setIsDragEnabled(true)}
          >
            <GetRoomIcon iconName={roomObj?.type || roomObj?.name} />
            <Text className="text-[13px]">{roomObj?.name}</Text>
          </ProjectMotionBtn>
        </div>
      ) : (
        <RoomNameChangeField
          ref={inputRef}
          handleBlurRoomName={handleBlurRoomName}
          variant="outlined"
          roomIcon={<GetRoomIcon iconName={roomObj?.type || roomObj?.name} />}
        />
      )}
    </>
  );
};

export default ProjectButton;

ProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
