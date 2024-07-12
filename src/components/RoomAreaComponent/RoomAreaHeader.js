import React from "react";
import Text from "../UI/Text";
import GetIconFile from "../../assets/GetIconFile";
import Button from "../UI/Button";

const RoomAreaHeader = ({
  title,
  roomName,
  setSubQuesionsShow,
  handleAddShape,
  currentRoom,
}) => {
  return (
    <div className="w-full flex items-center justify-between h-[48px] px-[20px] mb-[3px] bg-[#F8F8F8]">
      <div className="w-full flex items-center gap-4">
        <div className="flex justify-start">
          <GetIconFile
            iconName="back-icon"
            onClick={() => setSubQuesionsShow(false)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Text className="text-[14px] font-medium">{title}</Text>
          <span>:</span>
          <span className="text-[14px] font-normal">{roomName}</span>
        </div>
      </div>
      {/* <div className="flex justify-end items-center gap-3 w-full">
        <Button
          className="round-small-btn !w-[30px] !h-[30px]"
          onClick={handleAddShape}
        >
          <span className="text-[16px]">+</span>
        </Button>
        <div className="flex items-center gap-2">
          <Text>Total SF:</Text>
          <Text className="font-semibold">{currentRoom?.totalSqFeet || 0}</Text>
        </div>
      </div> */}
    </div>
  );
};

export default RoomAreaHeader;
