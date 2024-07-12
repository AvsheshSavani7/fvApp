import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import CLFurnitureProjectButton from "./CLFurnitureProjectButton";
import { useSelector } from "react-redux";
import CLFurnitureSpecialItemProjectButton from "./CLFurnitureSpecialItemProjectButton";

const CLFurnitureProjectFloors = ({
  addedFloors,
  floor,
  index,
  activeRepairObj,
  handleClickRoomArea,
}) => {
  const checkListActiveBtn = useSelector(
    (state) => state.customerReducer.checkListActiveBtn
  );

  return (
    <Grid
      item
      xs={12}
      md={addedFloors.length === 4 ? 3 : 4}
      key={`${floor.name}+${index}`}
      style={{ opacity: 1, position: "relative" }}
    >
      <div className="flex items-center justify-center gap-2 rounded-full p-1 h-[44px] border-2 border-[#009DC2]">
        <Text>{floor.name}</Text>
      </div>
      <div
        className={`space-y-2 py-2 overflow-y-auto	${
          checkListActiveBtn === "specialitem" ? "h-[300px]" : "h-[300px]"
        }`}
      >
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <>
              {(checkListActiveBtn === "standerd" ||
                checkListActiveBtn === "kitchen") && (
                <CLFurnitureProjectButton
                  src={room?.icon}
                  buttonName={room?.name}
                  type="button"
                  room={room}
                  roomObj={roomObj}
                  floor={floor}
                  setIsDragEnabled={() => {}}
                  onClick={() => {}}
                  activeRepairObj={activeRepairObj}
                  handleClickRoomArea={handleClickRoomArea}
                  // drop={drop}
                />
              )}
              {checkListActiveBtn === "specialitem" && (
                <CLFurnitureSpecialItemProjectButton
                  src={room?.icon}
                  buttonName={room?.name}
                  type="button"
                  room={room}
                  roomObj={roomObj}
                  floor={floor}
                  setIsDragEnabled={() => {}}
                  onClick={() => {}}
                  activeRepairObj={activeRepairObj}
                  handleClickRoomArea={handleClickRoomArea}
                  // drop={drop}
                />
              )}
            </>
          );
        })}
      </div>
    </Grid>
  );
};

export default CLFurnitureProjectFloors;
