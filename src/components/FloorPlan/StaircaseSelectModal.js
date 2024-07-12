import React from "react";
import RoomSelectModalContent from "./RoomSelectModalContent";
import DialogModal from "./DialogModal";

const StaircaseSelectModal = (props) => {
  const { open, onClose } = props;

  return (
    <DialogModal
      open={open}
      onClose={onClose}
      title="Start Drawing A Room"
      ModalContent={RoomSelectModalContent}
      childComponentProps={{ onClose }}
    />
  );
};

export default StaircaseSelectModal;
