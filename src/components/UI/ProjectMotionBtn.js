import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import GetIconFile from "../../assets/GetIconFile";

const ProjectMotionBtn = forwardRef(
  (
    {
      children,
      className,
      style,
      type,
      onClick,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      onMouseEnter,
      shouldExpandIconShow,
      handleClickRoomArea,
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 1 }}
        className={`w-full flex items-center relative rounded-full py-0 pr-[8px] pl-[4px] h-[44px]  border-2 border-[#D8D8D8] gap-[4px] 
          }  decoration-black ${className} `}
        style={style}
        type={type}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
        {shouldExpandIconShow && (
          <div
            className="absolute -top-[15px] -left-2 p-2"
            onClick={handleClickRoomArea}
          >
            <GetIconFile
              iconName="expand-icon"
              data={{ width: "18", height: "18" }}
            />
          </div>
        )}
      </motion.button>
    );
  }
);

export default ProjectMotionBtn;
