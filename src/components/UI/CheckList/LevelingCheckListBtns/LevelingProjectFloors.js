import { Grid } from "@mui/material";
import React from "react";
import Text from "../../Text";
import roomtypes from "../../../../utils/roomTypes.json";
import LevelingProjectButton from "./LevelingProjectButton";
import { useDispatch, useSelector } from "react-redux";
import { updateSingleCustomerApi } from "../../../../redux/customer";

const LevelingProjectFloors = ({
  addedFloors,
  floor,
  index,
  activeLevelingObj,
  activeLevelingId,
  handleClickRoomArea,
}) => {
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const dispatch = useDispatch();

  const handleFloorClick = () => {
    let checkListIds = floor.rooms.map((id) => id.levelling_id);
    const isAllRoomSameId = checkListIds.every(
      (item) => item === activeLevelingId
    );
    const updatedSingleCustomer = JSON.parse(
      JSON.stringify(singleCustomerData)
    );
    if (isAllRoomSameId) {
      const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
        (item) => ({
          ...item,
          levelling_id: "",
        })
      );

      updatedSingleCustomer.scope.floors[index] = {
        ...updatedSingleCustomer.scope.floors[index],
        rooms: updatedData,
      };

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
    } else {
      const updatedData = updatedSingleCustomer.scope.floors[index].rooms.map(
        (item) => ({
          ...item,
          levelling_id: activeLevelingId,
        })
      );

      updatedSingleCustomer.scope.floors[index] = {
        ...updatedSingleCustomer.scope.floors[index],
        rooms: updatedData,
      };

      dispatch(updateSingleCustomerApi(updatedSingleCustomer));
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
        // onClick={() => handleFloorClick()}
      >
        <Text>{floor.name}</Text>
      </div>
      <div className="space-y-2 py-2 px-0.5 overflow-y-auto	h-[300px]">
        {floor.rooms.map((roomObj) => {
          const room = roomtypes.roomTypes.find(
            (e) => e.name === (roomObj?.type || roomObj.name)
          );
          return (
            <LevelingProjectButton
              src={room?.icon}
              buttonName={room?.name}
              type="button"
              room={room}
              roomObj={roomObj}
              floor={floor}
              setIsDragEnabled={() => {}}
              onClick={() => {}}
              activeLevelingObj={activeLevelingObj}
              activeLevelingId={activeLevelingId}
              handleClickRoomArea={handleClickRoomArea}
            />
          );
        })}
      </div>
    </Grid>
  );
};

export default LevelingProjectFloors;
