import { Grid } from "@mui/material";
import React, { useState } from "react";
import ProjectButton from "./ProjectButton";
import Text from "./Text";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { singleCustomer, updateSingleCustomerApi } from "../../redux/customer";
import { v4 as uuidv4 } from "uuid";
import roomtypes from "../../utils/roomTypes.json";
import GetIconFile from "../../assets/GetIconFile";
import {
  changeFloorNameByFloorIndex,
  changeFloornameByFloorIndex
} from "../../helper/helper";

const ProjectFloors = ({
  addedFloors,
  floor,
  index,
  setIsDragEnabled,
  handleRemoveClick
}) => {
  const { name } = floor;
  const dispatch = useDispatch();
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const [{ isOver }, drop] = useDrop({
    accept: ["ROOM_TYPE", "FLOOR_INTERNAL"],
    drop: async (item) => {
      if (item.type === "ROOM_TYPE") {
        const droppedRoom = item.room;
        // Create a copy of the state to modify
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        // Find the floor index using the correct condition (name === name)
        const floorIndex = updatedSingleCustomer.scope.floors.findIndex(
          (e) => e.name === name
        );

        // If the floor with the matching name exists, update it with the new room
        if (floorIndex !== -1) {
          const findFloor = updatedSingleCustomer.scope.floors[floorIndex];

          let dimesionObj = {
            id: uuidv4(),
            shape: "Rectangle",
            length: "",
            width: "",
            sqFeet: "",
            closet: false,
            scope: true
          };

          const roomObject = {
            name: droppedRoom.name,
            type: droppedRoom.name,
            id: uuidv4(),
            images: [],
            dimensions: [dimesionObj],
            subRooms: [],
            roomItems: [],
            totalSqFeet: 0,
            finalTotalSqFeet: "",
            area: "",
            linear_ft: "",
            matching_refinishing_checklists_id: "",
            matching_installation_checklists_id: "",
            specialItem_id: "",
            refinishing_checklists_id: "",
            installation_checklist_id: "",
            subfloor_detail_id: "",
            existing_material_id: "",
            molding_id: "",
            levelling_id: [],
            matching_id: "",
            repair_ids: [],
            transition_from_ids: [],
            transition_to_ids: [],
            transition_within_ids: [],
            furniture_ids: [],
            note: ""
          };

          // Create a new copy of the floor with the updated rooms
          updatedSingleCustomer.scope.floors[floorIndex].rooms = [
            ...updatedSingleCustomer.scope.floors[floorIndex].rooms,
            roomObject
          ];

          updatedSingleCustomer.scope = await changeFloorNameByFloorIndex(
            updatedSingleCustomer,
            droppedRoom
          );
        }

        // Dispatch the action to update the Redux store with the modified state
        dispatch(updateSingleCustomerApi(updatedSingleCustomer));
      } else if (item.type === "FLOOR_INTERNAL") {
        const droppedRoom = item?.room;
        // Create a copy of the state to modify
        const updatedSingleCustomer = JSON.parse(
          JSON.stringify(singleCustomerData)
        );

        // Find the floor index using the correct condition (name === name)
        const floorIndex = updatedSingleCustomer.scope.floors.findIndex(
          (e) => e.name === name
        );

        // If the floor with the matching name exists, update it with the new room
        if (floorIndex !== -1) {
          if (name !== item.floor.name) {
            const oldFloorIndex = updatedSingleCustomer.scope.floors.findIndex(
              (e) => e.name === item.floor.name
            );
            const removeRoomFromFloor =
              await updatedSingleCustomer.scope.floors[
                oldFloorIndex
              ].rooms.filter((room) => room.id !== item.roomObj.id);

            updatedSingleCustomer.scope.floors[oldFloorIndex].rooms = [
              ...removeRoomFromFloor
            ];

            // Create a new copy of the floor with the updated rooms
            updatedSingleCustomer.scope.floors[floorIndex].rooms = [
              ...updatedSingleCustomer.scope.floors[floorIndex].rooms,
              item.roomObj
            ];
          }
          updatedSingleCustomer.scope = await changeFloorNameByFloorIndex(
            updatedSingleCustomer,
            droppedRoom
          );

          // Dispatch the action to update the Redux store with the modified state
          dispatch(updateSingleCustomerApi(updatedSingleCustomer));
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <Grid
      item
      xs={12}
      md={addedFloors.length === 4 ? 3 : 4}
      key={`${floor.name}+${index}`}
      ref={drop}
      style={{ opacity: isOver ? 0.5 : 1, position: "relative" }}
    >
      <div className="flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]">
        <Text>{floor.name}</Text>
        <div
          className={`absolute -top-1 -right-1`}
          onClick={() => handleRemoveClick(floor.name, floor?.id)}
        >
          <GetIconFile iconName="remove-icon" />
        </div>
      </div>
      <div
        className="space-y-2 my-2  overflow-y-auto	h-[326px]"
        // style={{height:"calc(100% - 196px"}}
      >
        {floor.rooms.map((roomObj, roomIndex) => {
          const room = roomtypes?.roomTypes?.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <ProjectButton
              roomIndex={roomIndex}
              src={room?.icon}
              buttonName={roomObj?.name}
              type="button"
              room={room}
              roomObj={roomObj}
              floor={floor}
              setIsDragEnabled={(value) => setIsDragEnabled(value)}
            />
          );
        })}
      </div>
    </Grid>
  );
};

export default ProjectFloors;
