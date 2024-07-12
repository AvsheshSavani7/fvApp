import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import MatchingSummaryButton from "./MatchingSummaryButton";
import { useSelector } from "react-redux";
import MatchingInstallationButton from "./MatchingInstallationButton";

const MatchingProjectFloorSummary = ({
  addedFloors,
  floor,
  index,
  setRoomMatching,
  roomMatching,
}) => {
  const matchingActiveBtn = useSelector(
    (state) => state.customerReducer.matchingActiveBtn
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
      <div className="space-y-2 my-2 overflow-y-auto	h-[275px]">
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <>
              {matchingActiveBtn === "refinishing" && (
                <MatchingSummaryButton
                  src={room?.icon}
                  buttonName={room?.name}
                  type="button"
                  room={room}
                  roomObj={roomObj}
                  floor={floor}
                  setIsDragEnabled={() => {}}
                  onClick={() => {}}
                  setRoomMatching={setRoomMatching}
                  roomMatching={roomMatching}
                />
              )}
              {matchingActiveBtn === "installation" && (
                <MatchingInstallationButton
                  src={room?.icon}
                  buttonName={room?.name}
                  type="button"
                  room={room}
                  roomObj={roomObj}
                  floor={floor}
                  setIsDragEnabled={() => {}}
                  onClick={() => {}}
                  setRoomMatching={setRoomMatching}
                  roomMatching={roomMatching}
                />
              )}
            </>
          );
        })}
      </div>
    </Grid>
  );
};

export default MatchingProjectFloorSummary;
