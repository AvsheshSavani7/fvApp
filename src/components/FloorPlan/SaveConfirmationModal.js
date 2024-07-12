import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MotionButton from "../UI/MotionButton";
import {
  clearlAllStates,
  setDrawingRoomsInFloor,
  setRoomToDraw,
} from "../../redux/floorPlan";

const CustomDialog = styled(Dialog)({
  overflow: "visible",
  "& .MuiDialog-paper": {
    width: "35%",
  },
});

const CustomDialogContent = styled(DialogContent)({
  width: "100%",
  height: "100%",
  paddingTop: 5,
});

const CustomDialogTitle = styled(DialogTitle)({
  padding: 10,
  textAlign: "center",
});

const SaveConfirmationModal = (props) => {
  const { open, onClose, setOpenFloorPlanDrawer, saveFloorPlanData } = props;
  const drawingRooms = useSelector((state) => state.floorPlan.drawingRooms);
  const initialDrawingRooms = useSelector(
    (state) => state.floorPlan.initialDrawingRooms
  );
  const params = useParams();

  const dispatch = useDispatch();

  const submitData = useCallback(
    async (btn) => {
      if (btn === "no") {
        dispatch(setDrawingRoomsInFloor(initialDrawingRooms));
        dispatch(setRoomToDraw(null));
      } else if (btn === "yes") {
        saveFloorPlanData();
      }
      onClose();
      setOpenFloorPlanDrawer(false);
    },
    [params, clearlAllStates, drawingRooms, initialDrawingRooms]
  );

  return (
    <CustomDialog open={open}>
      <CustomDialogContent sx={{ position: "relative" }}>
        <CustomDialogTitle>Save confirmation</CustomDialogTitle>
        <div className="absolute top-4 right-3" onClick={onClose}>
          <CloseIcon />
        </div>
        <div className="w-full h-[1px] absolute left-0 bg-gray-300 " />
        <div className="">
          <ul className="my-3 text-start text-sm mx-4">
            <li className="list-disc list-outside">
              Do you want to save changes you have made? if you press{" "}
              <span className="font-bold">NO</span>, then you will lose all your
              changes.
            </li>
          </ul>
          <div className="flex gap-2 mt-10 justify-end">
            <MotionButton
              className={`border-[1px] max-w-md border-[#1e2e5a] text-black
                     
                  `}
              onClick={() => submitData("no")}
            >
              NO
            </MotionButton>
            <MotionButton
              className={`border-[1px] text-white border-gray-400 max-w-md bg-[#1e2e5a]
                     
                  `}
              onClick={() => submitData("yes")}
            >
              YES
            </MotionButton>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default SaveConfirmationModal;
