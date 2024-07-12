import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import CLFloorDetailsSummaryButton from "./CLFloorDetailsSummaryButton";
import { useSelector } from "react-redux";
import CLFloorDetailsMoldingSummaryBtns from "./ClFloorDetailsMoldingSummaryBtns";

const CLFloorDetailsProjectFloorSummary = ({
  addedFloors,
  floor,
  index,
  setRoomMolding,
  roomMolding,
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
      <div className="space-y-[6px] my-2 overflow-y-auto	h-[275px]">
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <>
              {(checkListActiveBtn === "existingMaterials" ||
                checkListActiveBtn === "subFloor") && (
                <CLFloorDetailsSummaryButton
                  src={room?.icon}
                  buttonName={room?.name}
                  type="button"
                  room={room}
                  roomObj={roomObj}
                  floor={floor}
                  setIsDragEnabled={() => {}}
                  onClick={() => {}}
                />
              )}
              {checkListActiveBtn === "molding" && (
                <CLFloorDetailsMoldingSummaryBtns
                  src={room?.icon}
                  buttonName={room?.name}
                  type="button"
                  room={room}
                  roomObj={roomObj}
                  floor={floor}
                  setIsDragEnabled={() => {}}
                  onClick={() => {}}
                  setRoomMolding={setRoomMolding}
                  roomMolding={roomMolding}
                />
              )}
            </>
          );
        })}
      </div>
    </Grid>
  );
};

export default CLFloorDetailsProjectFloorSummary;
