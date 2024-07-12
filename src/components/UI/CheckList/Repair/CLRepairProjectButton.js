import React, { useEffect, useState } from "react";
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

const CLRepairProjectButton = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  activeRepairObj,
  handleClickRoomArea,
  // drop
}) => {
  const dispatch = useDispatch();

  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );

  const [{ isOver }, drop] = useDrop({
    accept: ["REPAIR"],
    drop: async (item) => {
      if (item.type === "Within") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const floorName = floor.name; // Name of the floor
        const newRepairId = item.repair?.id; // The new repair ID you want to add

        const repairIndex = updatedSingleCustomer.repairs.findIndex(
          ({ id }) => id === item.repair?.id
        );

        if (!!item?.repair?.within_staircase_id) {
          const updatedStaircases = updatedSingleCustomer?.staircases?.map(
            (st) => {
              if (st?.repair_ids?.includes(newRepairId)) {
                return {
                  ...st,
                  repair_ids:
                    st?.repair_ids?.filter((id) => id !== newRepairId) || [],
                };
              }
              return st;
            }
          );

          updatedSingleCustomer.staircases = updatedStaircases;
          updatedSingleCustomer.repairs[repairIndex] = {
            ...updatedSingleCustomer.repairs[repairIndex],
            within_staircase_id: "",
          };
        }

        if (!item.repair.within_room_id) {
          if (repairIndex !== -1) {
            updatedSingleCustomer.repairs[repairIndex] = {
              ...updatedSingleCustomer.repairs[repairIndex],
              within_room_id: roomObj?.id,
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
              ].repair_ids.push(newRepairId);
            }
          }
        } else {
          const roomId = item.repair.within_room_id; // Replace with the actual room ID
          const repairIdToRemove = item.repair?.id; // Replace with the repair ID to remove

          // Find the room within the floors array
          const updatedFloor = updatedSingleCustomer.scope.floors.map(
            (floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => {
                if (room?.id === roomId) {
                  return {
                    ...room,
                    repair_ids: room.repair_ids.filter(
                      (id) => id !== repairIdToRemove
                    ),
                  };
                }
                return room;
              }),
            })
          );
          updatedSingleCustomer.scope.floors = updatedFloor;

          if (repairIndex !== -1) {
            updatedSingleCustomer.repairs[repairIndex] = {
              ...updatedSingleCustomer.repairs[repairIndex],
              within_room_id: roomObj?.id,
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
              ].repair_ids.push(newRepairId);
            }
          }
        }

        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    if (
      roomObj.repair_ids.length > 0 &&
      roomObj.repair_ids.includes(activeRepairObj?.id)
    ) {
      setBgColor("#1A65D6");
    } else {
      setBgColor("");
    }
  }, [singleCustomerData, activeRepairObj]);

  const removeRepair = () => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    // Remove within_room id from repair
    const repairIndex = updatedSingleCustomer.repairs.findIndex(
      ({ id }) => id === activeRepairObj?.id
    );
    updatedSingleCustomer.repairs[repairIndex] = {
      ...updatedSingleCustomer.repairs[repairIndex],
      within_room_id: "",
    };

    // Remove repair id from room array =>> repair_ids
    const roomId = activeRepairObj.within_room_id;
    const repairIdToRemove = activeRepairObj?.id;

    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              repair_ids: room.repair_ids.filter(
                (id) => id !== repairIdToRemove
              ),
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
        className={`decoration-black ${className} relative`}
        style={
          bgColor
            ? {
                backgroundColor: `${bgColor}`,
                zIndex: "1 !important",
                opacity: isOver ? 0.5 : 1,
              }
            : {
                backgroundColor: "white",
                zIndex: "1 !important",
                opacity: isOver ? 0.5 : 1,
              }
        }
        type={type}
        shouldExpandIconShow={true}
        handleClickRoomArea={(e) => handleClickRoomArea(e, roomObj)}
      >
        <GetRoomIcon
          iconName={roomObj?.type || roomObj?.name}
          data={bgColor ? { color: "white" } : { color: "#505050" }}
        />
        <Text
          className={`${bgColor ? "!text-white" : "text-black"} text-[13px]`}
        >
          {roomObj?.name}
        </Text>
        {roomObj.repair_ids?.includes(activeRepairObj?.id) && (
          <motion.div
            className={`absolute -top-1.5 -right-0.5 rounded-full bg-white padding-2.5`}
            onClick={() => removeRepair(roomObj)}
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

export default CLRepairProjectButton;

CLRepairProjectButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit"]),
};
