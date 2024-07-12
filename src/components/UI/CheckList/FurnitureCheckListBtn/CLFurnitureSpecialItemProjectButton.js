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

const CLFurnitureSpecialItemProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  activeRepairObj,
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
    accept: ["STAIRCASE"],
    drop: async (item) => {
      if (item.type === "Within") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const floorName = floor.name; // Name of the floor
        const newRepairId = item.specialitem?.id; // The new repair ID you want to add

        const repairIndex =
          updatedSingleCustomer.specialItem_furnitures.findIndex(
            ({ id }) => id === item.specialitem?.id
          );
        if (!item?.specialitem?.within_room_id.includes(roomObj?.id)) {
          if (repairIndex !== -1) {
            updatedSingleCustomer.specialItem_furnitures[0] = {
              ...updatedSingleCustomer.specialItem_furnitures[0],
              within_room_id: [
                ...updatedSingleCustomer.specialItem_furnitures[0]
                  .within_room_id,
                roomObj?.id,
              ],
            };
          }

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
              ].specialItem_id = newRepairId;
            }
          }
        }
        //  else {
        //   const roomId = item.repair.within_room_id; // Replace with the actual room ID
        //   const repairIdToRemove = item.repair?.id; // Replace with the repair ID to remove

        //   // Find the room within the floors array
        //   const updatedFloor = updatedSingleCustomer.scope.floors.map(
        //     (floor) => ({
        //       ...floor,
        //       rooms: floor.rooms.map((room) => {
        //         if (room?.id === roomId) {
        //           return {
        //             ...room,
        //             repair_ids: room.repair_ids.filter(
        //               (id) => id !== repairIdToRemove
        //             ),
        //           };
        //         }
        //         return room;
        //       }),
        //     })
        //   );
        //   updatedSingleCustomer.scope.floors = updatedFloor;

        //   if (repairIndex !== -1) {
        //     updatedSingleCustomer.repairs[repairIndex] = {
        //       ...updatedSingleCustomer.repairs[repairIndex],
        //       within_room_id: roomObj?.id,
        //     };
        //   }

        //   // // Find the floor index in the "floors" array
        //   const floorIndex = updatedSingleCustomer.scope.floors.findIndex(
        //     (floor) => floor.name === floorName
        //   );

        //   if (floorIndex !== -1) {
        //     // Find the room index in the "rooms" array within the floor
        //     const roomIndex = updatedSingleCustomer.scope.floors[
        //       floorIndex
        //     ].rooms.findIndex((room) => room?.id === roomObj?.id);

        //     if (roomIndex !== -1) {
        //       // Add the new repair ID to the "repair_ids" array of the room
        //       updatedSingleCustomer.scope.floors[floorIndex].rooms[
        //         roomIndex
        //       ].repair_ids.push(newRepairId);
        //     }
        //   }
        // }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const removeSpecialItem = () => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    updatedSingleCustomer.specialItem_furnitures[0] = {
      ...updatedSingleCustomer.specialItem_furnitures[0],
      within_room_id:
        updatedSingleCustomer.specialItem_furnitures[0].within_room_id.filter(
          (id) => id !== roomObj?.id
        ),
    };

    const repairIdToRemove = activeRepairObj?.id;

    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room?.id === roomObj.id
          ? {
              ...room,
              specialItem_id: "",
            }
          : room
      ),
    }));

    updatedSingleCustomer.scope.floors = updatedFloor;
    dispatch(updateSingleCustomerApi(updatedSingleCustomer));
  };

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
          backgroundColor: activeRepairObj?.within_room_id?.includes(
            roomObj?.id
          )
            ? "#1E2E5A"
            : "white",
          zIndex: "1 !important",
          opacity: isOver ? 0.5 : 1,
          marginTop: "4px",
        }}
        type={type}
        shouldExpandIconShow={true}
        handleClickRoomArea={(e) => handleClickRoomArea(e, roomObj)}
      >
        <GetRoomIcon
          iconName={buttonName}
          data={
            activeRepairObj?.within_room_id?.includes(roomObj?.id)
              ? { color: "white" }
              : { color: "#505050" }
          }
        />
        <Text
          className={`${
            activeRepairObj?.within_room_id?.includes(roomObj?.id)
              ? `text-white`
              : `!text-black`
          } text-[13px]`}
        >
          {roomObj?.name}
        </Text>
        {/* {roomObj.furniture_ids?.length > 0 && (
          <motion.div
            className={`absolute -bottom-0.5 -right-0.5 rounded-full padding-2.5 w-5 h-5 bg-[#009DC2] text-[14px] text-white`}
            transition={{ duration: 1 }}
          >
            {roomObj.furniture_ids?.length}
          </motion.div>
        )} */}
        {roomObj.specialItem_id && (
          <motion.div
            className={`absolute -top-1.5 -right-0.5 rounded-full bg-white padding-2.5`}
            onClick={() => removeSpecialItem(roomObj)}
            transition={{ duration: 1 }}
          >
            <GetIconFile
              data={{ width: "20px", height: "20px" }}
              iconName="remove-icon"
            />
          </motion.div>
        )}
      </ProjectMotionBtn>
    </div>
  );
};

export default CLFurnitureSpecialItemProjectButton;

CLFurnitureSpecialItemProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
