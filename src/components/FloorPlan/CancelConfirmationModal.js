import React from "react";
import { Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MotionButton from "../UI/MotionButton";

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

const CancelConfirmationModal = (props) => {
  const { open, onClose, cancelDrawingRoomWithCorner } = props;

  return (
    <CustomDialog open={open}>
      <CustomDialogContent sx={{ position: "relative" }}>
        <CustomDialogTitle>Cancel drawing confirmation</CustomDialogTitle>
        <div className="absolute top-4 right-3" onClick={onClose}>
          <CloseIcon />
        </div>
        <div className="w-full h-[1px] absolute left-0 bg-gray-300 " />
        <div className="">
          <ul className="my-3 text-start text-sm mx-4">
            <li className="list-disc list-outside">
              Are you sure you want to cancel the drawing?
            </li>
          </ul>
          <div className="flex gap-2 mt-8 justify-end">
            <MotionButton
              className={`border-[1px] h-8 border-[#1e2e5a] text-black flex items-center justify-center`}
              onClick={onClose}
            >
              NO
            </MotionButton>
            <MotionButton
              className={`border-[1px] text-white border-gray-400 h-8 bg-[#1e2e5a] flex items-center justify-center`}
              onClick={cancelDrawingRoomWithCorner}
            >
              YES
            </MotionButton>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default CancelConfirmationModal;
