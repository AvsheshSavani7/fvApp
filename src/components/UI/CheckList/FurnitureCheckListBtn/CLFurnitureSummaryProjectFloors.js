import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import CLFurnitureSummaryProjectButton from "./CLFurnitureSummaryProjectButton";
import { useSelector } from "react-redux";

const CLFurnitureSummaryProjectFloors = ({
  addedFloors,
  floor,
  index,
  activeRepairObj,
  setActiveRoomFurnitureIds,
  activeRoomFurnitureIds,
}) => {
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );
  const handleClickFloor = () => {
    if (checkListActiveBtn === "standerd") {
      let lstFurnitureIds = [...activeRoomFurnitureIds];

      if (floor?.rooms?.every((room) => lstFurnitureIds?.includes(room?.id))) {
        let roomIds = floor?.rooms?.map((room) => {
          return room?.id;
        });
        lstFurnitureIds = lstFurnitureIds.filter(
          (roomId) => !roomIds.includes(roomId)
        );
      } else {
        floor?.rooms?.map((room) => {
          if (!lstFurnitureIds?.includes(room?.id)) {
            lstFurnitureIds.push(room?.id);
          }
        });
      }
      setActiveRoomFurnitureIds(lstFurnitureIds);
    }
  };

  return (
    <Grid
      item
      xs={12}
      md={addedFloors.length === 4 ? 3 : 4}
      key={`${floor.name}+${index}`}
      style={{ opacity: 1, position: "relative" }}
    >
      <div
        className="flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]"
        onClick={handleClickFloor}
      >
        <Text>{floor.name}</Text>
      </div>
      <div className="space-y-2 my-2 overflow-y-auto	h-[300px]">
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <CLFurnitureSummaryProjectButton
              src={room?.icon}
              buttonName={room?.name}
              type="button"
              room={room}
              roomObj={roomObj}
              floor={floor}
              setIsDragEnabled={() => {}}
              setActiveRoomFurnitureIds={setActiveRoomFurnitureIds}
              activeRoomFurnitureIds={activeRoomFurnitureIds}
              // drop={drop}
            />
          );
        })}
      </div>
    </Grid>
  );
};

export default CLFurnitureSummaryProjectFloors;
