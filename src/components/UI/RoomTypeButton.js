import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "./Image";
import Text from "./Text";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";

const RoomTypeButton = ({
  room,
  className,
  src,
  buttonName,
  setIsDragEnabled,
  isDragEnabled,
}) => {

  const [{ isDragging, opacity }, drag, preview] = useDrag({
    type: "ROOM_TYPE",
    item: { room ,type:"ROOM_TYPE"},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    
   
  });

  return (
    <div ref={preview} style={{ opacity }}>
      <motion.button
        ref={drag}
        // initial={{ opacity: 0, y: -50 }}
        // animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: -100 }}
        // transition={{ duration: 0.5 }}
        className={`flex items-center text-[14px] rounded-full py-0 pr-[8px] pl-[4px] h-[44px] w-[117px] border-2 border-[#D8D8D8] gap-[4px] cursor-move ${className}`}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setIsDragEnabled(false)}
        onMouseLeave={() => setIsDragEnabled(true)}
        onTouchStart={() => setIsDragEnabled(false)}
        onTouchEnd={() => setIsDragEnabled(true)}
        // onDragStart={handleDragStart}
        //   onDragEnd={handleDragEnd}
        animate={{
          opacity: isDragging ? 0.7 : 1,
          // x: isDragging ? 10 : 0,
          // y: isDragging ? 10 : 0,
        }}
      >
        <Image src={src} />
        <Text className="text-ellipsis overflow-hidden">{buttonName}</Text>
      </motion.button>
    </div>
  );
};

export default RoomTypeButton;

RoomTypeButton.propTypes = {
  className: PropTypes.string,
  buttonName: PropTypes.string,
  src: PropTypes.string,
};
