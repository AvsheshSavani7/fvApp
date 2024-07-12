import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MotionButton from "../UI/MotionButton";
import _ from "lodash";
import RoomSelectModal from "./RoomSelectModal";
import { CircularProgress } from "@mui/material";
import { setRoomToDraw } from "../../redux/floorPlan";

const FloorWithRooms = (props) => {
  const { isSaving, saveFloorPlanData, closeMainModal } = props;

  const [openSelectRoomModal, setOpenSelectRoomModal] = useState(false);

  const selectedFloor = useSelector((state) => state.floorPlan.selectedFloor);
  const drawingRooms = useSelector((state) => state.floorPlan.drawingRooms);
  const initialDrawingRooms = useSelector(
    (state) => state.floorPlan.initialDrawingRooms
  );
  const selectedRoomToDraw = useSelector(
    (state) => state.floorPlan.selectedRoomToDraw
  );
  const dispatch = useDispatch();

  const handleSelectRoomForDraw = useCallback(() => {
    setOpenSelectRoomModal(true);
  }, [setOpenSelectRoomModal]);

  const selectRoom = useCallback(
    (room) => {
      dispatch(setRoomToDraw(room));
    },
    [setRoomToDraw, dispatch]
  );

  const isDataChanged = useMemo(() => {
    return !_.isEqual(drawingRooms, initialDrawingRooms);
  }, [drawingRooms, initialDrawingRooms]);

  const makeSaveBtnDisable = useMemo(() => {
    return !isDataChanged || isSaving;
  }, [isDataChanged, isSaving]);

  return (
    <div>
      {selectedFloor && (
        <div className="mt-2">
          <div className="flex items-center justify-center p-2 rounded-md text-sm border-[1px] border-gray-400">
            {selectedFloor.name}
          </div>
          <div className="space-y-1 mt-2 overflow-y-auto h-[600px]">
            {drawingRooms[selectedFloor.name]?.map((room) => (
              <MotionButton
                key={room.id}
                className={`border-[1px] text-white border-gray-400 w-full ${
                  selectedRoomToDraw?.name === room.name
                    ? "bg-[#1e2e5a]"
                    : "bg-gray-200 !text-black border-[#1e2e5a]"
                }`}
                onClick={() => selectRoom(room)}
              >
                {room.name}
              </MotionButton>
            ))}
          </div>
          <RoomSelectModal
            open={openSelectRoomModal}
            onClose={() => setOpenSelectRoomModal(false)}
          />
        </div>
      )}
      <div className="flex flex-col justify-end space-y-2 absolute w-full bottom-2">
        {selectedFloor && (
          <MotionButton
            className="border-[1px] bg-[#1e2e5a] text-white border-gray-400 w-full"
            onClick={handleSelectRoomForDraw}
          >
            Draw A Room
          </MotionButton>
        )}
        <div className="flex gap-2 w-full">
          <MotionButton
            className={`flex justify-center items-center border-[1px] border-[#1e2e5a] text-black !min-w-[105px] ${
              makeSaveBtnDisable && "bg-gray-400 text-white border-none"
            }`}
            onClick={saveFloorPlanData}
            disabled={makeSaveBtnDisable}
          >
            {isSaving ? <CircularProgress size={15} /> : "Save"}
          </MotionButton>
          <MotionButton
            className="border-[1px] border-[#1e2e5a] text-black !min-w-[102px]"
            onClick={closeMainModal}
          >
            Close
          </MotionButton>
        </div>
      </div>
    </div>
  );
};

export default FloorWithRooms;
