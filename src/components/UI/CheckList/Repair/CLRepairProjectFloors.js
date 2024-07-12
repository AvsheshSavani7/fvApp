import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import CLRepairProjectButton from "./CLRepairProjectButton";

const CLRepairProjectFloors = ({
  addedFloors,
  floor,
  index,
  activeRepairObj,
  handleClickRoomArea,
}) => {
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
      <div className="space-y-2 py-2 px-0.5 overflow-y-auto	h-[270px]">
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <CLRepairProjectButton
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
            />
          );
        })}
      </div>
    </Grid>
  );
};

export default CLRepairProjectFloors;
