import React from "react";
import { Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomDialog = styled(Dialog)({
  overflow: "visible",
  "& .MuiDialog-paper": {
    width: "100%",
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

const DialogModal = (props) => {
  const { open, onClose, title, ModalContent, childComponentProps } = props;

  return (
    <CustomDialog open={open}>
      <CustomDialogContent sx={{ position: "relative" }}>
        <CustomDialogTitle>{title}</CustomDialogTitle>
        <div className="absolute top-4 right-3" onClick={onClose}>
          <CloseIcon />
        </div>
        <div className="w-full h-[1px] absolute left-0 bg-gray-300 " />
        <ModalContent {...childComponentProps} />
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default DialogModal;
