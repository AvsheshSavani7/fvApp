import React from "react";
import PropTypes from "prop-types";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { v4 as uuidv4 } from "uuid";
import { updateSingleCustomerApi } from "../../../../redux/customer";
import { useDrop } from "react-dnd";
import GetIconFile from "../../../../assets/GetIconFile";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const CLFurnitureProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  handleClickRoomArea,
}) => {
  const dispatch = useDispatch();

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );

  const [{ isOver }, drop] = useDrop({
    accept: ["FURNITURE_TYPE"],
    drop: async (item) => {
      if (item.type === "FURNITURE_TYPE") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const floorName = floor.name; // Name of the floor
        const newFurnitureId = uuidv4(); // The new repair ID you want to add

        updatedSingleCustomer.furnitures = [
          ...updatedSingleCustomer.furnitures,
          { ...item.furniture, id: newFurnitureId, room_id: roomObj.id },
        ];

        // // Find the floor index in the "floors" array
        const floorIndex = updatedSingleCustomer.scope.floors.findIndex(
          (floor) => floor.name === floorName
        );

        if (floorIndex !== -1) {
          // Find the room index in the "rooms" array within the floor
          const roomIndex = updatedSingleCustomer.scope.floors[
            floorIndex
          ].rooms.findIndex((room) => room?.id === roomObj?.id);

          if (roomIndex !== -1) {
            // Add the new repair ID to the "repair_ids" array of the room
            updatedSingleCustomer.scope.floors[floorIndex].rooms[
              roomIndex
            ].furniture_ids.push(newFurnitureId);
          }
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      style={{
        opacity: isOver ? 0.5 : 1,
        transform: `scale(${isOver ? 0.95 : 1})`,
      }}
    >
      <ProjectMotionBtn
        ref={drop}
        className={` decoration-black ${className} relative`}
        style={{
          backgroundColor:
            checkListActiveBtn === "standerd"
              ? `#1E2E5A`
              : checkListActiveBtn === "kitchen" && roomObj.type === "Kitchen"
              ? `#1E2E5A`
              : "#D8D8D8",
          zIndex: "1 !important",
          opacity: isOver ? 0.5 : 1,
        }}
        type={type}
        shouldExpandIconShow={true}
        handleClickRoomArea={(e) => handleClickRoomArea(e, roomObj)}
      >
        <GetRoomIcon iconName={buttonName} data={{ color: "white" }} />
        <Text className="!text-white text-[13px]">{roomObj?.name}</Text>
        {checkListActiveBtn !== "kitchen" &&
          roomObj.furniture_ids?.length > 0 && (
            <motion.div
              className={`absolute -bottom-0.5 -right-0.5 rounded-full padding-2.5 w-5 h-5 bg-[#009DC2] text-[14px] text-white`}
              transition={{ duration: 1 }}
            >
              {roomObj.furniture_ids?.length}
            </motion.div>
          )}
      </ProjectMotionBtn>
    </div>
  );
};

export default CLFurnitureProjectButton;

CLFurnitureProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
