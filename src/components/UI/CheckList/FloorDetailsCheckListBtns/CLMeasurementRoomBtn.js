import React, { useEffect, useState } from "react";
import Text from "../../Text";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import GetRoomIcon from "../../../../assets/GetRoomIcon";
import { updateSingleCustomerApi } from "../../../../redux/customer";
import { useDrop } from "react-dnd";
import GetIconFile from "../../../../assets/GetIconFile";
import ProjectMotionBtn from "../../ProjectMotionBtn";

const CLMeasurementRoomBtn = ({
  className,
  buttonName,
  type = "button",
  roomObj,
  floor,
  activeMeasurementObj,
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
      if (item.type === "For") {
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        const floorName = floor.name; // Name of the floor
        const newMeasurementId = item.measurements?.id; // The new repair ID you want to add

        const measurementIndex = updatedSingleCustomer.measurements.findIndex(
          ({ id }) => id === item.measurements?.id
        );
        if (!item.measurements.for_room_id) {
          if (measurementIndex !== -1) {
            updatedSingleCustomer.measurements[measurementIndex] = {
              ...updatedSingleCustomer.measurements[measurementIndex],
              for_room_id: roomObj?.id,
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
              ].measurement_id = newMeasurementId;
            }
          }
        } else {
          const roomId = item.measurements.for_room_id; // Replace with the actual room ID
          const measurementIdToRemove = item.measurements?.id; // Replace with the repair ID to remove

          // Find the room within the floors array
          const updatedFloor = updatedSingleCustomer.scope.floors.map(
            (floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => {
                if (room?.id === roomId) {
                  return {
                    ...room,
                    measurement_id: "",
                  };
                }
                return room;
              }),
            })
          );
          updatedSingleCustomer.scope.floors = updatedFloor;

          if (measurementIndex !== -1) {
            updatedSingleCustomer.measurements[measurementIndex] = {
              ...updatedSingleCustomer.measurements[measurementIndex],
              for_room_id: roomObj?.id,
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
              ].measurement_id = newMeasurementId;
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
    if (roomObj.measurement_id === activeMeasurementObj?.id) {
      setBgColor("#1A65D6");
    } else if (
      roomObj.measurement_id &&
      roomObj.measurement_id !== activeMeasurementObj?.id
    ) {
      setBgColor("#808080");
    } else {
      setBgColor("");
    }
  }, [singleCustomerData, activeMeasurementObj]);

  const removeRepair = (roomObj) => {
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );

    // Remove for_room id from measurement
    const measurementIndex = updatedSingleCustomer.measurements.findIndex(
      ({ id }) => id === activeMeasurementObj?.id
    );

    const roomId = roomObj.id;
    const measurementIdToRemove = activeMeasurementObj?.id;
    updatedSingleCustomer.measurements[measurementIndex] = {
      ...updatedSingleCustomer.measurements[measurementIndex],
      for_room_id: "",
    };

    // Remove repair id from room array =>> repair_ids

    const updatedFloor = updatedSingleCustomer.scope.floors.map((floor) => ({
      ...floor,
      rooms: floor.rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              measurement_id: "",
            }
          : room
      ),
    }));
    console.log("updatedFloor", updatedFloor);

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
        {roomObj.measurement_id === activeMeasurementObj?.id && (
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

export default CLMeasurementRoomBtn;
