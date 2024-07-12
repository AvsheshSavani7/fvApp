import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  selectMethod,
  setRoomToDraw,
  setDrawingRoomsInFloor,
} from "../../redux/floorPlan";
import MotionButton from "../UI/MotionButton";

const ButtonGroup = ["Start As Square", "Start Defining Corners"];

const RoomSelectModalContent = (props) => {
  const { onClose } = props;

  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);

  const drawingRooms = useSelector((state) => state.floorPlan.drawingRooms);
  const [selectedRoom, setSelectedRoom] = useState({});

  const dispatch = useDispatch();

  const floorName = useMemo(() => {
    return selectedFloor.name;
  }, [selectedFloor]);

  const rooms = useMemo(() => {
    const leftRooms = _.filter(
      selectedFloor?.rooms,
      (room) => !_.some(drawingRooms?.[floorName], (r) => r.id === room.id)
    );

    return leftRooms;
  }, [selectedFloor, drawingRooms, floorName]);

  const selectRoomToDraw = useCallback(
    (room) => {
      setSelectedRoom(room);
    },
    [setSelectedRoom]
  );

  const selectMethodToDraw = useCallback(
    (btn) => {
      let method = "";
      if (btn === "Start As Square") {
        method = "square";
      } else {
        method = "corner";
      }

      dispatch(selectMethod(method));
      dispatch(setRoomToDraw(selectedRoom));

      if (method !== "corner") {
        dispatch(
          setDrawingRoomsInFloor({
            room: selectedRoom,
            floorName,
          })
        );
      }
      onClose();
    },
    [selectedRoom, dispatch]
  );

  const makeButtonActive = useMemo(() => {
    const selectedRoomIsInCurrentRooms = _.some(
      rooms,
      (r) => r?.id === selectedRoom?.id
    );
    return selectedRoomIsInCurrentRooms;
  }, [rooms, selectedRoom]);

  return (
    <>
      <div className="space-y-2 flex flex-col items-center mt-4">
        {rooms.map((room) => {
          return (
            <MotionButton
              key={room.id}
              className={`border-[1px] text-black shadow-none w-1/2 ${
                selectedRoom?.name === room.name && "border-[#1e2e5a]"
              }`}
              onClick={() => selectRoomToDraw(room)}
            >
              {room.name}
            </MotionButton>
          );
        })}
      </div>
      <div className="flex gap-2 mt-10 mx-10">
        {ButtonGroup.map((btn, idx) => {
          return (
            <MotionButton
              key={btn + idx}
              disabled={!makeButtonActive}
              className={`border-[1px] text-white border-gray-400 w-full ${
                makeButtonActive ? "bg-[#1e2e5a]" : "bg-gray-300 !text-black"
              }`}
              onClick={() => selectMethodToDraw(btn)}
            >
              {btn}
            </MotionButton>
          );
        })}
      </div>
    </>
  );
};

export default RoomSelectModalContent;
